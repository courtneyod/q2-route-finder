'use strict';

const express = require('express');
const router = express.Router();
var knex = require('../knex');
const bcrypt = require('bcrypt-as-promised');
const {camelizeKeys, decamelizeKeys} = require('humps');
var cookieParser = require('cookie-parser')
const boom = require('boom');

//request to see all the users favorite rides saved
// router.get('/', function(req, res, next){
//
// 	knex('favorite_rides')
// 	.join('users', 'users.id', '=', 'favorites.user_id')
// 	.join('rides', 'rides.id', '=', 'favorites.ride_id')
// 	.select('rides.city_state', 'rides.duration', 'rides.distance', 'rides.elevation_gain', 'rides.elevation_loss')
// 	.then(function(results){
// 		if(results){
// 			if(req.cookies['/token'] === 'cookiemonster.something.somwhing'){
// 				res.json(results);
// 			} else {
// 				res.status(401);
// 				res.set('Content-Type', 'text/plain');
// 				res.send('Unauthorized');
// 			}
//
// 		} else {
// 			throw new Error('Did not work');
// 		}
// 	}).catch(function(err){
// 		res.set('Content-Type', 'text/plain');
// 		res.status(401);
// 		res.send('Unauthorized');
// 	});
// });

router.get('/', function(req, res, next){
	var emailToken = req.cookies['/user']
	console.log('do you get here')
	knex('users').where('email', emailToken).first()
	.then(function(results){

		console.log(results, 'results')
		var userId = results.id

		knex('favorite_rides')
		.join('users', 'users.id', '=', 'favorite_rides.user_id')
		.join('rides', 'rides.id', '=', 'favorite_rides.ride_id')
		.where('user_id', userId)
		.select('*')
		.then(function(rows){
			 console.log(rows, 'here')
			 res.json(rows)

		}).catch(function(err){
			console.log(err)
			res.set('Content-Type', 'text/plain');
			res.status(401);
			res.send('User does not have favorites');
		});
	})
})

// router.get('/check', function(req, res, next){
// 	const idFavorites = req.query.ride_id;
//
// 	knex('favorites')
// 	.join('users', 'users.id', '=', 'favorites.user_id')
// 	.join('rides', 'rides.id', '=', 'favorites.ride_id')
// 	.select('rides.city_state', 'rides.duration', 'rides.distance', 'rides.elevation_gain', 'rides.elevation_loss')
// 	.then(function(rows){
// 		if(req.cookies['/token'] === 'cookiemonster.something.somwhing'){
// 			if(rows){
// 				if (rows[0].id === parseInt(idFavorites)){
// 					//console.log(idFavorites)
//
// 					res.json(true);
// 				} else {
// 					res.json(false);
// 				}
// 			} else {
// 				throw new Error('Did not work');
// 			}
// 		} else {
// 			res.status(401);
// 			res.set('Content-Type', 'text/plain');
// 			res.send('Unauthorized');
// 		}
//
// 	}).catch(function(err){
// 		res.status(401);
// 		res.set('Content-Type', 'text/plain');
// 		res.send('Unauthorized');
// 	});
// });

router.post('/', function(req, res, next){
	//console.log(req.body, 'did you save it? ')
	// { name: 'To Golden Gate Bridge',
  // ids: 3576164,
  // cityAndState: '2201-2223 Hastings Dr, Belmont',
  // distance: 80559.1,
  // elevation_gain: 340.377,
  // elevation_loss: 395.421,
  // first_lat: 37.5093,
  // last_lat: null,
  // first_lng: -122.29606999999999,
  // last_lng: null,
  // duration: null }

	knex('rides').insert({
		'ride_with_gps_id': req.body.ids,
		'city_state': req.body.cityAndState,
		'distance': req.body.distance,
		'elevation_gain': req.body.elevation_gain,
		'elevation_loss': req.body.elevation_loss,
		'first_lat': req.body.first_lat,
		'last_lat': req.body.last_lat,
		'first_lng': req.body.first_lng,
		'last_lng': req.body.last_lng,
		'duration': req.body.duration,
	}).returning('*')
	.then(function (rows){
		console.log(rows, 'hi there')
		console.log(req.cookies['/user'], 'me')
		var rideId = rows[0].id
		var email = req.cookies['/user']

		knex('users').where({email: email}).returning('*')
		.then(function(results){
			console.log(results, 'this is the 3rd knex post')

			knex('favorite_rides').insert({'ride_id': rideId, 'user_id': results[0].id}).returning('*')
			.then(function(rows){
				console.log(rows, 'yes you did it!!!!')

			}).catch(function(err){
				console.log(err, 'insert into favortes error')
				res.status(401);
				res.set('Content-Type', 'text/plain');
				res.send('Unauthorized');
			});
		})


	}).catch(function(err){
		console.log(err)
		res.status(401);
		res.set('Content-Type', 'text/plain');
		res.send('Unauthorized');
	});
});

router.delete('/', function(req, res, next){
	//console.log(req.body, 'ksdfkdj')
	knex('favorites').where('ride_id', req.body.ride_id).del().first()
	.then(function(rows){
		delete rows.id
		delete rows.created_at
		delete rows.updated_at

		if(req.cookies['/token'] === 'cookiemonster.something.somwhing'){
			res.json(rows)
		} else {
			res.status(401);
			res.set('Content-Type', 'text/plain');
			res.send('Unauthorized');
		}


	}).catch(function(err){
		res.status(401);
		res.set('Content-Type', 'text/plain');
		res.send('Unauthorized');
	});
})

module.exports = router;
