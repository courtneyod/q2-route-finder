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

	// var stravaId = req.cookies['/strava_id'];
	 console.log(req.cookies['/login_token'], 'login cookie');

	if(req.cookies['/login_token']) {
		console.log('getting redirected')
				res.redirect('dashboard');
			} else {
				res.render('login');
			}
})

router.post('/', function(req, res, next){
	const { email, password } = req.body;
	console.log(req.body, 'req.body')

	if (!email || !email.trim()) {
		return next(boom.create(400, 'Email must not be blank'));
	}

	if (!password || password.length < 8) {
		return next(boom.create(400, 'Password must not be blank'));
	}
	if (!(req.body.password === req.body.confirmPassword)){
		return next(boom.create(400, 'Password does not match'));
	}

	//console.log(req.body)
	let user;

	knex('users').where('email', req.body.email).first()
	.then(function(row){
		//console.log(row)
		if (row) {
			 throw boom.create(400, 'This email address is already taken');
		 }
	})

	bcrypt.hash(req.body.password, 12)
	.then(function(hashedPassword){

	console.log(hashedPassword, 'hasheddd')

		knex('users').insert({'email': req.body.email, 'first_name': req.body.firstName, 'last_name': req.body.lastName, 'hashed_password': hashedPassword})
		.then(function(results){

			var opts = {
				path: '/',
				httpOnly: true
			};
			// TODO: change vlaue of login token
			res.cookie('/login_token', req.body.firstName, opts);
			res.cookie('/user', req.body.email, opts);

			res.redirect('/dashboard');
		});

	})
	.catch(function(err){
		res.set('Content-Type', 'text/plain');
		res.status(400);
		res.send('Bad email or password');
	});
});

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
