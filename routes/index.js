var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/favorites', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//can use render because it's for dynamic pages
//use res.send file or we can use express.static as route handler

module.exports = router;
