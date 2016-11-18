var express = require("express");
var router = express.Router();
var polyline = require('polyline');
var knex = require('../knex');
var util = require('util');

// server.listen(8000, function(){
// 	console.log('MAP started on port: 3000');
// });


router.get('/', function(req, res){
	res.render('record');
});

router.post('/', function(req, res){
	var polylineUtilForm = [];
	for(var i = 0; i < req.body.length; i++) {
		var currentPair = req.body[i];
		var coordinatePair = [];
		coordinatePair[0] = currentPair.lat;
		coordinatePair[1] = currentPair.lng;
		polylineUtilForm.push(coordinatePair);
	}
	// console.log("this is the converted polyline " + polylineUtilForm);
	var encodedPolyline = polyline.encode(polylineUtilForm);
	// console.log("this is reqbody: " + util.inspect(req.body));
	// console.log('THIS IS THE ENCODED POLYLINE: ' + util.inspect(encodedPolyline));
	// console.log("this is the decoded polyline: " + util.inspect(decodedPolyline));
	knex('rides').insert({
			'location': "SF",
			'distance': 0,
			'ride_name': 'Recorded through our sockets!',
			'encoded_polyline': encodedPolyline,
			'elevation_gain': 0,
			'elevation_loss': 0,
			'first_lat': 0,
			'last_lat': 0,
			'first_lng': 0,
			'last_lng': 0,
			'city': 'San Francisco',
			'state': 'CA',
			'postal_code': 94103}).returning('*')
	.then(function(results){
		//console.log(results[0])

	if(results){
		res.json(results[0]);
	} else {
		throw new Error('error with posting new ride');
	}
}).catch(function(err){
	console.log(err);
	res.set('Content-Type', 'text/plain');
	res.status(404);
	res.send('Ride not saved');
	});
});

// router.get('/decode/:id', function(req, res){
// 	knex('rides')
// 	polyline.decode()
// 	.then()
//
// })

module.exports = router;
