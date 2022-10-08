const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
  console.log('User Router Working');
  res
    .status(200)
    .send(
      "<html><body style='background-color:green;'><div style='color:white;'>Hey! You made it!</div></body></html>",
    );
});

router.use('/api-docs', require('./docs'));

module.exports = router;
