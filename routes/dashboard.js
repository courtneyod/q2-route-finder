'use strict';

const express = require('express');
const router = express.Router();
var knex = require('../knex');
const bcrypt = require('bcrypt-as-promised');
const {camelizeKeys, decamelizeKeys} = require('humps');
var cookieParser = require('cookie-parser')

const boom = require('boom');

router.get("/", function(req, res){
  console.log('hello')
  strava.oauth.getToken(req.query.code,function(err,payload) {
    console.log('payload')
    console.log(payload);

		var access_token = payload.access_token;
		var user_email = payload.athlete.email;
		var strava_id = payload.athlete.id;
		var first_name = payload.athlete.firstname;
		var last_name = payload.athlete.lastname;
		var photo_url = payload.athlete.profile;

		var opts = {
			path: '/',
			httpOnly: true
		};
		res.cookie('/authentication', access_token, opts);
		res.cookie('/user', user_email, opts);
		res.cookie('/strava_id', strava_id, opts);

		knex('users').where('email', user_email).first()
		.then(function(results){
			if(!results){

				knex('users').insert({'email': user_email, 'first_name': first_name, 'last_name': last_name, 'photo_url': photo_url }).returning('*')
			  .then(function(results){
					res.json(results[0]);
				});
  		} else {
				res.json(true);
			}
		}).catch(function(err){
			res.set('Content-Type', 'text/plain');
			res.status(400);
			res.send('Bad email or password');
		});
	});
});

module.exports = router;
