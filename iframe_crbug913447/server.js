const http = require('http');
const puppeteer = require('puppeteer-core');

function html() {
  return `
<head>
</head>
<body>
</body>
`;
}

http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  switch (req.url) {
    case '/':
      break;

    default:
      res.writeHead(404, {'content-type': 'text/plain'});
      res.end('404 ' + req.url);
  }
}).listen(8000, 'localhost');

puppeteer.launch({executablePath: '/Users/jarhar/chromium/src/out/Release/Chromium.app/Contents/MacOS/Chromium'});
