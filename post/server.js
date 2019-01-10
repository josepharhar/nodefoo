const http = require('http');

const html = `
<html>
  <head>
    <title>post testing</title>
    <script>
      function client() {
        const main = document.querySelector('#main');

        const textInput = document.createElement('input');
        textInput.setAttribute('type', 'text');
        textInput.setAttribute('id', 'postinput');
        textInput.value = 'test post data';
        main.appendChild(textInput);

        const postButton = document.createElement('input');
        postButton.setAttribute('type', 'button');
        postButton.setAttribute('value', 'send!');
        postButton.setAttribute('onclick', 'sendpost()');
        main.appendChild(postButton);
      }
      function sendpost() {
        const postData = document.querySelector('#postinput').value;
        fetch('/post', {
          method: 'POST',
          body: postData
        });
      }
    </script>
  </head>
  <body onload="client()">
    <h1>post testing</h1>
    <div id="main"></div>
  </body>
</html>`;

async function getReqData(req) {
  return new Promise((resolve, reject) => {
    const postData = [];
    req.on('data', data => {
      console.log('received data from request: ' + data);
      postData.push(data);
    });
    req.on('end', resolve(postData));
  });
}

http.createServer(async (req, res) => {
  console.log(`${req.method} ${req.url}`);

  if (req.method === 'POST' && req.url === '/post') {
    const reqData = await getReqData(req);
    console.log('  got reqData: ' + reqData);
    res.writeHead(200, {'content-type': 'text/plain'});
    res.end('got reqData: ' + reqData);

  } else if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, {'content-type': 'text/html'});
    res.end(html);

  } else {
    res.writeHead(404, {'content-type': 'text/plain'});
    res.end('404 not found: ' + req.url);
  }

  console.log();
}).listen(8000, 'localhost');
