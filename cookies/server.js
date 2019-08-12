const http = require('http');

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url} ${JSON.stringify(req.headers, null, 2)}`);

  switch (req.url) {
    case '/':
      res.setHeader('set-cookie', [
        'secure=only; SecureOnly',
        'custom=path; Path=/rofl',
        'one=two'
      ]);
      res.writeHead(200);
      res.end('hello world');
      break;

    default:
      res.writeHead(404, {'content-type': 'text/plain'});
      res.end('404 not found: ' + req.url);
      break;
  }
});
server.listen(8000);
