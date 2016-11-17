'use strict';

const express = require('express');
const router = express.Router();
var knex = require('../knex');
const bcrypt = require('bcrypt-as-promised');
const {camelizeKeys, decamelizeKeys} = require('humps');
var cookieParser = require('cookie-parser')
const boom = require('boom');

router.get('/', function(req, res, next){

	res.clearCookie("/login_token");
	res.clearCookie("/user");

	res.redirect('/login');
})



module.exports = router;
