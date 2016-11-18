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
	const email = req.body.email;
	const password = req.body.password;

	// console.log(req.body, 'req.body');
	//
	// console.log(email, password, 'this wont log');

	if (!email || !email.trim()) {
		return next(boom.create(401, 'Email must not be blank'));
	}

	if (!password || password.length < 7) {
		res.set('Content-Type', 'text/plain');
		res.status(406);
		res.send('Password needs to be longer than 7 character');
		// return next(boom.create(402, 'Password needs to be longer than 8 characters'));
	}
	if (!(req.body.password === req.body.confirmPassword)){
		res.set('Content-Type', 'text/plain');
		res.status(406);
		res.send('Password does not match');
		// return next(boom.create(403, 'Password does not match'));
	}

	//console.log(req.body)
	let user;

	knex('users').where('email', req.body.email).first()
	.then(function(row){
		//console.log(row)
		if (row) {
			res.set('Content-Type', 'text/plain');
			res.status(406);
			res.send('This email address is already taken');
			//  throw boom.create(405, 'This email address is already taken');
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

			res.json(true);
		});

	})
	.catch(function(err){
		res.set('Content-Type', 'text/plain');
		res.status(400);
		res.send('Bad email or password');
	});
});






router.post('/confirm-password', function(req, res, next){
	const password = req.body.password;
	var email = req.cookies['/user']

	if (!password || password.length < 7) {
		res.set('Content-Type', 'text/plain');
		res.status(406);
		res.send('Password needs to be longer than 7 character');
		// return next(boom.create(402, 'Password needs to be longer than 8 characters'));
	}
	if (!(req.body.password === req.body.confirmPassword)){
		res.set('Content-Type', 'text/plain');
		res.status(406);
		res.send('Password does not match');
		// return next(boom.create(403, 'Password does not match'));
	}

	bcrypt.hash(req.body.password, 12)
	.then(function(hashedPassword){

		console.log(hashedPassword, 'hasheddd')

		knex('users').where('email', email).update({'hashed_password': hashedPassword, 'strava_account_check': true})
		.then(function(results){

			res.redirect('/dashboard');
		});

	})
	.catch(function(err){
		res.set('Content-Type', 'text/plain');
		res.status(400);
		res.send('Bad password');
	});
});






router.delete('/', (req, res, next) => {
	res.clearCookie("/login_token");
	res.clearCookie("/user");

	res.render('login');
  //res.status(200);
});

module.exports = router;
