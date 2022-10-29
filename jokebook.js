const express = require('express');
const bodyParser = require('body-parser');
const { initClient, closeClient } = require('./db/mongo_client');

const port = process.env.PORT || 8080;
const app = express();

initClient();

app
  .use(bodyParser.json())
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  })
  .use('/puns', require('./routes/puns'))
  //.use('/users', require('./routes/users')) //new line
  .use('/', require('./routes/index'))
  .listen(port, function (err) {
    if (err) console.log(err);
    console.log('Server listening on PORT', port);
  });
