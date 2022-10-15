const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
  console.log('User Router Working');
  res
    .status(200)
    .send(
      "<html><body style='background-color:darkgreen;'><div style='color:grey;'>Mckennah's Joke Book</div></body></html>",
    );
});

router.use('/api-docs', require('./docs'));

module.exports = router;
