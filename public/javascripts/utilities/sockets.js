

var map;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 37.787, lng: -122.396},
		zoom: 14
	});
}

//========================show position based off of navigator.geolocation html5 feature
function getLocation() {
	if (navigator.geolocation) {
		return navigator.geolocation.getCurrentPosition(showPosition, hidePosition);
	}else{
		alert("Geolocation is not supported by this browser. Now we trying to get your location through your IP address.");
		ipPosition();
	}
}
var pos;
function showPosition(position) {
	pos = {
		lat: parseFloat(position.coords.latitude),
		lng: parseFloat(position.coords.longitude)
	};
}
function hidePosition(position) {
	alert('User denied access of current location. We will now obtain your location through your IP address.');
	ipPosition();
}
function ipPosition(){
	$.get("http://ipinfo.io", function (response) {
		var loc = response.loc.split(',');
		pos = {
			lat: parseFloat(loc[0]),
			lng: parseFloat(loc[1])
		};
	}, "jsonp");
}
getLocation();

var markers = [];
var getMarkerUniqueId= function(lat, lng) {
	return lat + '_' + lng;
};
function addMarker(location) { // Adds a marker to the map and push to the array.
	var markerId = getMarkerUniqueId(location.lat, location.lng); // that will be used to store this marker in markers object.
	var marker = new google.maps.Marker({
		position: location,
		map: map,
		animation: google.maps.Animation.DROP,
		id: markerId
	});
	markers[markerId] = marker;

}
var removeMarker = function(marker, markerId) {
	marker.setMap(null); // set markers setMap to null to remove it from map
	delete markers[markerId]; // delete marker instance from markers object
};

var currentRidePairs = [];

// var currentRidePolyline= new google.maps.Polyline({
//   path : currentRidePairs,
//   strokeColor: '#00ff66',
//   strokeOpacity: 1.0,
//   strokeWeight: 5,
//   clickable: true,
//   visible:true,
// });

$(document).ready(function(){
  var socket = io();
  //===========broadcasts location every 5 seconds ===============================
	check_pos = setInterval(function(){
    var currentPoint = {};
    currentPoint.lat = pos.lat;
    currentPoint.lng = pos.lng;
    currentRidePairs.push(currentPoint);
    //create a loop and wait for the response
		if(typeof pos != 'undefined'){
     //while the position is not defined the loop is checking every five seconds
			socket.emit('new_user', {pos: pos});
			// clearInterval(check_pos);
		}
	}, 5000);

	socket.on('already', function(data){
		$.each(data.visitors, function( key, pos ) {
			addMarker(pos);
		});
	});

	socket.on('connected', function(data){
		$("#users_count").html("<strong>" + data.users_count +"</strong>" + " connected users");
		$("#users_count").css({'visibility': 'visible'});
		addMarker(data.pos);
	});


function saveRide() {

  socket.close();
  const options = {
    contentType: 'application/json',
    data: JSON.stringify(currentRidePairs),
    dataType: 'json',
    type: 'POST',
    url: '/sockets-backend'
  };

  $.ajax(options)
    .done((results) => {
      console.log(results.id, 'frontend results');
			saveRideBtn.innerHTML ='Saved ✓'
			saveRideBtn.style.backgroundColor = "#FC4C02";
			saveRideBtn.style.color = "white";

			var rideId = results.id;
			const favOptions = {
		    contentType: 'application/json',
		    data: JSON.stringify({rideId}),
		    dataType: 'json',
		    type: 'POST',
		    url: '/favorites/record'
		  };

		return $.ajax(favOptions);


    })
		.done(function(favResults){
			console.log(favResults, 'added to favs, shoudl return ride_id and user_id');
		})
    .fail(() => {
      console.log('did not work');
    });
}

var saveRideBtn = document.getElementById("saveRideBtn");
saveRideBtn.addEventListener('click', saveRide);

	socket.on('disconnected', function(data){
		//we can now delete this position:
		var markerId = getMarkerUniqueId(data.del.lat, data.del.lng); // get marker id by using clicked point's coordinate
		var marker = markers[markerId]; // find marker
		removeMarker(marker, markerId); // remove it
		$("#users_count").html("<strong>" + data.users_count +"</strong>" + " connected users");
	});
});
