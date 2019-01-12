const http = require('http');

const html = `
<html>
  <head>
    <title>randomn</title>
    <script>
      function randomn() {
        const numReqs = parseInt(document.querySelector('#postinput').value);
        for (let i = 0; i < numReqs; i++) {
          fetch('/randomn');
        }
      }
      function init() {
        const main = document.querySelector('#main');

        const textInput = document.createElement('input');
        textInput.setAttribute('type', 'text');
        textInput.setAttribute('id', 'postinput');
        textInput.value = 3000;
        main.appendChild(textInput);

        const button = document.createElement('input');
        button.setAttribute('type', 'button');
        button.setAttribute('value', 'send!');
        button.setAttribute('onclick', 'randomn()');
        main.appendChild(button);
      }
    </script>
  </head>
  <body onload="init()">
    <h1>randomn</h1>
    <div id="main"></div>
  </body>
</html>
`;

http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, {'content-type': 'text/html'});
    res.end(html);
  } else if (req.url === '/randomn') {
    res.writeHead(200, {'content-type': 'application/json'});
    res.end(JSON.stringify({"Math.random()": Math.random()}));
  } else {
    res.writeHead(404, {'content-type': 'text/plain'});
    res.end('404 not found: ' + req.url);
  }
}).listen(8000, 'localhost');
