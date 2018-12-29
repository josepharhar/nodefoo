const http = require('http');
const fs = require('fs');
const path = require('path');

const html = (useragent, js) => {
  return `
<head>
  <title>navpre</title>
  <script>${js}</script>
</head>
<body>
  <h1>user agent:</h1>
  <h2>${useragent}</h2>
</body>
`;
};

function logHeaders(headers) {
  for (const key in headers) {
    switch (key) {
      case 'user-agent':
      case 'service-worker-navigation-preload':
        console.log(`  ${key}: ${headers[key]}`);
        break;
    }
  }
}

http.createServer((req, res) => {
  //console.log(`${req.method} ${req.url} ${JSON.stringify(req.headers, null, 2)}`);
  //console.log(`${req.method} ${req.url}\n  ${req.headers['user-agent']}`);
  console.log(`${req.method} ${req.url}`);
  logHeaders(req.headers);
  console.log();

  switch (req.url) {
    case '/':
      res.writeHead(200, {'content-type': 'text/html'});
      res.end(html(
        req.headers['user-agent'],
        fs.readFileSync(path.join(__dirname, '/client.js'))));
      break;

    case '/sw.js':
      res.writeHead(200, {'content-type': 'application/javascript'});
      res.end(fs.readFileSync(path.join(__dirname, req.url)));
      break;

    default:
      res.writeHead(404, {'content-type': 'text/plain'});
      res.end('404 not found: ' + req.url);
  }
}).listen(8000, 'localhost');
