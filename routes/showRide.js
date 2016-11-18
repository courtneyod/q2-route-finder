var express = require("express");
var router = express.Router();
var polyline = require('polyline');
var knex = require('../knex');

router.get('/:id', function(req,res,next){
  console.log(req.params);
  knex('rides')
  .where('id', req.params.id)
  .first()
    .then(function(results){
        if(results){
          console.log(results);
          // let decodedPolyline = polyline.decode(results.encoded_polyline);
          res.json(results[0]);
      } else {
        throw new Error("No ride found with that ID");
      }
    })
    .catch(function(err){
      console.log(err);
      res.json({
        'statusCode': 400
      });
    });
});

module.exports = router;
