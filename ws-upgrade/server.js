const http = require('http');

const ws = require('ws');

const httpPort = process.env.PORT || 8000;
const wsPort = httpPort;

const websocketServer = new ws.Server({noServer: true});
websocketServer.on('connection', socket => {
  socket.on('message', data => console.log('recieved message: ' + data));
  socket.on('ping', data => console.log('received ping: ' + data));
  socket.on('pong', data => console.log('recieved pong: ' + data));

  console.log('new connection');

  socket.send('sending 300 byte array...');
  const array = new Uint8Array(300);
  for (let i = 0; i < array.length; i++) {
    array[i] = i;
  }
  socket.send(array);

  const str = 'sending this utf-8 string as a binary message...';
  socket.send(str);
  socket.send(Buffer.from(str));

  socket.send('sending latin1 string...');
  socket.send(Buffer.from(['H'.charCodeAt(0), 0xe9, 'l'.charCodeAt(0), 'l'.charCodeAt(0),
        0xf6, ' '.charCodeAt(0), 'w'.charCodeAt(0), 0xf8, 'r'.charCodeAt(0), 'l'.charCodeAt(0), 0xd0]));
});
websocketServer.on('close', () => console.log('websocketServer got close event'));
websocketServer.on('error', err => {
  console.log('websocketServer got error event:');
  console.log(err);
});

const html = `
<head>
  <title>WebSocket Testing</title>
  <script>
    function ws() {
      const websocket = new WebSocket('ws://' + location.host);
      window.websocket = websocket;
      websocket.onopen = event => {
        websocket.send('browser sending empty binary message...');
        websocket.send(new Uint8Array());
        websocket.send('browser sending binary message...');
        websocket.send(new Uint8Array([1, 2, 3, 4]));
      };
      websocket.onmessage = event => {
        console.log('message from server: ' + event.data);
      };
    }
  </script>
</head>
<body onload="ws()">
  <h1>WebSocket Testing</h1>
</body>
`;

const httpServer = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  console.log('  user-agent: ' + req.headers['user-agent']);

  switch (req.url) {
    case '/':
      res.writeHead(200, {'content-type': 'text/html'});
      res.end(html);
      break;

    default:
      res.writeHead(404, {'content-type': 'text/plain'});
      res.end('404 not found: ' + req.url);
  }
});
httpServer.on('upgrade', (req, socket, head) => {
  console.log(`${req.method} ${req.url} UPGRADE`);
  console.log('  user-agent: ' + req.headers['user-agent']);
  websocketServer.handleUpgrade(req, socket, head, websocket => {
    websocketServer.emit('connection', websocket, req);
  });
});
httpServer.listen(httpPort, 'localhost');

console.log('starting servers...');
