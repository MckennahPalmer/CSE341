const express = require('express');
const app = express();
const port = 3000;

app.use('/', require('./routes'))

/*
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/fancy');
  res.end('Mckennah Palmer');
});*/

app.listen(port, () => {
  console.log(`App listening on ${port}`);
});