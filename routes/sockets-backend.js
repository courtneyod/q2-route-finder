var express = require("express");
var router = express.Router();

// server.listen(8000, function(){
// 	console.log('MAP started on port: 3000');
// });
router.get('/', function(req, res){
	res.render('record');
	// app.use(express.static('.'));
});

module.exports = router;
