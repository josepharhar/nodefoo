// https://github.com/GoogleChrome/puppeteer/issues/795
const http = require('http');
const path = require('path');

const puppeteer = require('puppeteer');

const charsetToBuffer = {
  'utf8': Buffer.from('测试'),
  'iso-8859-1': Buffer.from(['H', 0xe9, 'l', 'l', 0xf6, ' ', 'w', 0xf8, 'r', 'l', 0xd0]),
  'us-ascii': Buffer.from('Hello world')
};

function handleRequest(req, res) {
  const {root, base} = path.parse(req.url);
  if (!charsetToBuffer[base]) {
    res.writeHead(404, {'content-type': 'text/html'});
    res.end('404 not found: ' + req.url);
    return;
  }

  if (root === 'withcharset') {
    res.writeHead(200, {'content-type': 'text/html; charset=' + base});
  } else {
    res.writeHead(200, {'content-type': 'text/html'});
  }
  res.end(charsetToBuffer[base]);
}

async function startServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer(handleRequest);
    server.on('error', err => {
      console.err('server listen error: ' + err);
      reject(err);
    });
    server.on('listening', () => resolve(server));
    server.listen(8000, 'localhost');
  });
}

async function doRequest(browser, charset, withCharset) {
  return new Promise(async resolve => {
    const url = `http://localhost:8000/${withCharset ? 'withcharset' : 'nocharset'}/${charset}`;
    const page = await browser.newPage();
    page.once('response', async response => {
      console.log('url: ' + url);
      console.log('original: ' + charsetToBuffer[charset].toString('hex'));
      console.log('received: ' + (await response.buffer()).toString('hex'));
      console.log();
      resolve();
    });
    await page.goto(url);
  });
}

(async () => {
  const server = await startServer();
  const browser = await puppeteer.launch({
    //headless: false,
    executablePath: '/usr/local/google/home/jarhar/chromium/src/out/Release/chrome'
  });
  for (const charset in charsetToBuffer) {
    await doRequest(browser, charset, true);
    await doRequest(browser, charset, false);
  }
  browser.close();
  server.close();
})();
