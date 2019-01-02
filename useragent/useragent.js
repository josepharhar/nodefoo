const http = require('http');

const sw = `
this.addEventListener('fetch', fetchEvent => {
  const headers = {};
  fetchEvent.request.headers.forEach((val, key) => {
    headers[key] = val;
  });
  console.log('[sw.js] forwarding fetch for url: ' + fetchEvent.request.url + ', headers: ' + JSON.stringify(headers, null, 2));

  fetchEvent.respondWith(async function () {
    const preload = await fetchEvent.preloadResponse;
    console.log('[sw.js] fetchEvent.preloadResponse: ' + preload);

    const f = await fetch(fetchEvent.request);
    return f;
  }());
});

this.addEventListener('activate', activateEvent => {
  activateEvent.waitUntil(async function() {
    if (self.registration.navigationPreload) {
      console.log('[sw.js] disabling navigation preload...');
      await self.registration.navigationPreload.disable();
      console.log('[sw.js] disabled navigation preload');
    }
  }());
});
`;

const doc = useragent => {
  return `
<head>
  <title>jarhar test</title>
  <script>
  function installsw() {
    navigator.serviceWorker.register('/sw.js');
  }
  </script>
</head>
<body onload="installsw()">
<h1>user-agent:</h1>
<h2>${useragent}</h2>
</body>
`;
};

async function handleRequest(req, res) {
  console.log(`${req.method} ${req.url} ${JSON.stringify(req.headers, null, 2)}`);
  const useragent = req.headers['user-agent'];
  //console.log('  ' + useragent);

  switch (req.url) {
    case '/':
      res.writeHead(200, {'content-type': 'text/html'});
      res.end(doc(useragent));
      break;

    case '/sw.js':
      res.writeHead(200, {'content-type': 'application/javascript'});
      res.end(sw);
      break;

    default:
      res.writeHead(404, {'content-type': 'text/plain'});
      res.end('404 not found');
  }
}

async function server(port) {
  return new Promise((resolve, reject) => {
    const server = http.createServer(handleRequest);
    server.on('error', err => {
      console.log('server listen error: ' + err);
      reject(err);
    });
    server.on('listening', resolve);
    server.listen(port, 'localhost');
  });
}

(async () => {
  const port = 8000;
  await server(port);
  console.log('listening on ' + port);
})();
