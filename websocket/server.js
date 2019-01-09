const http = require('http');

const ws = require('ws');

const httpPort = 8000;
const wsPort = 48880;

const websocketServer = new ws.Server({port: wsPort});
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

const html = `
<head>
  <title>WebSocket Testing</title>
  <script>
    function ws() {
      const websocket = new WebSocket('ws://localhost:${wsPort}');
      window.websocket = websocket;
      websocket.onopen = event => {
        websocket.send('hello from browser');
        websocket.send(new Uint8Array('hello from browser'));
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
httpServer.listen(httpPort, 'localhost');

console.log('starting servers...');
