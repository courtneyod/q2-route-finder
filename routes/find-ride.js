const express = require('express');
const router = express.Router();
var knex = require('../knex');
const bcrypt = require('bcrypt-as-promised');
const {camelizeKeys, decamelizeKeys} = require('humps');
var cookieParser = require('cookie-parser')
const boom = require('boom');
var qs = require('querystring');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('find-ride');
});

router.post('/', function(req, res, next) {
  console.log(qs.stringify(req.body));
  var queryString = qs.stringify(req.body)
  res.redirect('route-options' + "?" +queryString);
});

//can use render because it's for dynamic pages
//use res.send file or we can use express.static as route handler

module.exports = router;
