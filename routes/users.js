'use strict';

const express = require('express');
const router = express.Router();
var knex = require('../knex');
const bcrypt = require('bcrypt-as-promised');
const {camelizeKeys, decamelizeKeys} = require('humps');
var cookieParser = require('cookie-parser')
const boom = require('boom');

router.get('/', function(req, res, next){

	var emailToken = req.cookies['/user']
	// console.log(emailToken, 'here is the email token')

	knex('users').where('email', emailToken).first()
	.then(function(results){
		if(results){
			res.json(results);
		} else {
			throw new Error('error');
		}
	}).catch(function(err){
		res.send(err);
	});
});


module.exports = router;
