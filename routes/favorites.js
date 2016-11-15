'use strict';

const express = require('express');
const router = express.Router();
var knex = require('../knex');
const bcrypt = require('bcrypt-as-promised');
const {camelizeKeys, decamelizeKeys} = require('humps');
var cookieParser = require('cookie-parser')
const boom = require('boom');

//request to see all the users favorite rides saved
router.get('/', function(req, res, next){

	knex('favorite_rides')
	.join('users', 'users.id', '=', 'favorites.user_id')
	.join('rides', 'rides.id', '=', 'favorites.ride_id')
	.select('rides.city_state', 'rides.duration', 'rides.distance', 'rides.elevation_gain', 'rides.elevation_loss')
	.then(function(results){
		if(results){
			if(req.cookies['/token'] === 'cookiemonster.something.somwhing'){
				res.json(results);
			} else {
				res.status(401);
				res.set('Content-Type', 'text/plain');
				res.send('Unauthorized');
			}

		} else {
			throw new Error('Did not work');
		}
	}).catch(function(err){
		res.set('Content-Type', 'text/plain');
		res.status(401);
		res.send('Unauthorized');
	});
});

router.get('/check', function(req, res, next){
	const idFavorites = req.query.ride_id;

	knex('favorites')
	.join('users', 'users.id', '=', 'favorites.user_id')
	.join('rides', 'rides.id', '=', 'favorites.ride_id')
	.select('rides.city_state', 'rides.duration', 'rides.distance', 'rides.elevation_gain', 'rides.elevation_loss')
	.then(function(rows){
		if(req.cookies['/token'] === 'cookiemonster.something.somwhing'){
			if(rows){
				if (rows[0].id === parseInt(idFavorites)){
					//console.log(idFavorites)

					res.json(true);
				} else {
					res.json(false);
				}
			} else {
				throw new Error('Did not work');
			}
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
});

router.post('/', function(req, res, next){
	//console.log(req.body, 'ksdfkdj')
	knex('favorites').insert({'ride_id': req.body.ride_id, 'user_id': req.body.user_id}).returning('*')
	.then(function(rows){

		return knex('favorites')
		.join('users', 'users.id', '=', 'favorites.user_id')
		.join('rides', 'rides.id', '=', 'favorites.ride_id')
		.select('rides.city_state', 'rides.duration', 'rides.distance', 'rides.elevation_gain', 'rides.elevation_loss').where('ride_id', req.body.ride_id);

	}).then(function(result){
		//console.log(row[0], "court")

		if(req.cookies['/token'] === 'cookiemonster.something.somwhing'){
			res.json(result)
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
