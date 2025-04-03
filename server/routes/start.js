const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('start');  // views/start.ejs 렌더링
});

module.exports = router;
