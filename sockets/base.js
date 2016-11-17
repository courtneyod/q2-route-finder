
var visitors = {};

module.exports = function (io){
  io.on('connection', function(socket){
  	console.log("socket has connected");
  	socket.on('new_user', function(data){
  		if(parseInt(Object.keys(visitors).length) > 0)
  			socket.emit('already', {visitors: visitors});
  		visitors[socket.id] = data.pos;
  		io.emit('connected', { pos: data.pos, users_count: Object.keys(visitors).length });
  		console.log(Object.keys(visitors).length, ' users currently CONNECTED');
  	});
  	socket.on('disconnect', function(){
  		console.log('someone DISCONNECTED:');
      console.log(Object.keys(visitors).length + ' users currently CONNECTED');
  		// console.log(visitors);
  	});
  });
};
