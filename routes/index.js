const routes = require('express').Router();

routes.get('/', (req, res) => {
  res.send('Mckennah Palmer');
});

module.exports = routes;
