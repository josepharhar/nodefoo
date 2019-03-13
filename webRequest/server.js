const http = require('http');
const https = require('https');
const fs = require('fs');

//const httpPort = process.env.PORT || 8000;
const httpPort = 8000;
const httpUrl = `http://localhost:${httpPort}`;
const httpsPort = 8443;
const httpsUrl = `https://localhost:${httpsPort}`;

function incomingMessageToJson(req) {
  const obj = {
    aborted: req.aborted,
    complete: req.complete,
    headers: req.headers,
    httpVersion: req.httpVersion,
    method: req.method,
    rawTrailers: req.rawTrailers,
    //socket: req.socket,
    socket: {
      encrypted: req.socket.encrypted
    },
    statusCode: req.statusCode,
    statusMessage: req.statusMessage,
    trailers: req.trailers,
    url: req.url
  };

  /*for (const prop in req) {
    if (!obj.hasOwnProperty(prop))
      obj[prop] = 'present in req, unset here';
  }*/

  // sort
  const ordered = {};
  Object.keys(obj).sort().forEach(key => {
    ordered[key] = obj[key];
  });
  return ordered;
}

function handleRequest(req, res) {
  console.log(`${req.method} ${req.url}`);
  //console.log(JSON.stringify(incomingMessageToJson(req), null, 2));
  console.log('req.socket.encrypted: ' + req.socket.encrypted);

  if (!req.socket.encrypted) {
    res.writeHead(307, {
      'content-type': 'text/plain',
      location: httpsUrl
    });
    res.end('redirecting from http to https');
    return;
  }

  switch (req.url) {
    case '/':
      res.writeHead(200, {
        'content-type': 'text/plain',
        'strict-transport-security': 'max-age=106384710; includeSubDomains; preload'
      });
      res.end('hello world');
      break;

    default:
      res.writeHead(404, {'content-type': 'text/plain'});
      res.end('404 not found: ' + req.url);
  }
}

const httpServer = http.createServer(handleRequest);
httpServer.on('listening', () => console.log('http server listening on ' + httpPort));
httpServer.listen(httpPort, 'localhost');

const httpsOptions = {
  key: fs.readFileSync('mockserver.key'),
  cert: fs.readFileSync('mockserver.crt')
};
const httpsServer = https.createServer(httpsOptions, handleRequest);
httpsServer.on('listening', () => console.log('https server listening on ' + httpsPort));
httpsServer.listen(httpsPort, 'localhost');
