'use strict';

const express = require('express');
const router = express.Router();
var knex = require('../knex');
const bcrypt = require('bcrypt-as-promised');
const {camelizeKeys, decamelizeKeys} = require('humps');
var cookieParser = require('cookie-parser')
var strava = require('strava-v3');


const boom = require('boom');

router.get("/", function(req, res){
  // console.log('hello')
  res.render('dashboard')
  // strava.oauth.getToken(req.query.code,function(err,payload) {
  //   console.log('payload')
  //   console.log(payload, 'payload');
  //   console.log(err, 'error')
  //
	// 	var access_token = payload.access_token;
	// 	var user_email = payload.athlete.email;
	// 	var strava_id = payload.athlete.id;
	// 	var first_name = payload.athlete.firstname;
	// 	var last_name = payload.athlete.lastname;
	// 	var photo_url = payload.athlete.profile;
  //
	// 	var opts = {
	// 		path: '/',
	// 		httpOnly: true
	// 	};
	// 	res.cookie('/oauth_token', access_token, opts);
	// 	res.cookie('/user', user_email, opts);
	// 	res.cookie('/strava_id', strava_id, opts);
  //   //email in cookie and some sort of token and use those two things to check if they are logged in
  //
	// 	knex('users').where('email', user_email).first()
	// 	.then(function(results){
	// 		if(!results){
  //
	// 			knex('users').insert({'email': user_email, 'first_name': first_name, 'last_name': last_name, 'photo_url': photo_url, 'strava_access_token': access_token}).returning('*')
	// 		  .then(function(results){
	// 				res.redirect('create-account');
	// 			});
  // 		} else {
  //
  //       knex('users').update({'strava_access_token': access_token})
  //       .then(function(results){
  //         	res.render('dashboard');
  //       })
  //
	// 		}
	// 	}).catch(function(err){
	// 		res.set('Content-Type', 'text/plain');
	// 		res.status(400);
	// 		res.send('Bad email or password when requesting dashboard');
	// 	});
	// });
});

// router.get("/:id", function(req, res){
//
// 	knex('user').where('id', req.paras.id).first()
// 	.then(function(result){
//
// 	})
// })

module.exports = router;
