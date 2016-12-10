window.onload = function() {
	console.log('here now')
	initMapSf()
}

function initMapSf() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 37.787, lng: -122.396},
		zoom: 14
	});
	getPolyLines(map)
}


function getPolyLines(map){
	url = window.location.href;
	rideId = url.split('ride/')
	rideId = rideId[1]

   const options=  {
     dataType: 'json',
     type: "GET",
     url: `/showride/data/${rideId}`
   };

    $.ajax(options)
    .done((results) => {
      console.log(results, 'resutl');
      renderFavPolyline(results, map)

    })

}



function renderFavPolyline(ride, map){
console.log(map)
if(ride.length > 1){

	var polyline = convertPolyline(ride)
	var bikeRide = renderNewPath(polyline)
	console.log(bikeRide, 'bikeRide')
	bikeRide.setMap(map)
	}
}

// ===========================converts polyline to format googlemaps can use=================================
function convertPolyline (decodedPolyline) {
  let mapsPolyline = [];
  for(var i = 0; i < decodedPolyline.length; i++) {
    var currentPair = decodedPolyline[i];
    var coordinatePair = {};
    coordinatePair.lat = currentPair[0];
    coordinatePair.lng = currentPair[1];
    mapsPolyline.push(coordinatePair);
  }
  return mapsPolyline;
}

// ===========================CREATE NEW POLYLINE=================================
function renderNewPath(decodedPolyline) {
console.log(decodedPolyline, 'here')
var path = new google.maps.Polyline({
    path: decodedPolyline,
    strokeColor: '#00ff66',
    strokeOpacity: 1.0,
    strokeWeight: 3,
    clickable: true,
    visible:true,
  });
	return path;
}
