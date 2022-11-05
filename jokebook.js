const express = require('express');
const bodyParser = require('body-parser');
const { initClient } = require('./db/mongo_client');

var OAuthServer = require('express-oauth-server');
var options = { 
  useErrorHandler: false, 
  continueMiddleware: false,
}

const port = process.env.PORT || 8080;
const app = express();

initClient();

app.oauth = new OAuthServer({
  debug: true,
  model: require('./db/model'),
  options
});

app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(app.oauth.authorize())
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  })
  .use('/puns', require('./routes/puns'))
  .use('/users', require('./routes/users'))
  .use('/', require('./routes/index'))
  .listen(port, function (err) {
    if (err) console.log(err);
    console.log('Server listening on PORT', port);
  });
