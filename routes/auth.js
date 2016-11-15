var express = require('express');
var router = express.Router();
var strava = require('strava-v3');
const url = require('url');

router.get('/token_exchange', function (req, res){
	//use this to generate the request url and query it via your browser.
	var code = strava.oauth.getRequestAccessURL({scope:"view_private,write"})
	console.log(code);
	if(code){
		console.log("Now I'm here")
		strava.oauth.getToken(code,function(err,payload) {
			if(!err){
				console.log('Got Token', payload);
			} else {
				console.log('Error getting Token', err);
			}
 		});
	}
});

module.exports = router;
