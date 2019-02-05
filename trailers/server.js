const http = require('http');

const httpPort = process.env.PORT || 8000;

const html = `
<head>
  <title>Trailers Testing</title>
  <script>
    function builddom() {
      const main = document.querySelector('#main');

      const button = document.createElement('input');
      button.setAttribute('type', 'button');
      button.setAttribute('value', 'send fetch');
      button.setAttribute('onclick', 'sendfetch()');
      main.appendChild(button);

      const xhrButton = document.createElement('input');
      xhrButton.setAttribute('type', 'button');
      xhrButton.setAttribute('value', 'send xhr');
      xhrButton.setAttribute('onclick', 'sendxhr()');
      main.appendChild(xhrButton);
    }
    async function sendfetch() {
      function getHeadersObj(response) {
        const obj = {};
        for (const headerPair of response.headers) {
          obj[headerPair[0]] = headerPair[1];
        }
        return obj;
      }

      const response = await fetch('/trailers');
      console.log('fetch() response.headers: ' + JSON.stringify(getHeadersObj(response), null, 2));
    }
    async function sendxhr() {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', '/trailers');
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4)
          console.log('xhr headers: ' + xhr.getAllResponseHeaders());
      };
      xhr.send();
    }
  </script>
</head>
<body onload="builddom()">
  <h1>Trailers Testing</h1>
  <div id="main"></div>
</body>
`;

const httpServer = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  switch (req.url) {
    case '/':
      res.writeHead(200, {'content-type': 'text/html'});
      res.end(html);
      break;

    case '/trailers':
      res.writeHead(200, {'content-type': 'text/plain',
                          'trailer': 'X-my-trailer'});
      res.write('sending trailers...');
      res.addTrailers({'X-my-trailer': 'my-trailer-value'});
      res.end();
      break;

    default:
      res.writeHead(404, {'content-type': 'text/plain'});
      res.end('404 not found: ' + req.url);
  }
});
httpServer.listen(httpPort, 'localhost');