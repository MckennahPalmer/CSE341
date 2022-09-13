const express = require('express');
const app = express();
const port = 3000;

const hostname = '127.0.0.1';

app.use('/', require('./routes'))

/*
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/fancy');
  res.end('Mckennah Palmer');
});*/

app.listen(port, hostname, () => {
  console.log(`App listening at http://${hostname}:${port}/`);
});