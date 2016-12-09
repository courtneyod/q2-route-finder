var express = require('express');
var router = express.Router();
var strava = require('strava-v3');
const url = require('url');
var knex = require('../knex');


router.get('/token_exchange', function (req, res){
	//use this to generate the request url and query it via your browser.
	var code = strava.oauth.getRequestAccessURL({scope:"view_private,write"})
	// console.log(code);
	if(code){
		strava.oauth.getToken(code,function(err,payload) {
			if(!err){
				// console.log('Got Token', payload);
			} else {
				// console.log('Error getting Token', err);
			}
 		});
	}
});


router.get("/confirm", function(req, res){
  // console.log('hello')
  strava.oauth.getToken(req.query.code,function(err,payload) {
    // console.log('payload')
    // console.log(payload, 'payload');
    // console.log(err, 'error')

		var access_token = payload.access_token;
		// process.env.STRAVA_ACCESS_TOKEN = payload.access_token
		var user_email = payload.athlete.email;
		var strava_id = payload.athlete.id;
		var first_name = payload.athlete.firstname;
		var last_name = payload.athlete.lastname;
		var photo_url = payload.athlete.profile;

		var opts = {
			path: '/',
			httpOnly: true
		};
		// TODO: change value of access token to hashed token
		res.cookie('/login_token', access_token, opts);
		res.cookie('/user', user_email, opts);
		//res.cookie('/strava_id', strava_id, opts);
    //email in cookie and some sort of token and use those two things to check if they are logged in

		knex('users').where('email', user_email).first()
		.then(function(results){
			if(!results){

				knex('users').insert({'email': user_email, 'first_name': first_name, 'last_name': last_name, 'photo_url': photo_url, 'strava_access_token': access_token}).returning('*')
			  .then(function(results){
					if (results[0].strava_access_token === false){
						res.redirect('/create-account');
					} else {
						res.redirect('/dashboard');
					}

				});
  		} else {

        knex('users').update({'strava_access_token': access_token})
        .then(function(results){
          	res.redirect('/dashboard');
        })

			}
		}).catch(function(err){
			res.set('Content-Type', 'text/plain');
			res.status(400);
			res.send('Bad email or password when requesting dashboard');
		});
	});
});


module.exports = router;
