'use strict';

const express = require('express');
const router = express.Router();
var knex = require('../knex');
const bcrypt = require('bcrypt-as-promised');
const {camelizeKeys, decamelizeKeys} = require('humps');
var cookieParser = require('cookie-parser')
var strava = require('strava-v3');


const boom = require('boom');


router.get('/listactivities', function(req, res, next){

	strava.athlete.listActivities({'access_token': process.env.STRAVA_ACCESS_TOKEN},function(err,payload) {
		console.log(payload, "\n", 'for activity, payload');
		console.log(err, 'this is the listactivities error');
		console.log('this is the error')
		res.json(payload);
	})

})

router.get('/listroutes', function(req, res, next){

	strava.athlete.listRoutes({'access_token': process.env.STRAVA_ACCESS_TOKEN},function(err,payload) {
		// console.log(payload, 'for activity, payload')
		// console.log(err, 'this is the listactivities error')
		res.json(payload)
	})

})

module.exports = router;
