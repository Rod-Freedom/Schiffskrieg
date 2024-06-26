const router = require('express').Router();

router.get('/board', async (req, res) => {
  // Send the rendered Handlebars.js template back as the response
  res.render('board');
});

module.exports = router;
