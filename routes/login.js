'use strict';

const express = require('express');
const router = express.Router();
var knex = require('../knex');
const bcrypt = require('bcrypt-as-promised');
const {camelizeKeys, decamelizeKeys} = require('humps');
var cookieParser = require('cookie-parser')

const boom = require('boom');

// YOUR CODE HERE
router.get('/', function(req, res, next){
	if (req.cookies['/token'] === 'cookiemonster.something.somwhing'){
		console.log(req.cookies)
		res.json(true)
	} else {
		res.json(false);
	}
})

router.post('/', function(req, res, next){
	const { email, password } = req.body;

	if (!email || !email.trim()) {
		return next(boom.create(400, 'Email must not be blank'));
	}

	if (!password || password.length < 8) {
		return next(boom.create(400, 'Password must not be blank'));
	}

	//console.log(req.body)
	let user;

	knex('users').where('email', req.body.email).first()
	.then(function(row){
		//console.log(row)
		if (!row) {
			 throw boom.create(400, 'Bad email or password');
		 }

		 return bcrypt.compare(password, user.hashed_password);

	}).then(function(){

			delete user.hashed_password;
			delete user.created_at;
			delete user.updated_at;

			var opts = {
				path: '/',
		    httpOnly: true
		  };
  		res.cookie('/token', 'cookiemonster.something.somwhing', opts);
			req.session.user = user;
      res.redirect('/dashboard');

	}).catch(bcrypt.MISMATCH_ERROR, function(){
		//console.log('WRongggggggggggg')
		throw boom.create(400, 'Bad email or password');
	})
	.catch(function(err){
		res.set('Content-Type', 'text/plain');
		res.status(400);
		res.send('Bad email or password');
	})
})

router.delete('/', (req, res, next) => {

	var opts = {
		path: '/',
    httpOnly: true
  };
  res.clearCookie('/token','cookiemonster.something.somwhing', opts);
	res.json(true)
  res.status(200);
});

module.exports = router;
