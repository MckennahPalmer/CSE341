const express = require('express');
const bodyParser = require('body-parser');
const { initClient } = require('./db/mongo_client');
const oauthServer = require('./oauth/server.js');

const DebugControl = require('./utilities/debug.js');

const port = process.env.PORT || 8080;
const app = express();

initClient();

// app.use('/users', require('./routes/users'))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(DebugControl.log.request());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.use('/api-docs', require('./routes/docs.js'));
app.use('/client', require('./routes/client.js')); // Client routes
app.use('/oauth', require('./routes/auth.js')); // routes to access the auth stuff
app.use('/puns', require('./routes/puns.js'));

// Note that the next router uses middleware. That protects all routes within this middleware
app.use(
  '/secure',
  (req, res, next) => {
    DebugControl.log.flow('Authentication');
    return next();
  },
  oauthServer.authenticate(),
  require('./routes/secure.js')
); // routes to access the protected stuff
app.use('/', (req, res) => res.redirect('/client'));

app.listen(port);
console.log('Oauth Server listening on port ', port);
