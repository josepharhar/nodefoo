#!/usr/bin/env node

const fs = require('fs');
const https = require('https');
const process = require('process');
const path = require('path');

const express = require('express');
const serveIndex = require('serve-index');

let serveDir = process.cwd();
if (process.argv.length > 2) {
  serveDir = path.resolve(process.argv[2]);
}

const app = express();
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use(express.static(serveDir, {
  dotfiles: 'allow'
}));
app.use(serveIndex(serveDir));

const server = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'server.key')),
    cert: fs.readFileSync(path.join(__dirname, 'server.cert'))
  },
  app);

const port = 8443;
const host = 'localhost';
server.listen(port, host, error => {
  console.log(`serving directory "${serveDir}" at https://${host}:${port}`);
});
