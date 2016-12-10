var express = require('express');
var router = express.Router();
var knex = require('../knex');
var polyline = require('polyline');

/* GET all of the rides in db. */
router.get('/', function(req, res, next) {
  knex('rides').orderBy('city_state', 'asc')
  .then(function(results){
    if(results){
    res.json(results);
  } else {
    throw new Error('error with getting rides');
  }
}).catch(function(err){
  res.json(err);
  });
});

/* GETa specific ride in db. */
router.get('/:id', function(req, res, next){
  knex('rides').where('id', req.params.id).first()
  .then(function(result){

    if(result){
      res.json(result);
    } else{
      throw new Error('error with getting rides');
    }
  }).catch(function(err){
    res.set('Content-Type', 'text/plain');
		res.status(404);
		res.send('Not Found');
    });
  });

/* Add a new ride to the db. */
router.post('/', function(req, res, next){
  console.log(req.body, 'here now');
  // var encodedPolyline = polyline.encode(req.body.polylines);
  // console.log(encodedPolyline, 'erueureu')
  var rideGPS = req.body.ride.ids;
  knex('rides').where('ride_with_gps_id', rideGPS).first()
	.then(function(results){
		if(!results){
    knex('rides').insert(
      {'ride_with_gps_id': req.body.ride.ids,
    		'city_state': req.body.ride.cityAndState,
    		'distance': req.body.ride.distance,
    		'elevation_gain': req.body.ride.elevation_gain,
    		'elevation_loss': req.body.ride.elevation_loss,
    		'first_lat': req.body.ride.first_lat,
    		'last_lat': req.body.ride.last_lat,
    		'first_lng': req.body.ride.first_lng,
    		'last_lng': req.body.ride.last_lng,
    		'duration': req.body.ride.duration,
        'encoded_polyline': req.body.polylines.encodedPolyline
      }).returning(['city_state', 'distance', 'duration', 'elevation_gain', 'elevation_loss', 'first_lat', 'first_lng', 'last_lat', 'last_lng', 'ride_with_gps_id'])
    .then(function(results){

      if(results){
        res.json(results[0]);
      } else {
        throw new Error('error with getting rides');
      }
    })
  } else {
    console.log('you already have that ride in your database, here is the GPS ride id', results.ride_with_gps_id)
      res.json(results)
    }
  }).catch(function(err){
    console.log(err);
    res.set('Content-Type', 'text/plain');
		res.status(404);
		res.send('Not Found');
    });
  });

  router.patch('/:id', function(req, res){
//	console.log(req.body, 'this is reqxk')
  knex('rides').where('id', req.params.id).update(req.body).returning(['city_state', 'distance', 'duration', 'elevation_gain', 'elevation_loss', 'first_lat', 'first_lng', 'last_lat', 'last_lng', 'ride_with_gps_id'])
    .then(function(results){
    if (results) {
			res.json(books[0]);
    } else {
			throw new Error('error with updating a new book');
		}
  }).catch(function(err){
		res.set('Content-Type', 'text/plain');
		res.status(404);
		res.send('Not Found');
  });
});

router.delete('/:id', function(req, res){
	knex('rides').where('id', req.params.id).del().returning(['city_state', 'distance', 'duration', 'elevation_gain', 'elevation_loss', 'first_lat', 'first_lng', 'last_lat', 'last_lng', 'ride_with_gps_id'])
	.then(function(results){
		if(results){
			res.json(results[0]);
		} else {
			throw new Error(err);
		}
	}).catch(function(err){
		res.set('Content-Type', 'text/plain');
		res.status(404);
		res.send('Not Found');
	});
});


module.exports = router;
