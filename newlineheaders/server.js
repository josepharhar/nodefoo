const http = require('http');

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url} ${JSON.stringify(req.headers, null, 2)}`);

  switch (req.url) {
    case '/':
      //res.setHeader('set-cookie', ['one=two', 'foo=bar'/*, 'newline=new\nline'*/]);
      let one = '', two = '', three = '';
      for (let i = 0; i < 2000; i++) {
        one += 'a';
        two += 'b';
        three += 'c';
      }
      //res.setHeader('set-cookie', ['one=' + one, 'two=' + two, 'three=' + three]);
      res.writeHead(200, {'content-type': 'text/plain'});
      res.end('hello world');
      break;

    default:
      res.writeHead(404, {'content-type': 'text/plain'});
      res.end('404 not found: ' + req.url);
      break;
  }
});
server.listen(8000);
