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
	// console.log('do you get here')
	knex('users').where('email', emailToken).first()
	.then(function(results){

		// console.log(results, 'results')
		var userId = results.id

		knex('favorite_rides')
		.join('users', 'users.id', '=', 'favorite_rides.user_id')
		.join('rides', 'rides.id', '=', 'favorite_rides.ride_id')
		.where('user_id', userId)
		.select('*')
		.then(function(rows){
			 console.log(rows, 'here are favorites')
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
	console.log(req.body, 'this is req.body on favorites post')
	//check if it exists
	knex('rides').where('ride_with_gps_id', req.body.ride_with_gps_id).first()
	.then(function(results){
		if(!results){
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
				var rideId = rows[0].id;
				var email = req.cookies['/user'];

				knex('users').where({email: email}).returning('*')
				.then(function(results){
					knex('favorite_rides').insert({'ride_id': rideId, 'user_id': results[0].id}).returning('*')
					.then(function(rows){
						res.json(rows);
					});
				});
			});
		} else {
			console.log(results, "the ride you favorited was already in database");
			var rideId = results.id;
			var email = req.cookies['/user'];

			knex('users').where({email: email}).returning('*')
			.then(function(results){
				knex('favorite_rides').insert({'ride_id': rideId, 'user_id': results[0].id}).returning('*')
				.then(function(rows){
					res.json(rows);
				});
			});
		}
	}).catch(function(err){
				console.log(err, 'insert into favortes error');
				res.status(401);
				res.set('Content-Type', 'text/plain');
				res.send('Unauthorized');
			});
		})

//
// 	}).catch(function(err){
// 		console.log(err)
// 		res.status(401);
// 		res.set('Content-Type', 'text/plain');
// 		res.send('Unauthorized');
// 	});
// });

router.post('/record', function(req, res, next){
		var rideId = req.body.rideId;
		// console.log(req.cookies['/user'], 'me');
		var email = req.cookies['/user'];

		knex('users').where({'email': email}).returning('*')
		.then(function(results){
			// console.log(results, 'this is the 3rd knex post');

			knex('favorite_rides').insert({'ride_id': rideId, 'user_id': results[0].id}).returning('*')
			.then(function(rows){
				// console.log(rows, 'yes you did it!!!!');

			}).catch(function(err){
				console.log(err, 'insert into favortes error');
				res.status(401);
				res.set('Content-Type', 'text/plain');
				res.send('Unauthorized');
			});
	});
});


router.delete('/:id', function(req, res, next){

	//console.log(req.params.id, 'delete')
	knex('favorite_rides').where('ride_id', req.params.id).first().del()
	.then(function(rows){
		// console.log('hereeeeeee')
		delete rows.id
		delete rows.created_at
		delete rows.updated_at

		res.json(rows)

	}).catch(function(err){
		console.log(err)
		res.status(401);
		res.set('Content-Type', 'text/plain');
		res.send('Unauthorized');
	});
})

module.exports = router;
