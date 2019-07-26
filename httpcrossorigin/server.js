const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();

function printHeaders(req, res, next) {
  console.log(`${req.method} ${JSON.stringify(req.headers, null, 2)}`);
  next();
}

app.use(printHeaders);
app.use(cors());
app.use((req, res, next) => {
  const hostHeader = req.headers['host'];
  if (hostHeader.includes('localhost')) {
    res.setHeader('set-cookie', ['local=host', 'hello=world']);
  } else if (hostHeader.includes('127.0.0.1')) {
    res.setHeader('set-cookie', '127=1');
  }
  next();
});

app.use(express.static(__dirname));

app.get('/asdf', (req, res) => {
  res.writeHead(200, 'hello world', {'content-type': 'text/plain'});
  res.end('hello from /asdf');
});

app.get('/delay', async (req, res) => {
  //await new Promise(resolve => setTimeout(resolve, 2000));
  res.writeHead(200, {});
  const str = fs.createReadStream(__dirname + '/image.jpg');
  str.pipe(res);
});

app.get('/1', (req, res) => {
  res.writeHead(307, {
    'content-type': 'text/plain',
    'location': 'http://127.0.0.1:8002/2'
  });
  res.end('hello from /1');
});

app.listen(8000, 'localhost');

const app2 = express();
app2.use(printHeaders);
app2.use(cors());
app2.get('/2', (req, res) => {
  res.writeHead(307, {
    'content-type': 'text/plain',
    'location': 'http://127.0.0.1:8003/3'
  });
  res.end('hello from /2');
});
app2.listen(8002, 'localhost');

const app3 = express();
app3.use(printHeaders);
app3.use(cors());
app3.get('/3', (req, res) => {
  res.writeHead(200, {'content-type': 'text/plain'});
  res.end('hello from /3');
});
app3.listen(8003, 'localhost');
