
function addEventListenerMap(){
  console.log('event')
  var staticMapImage = document.getElementsByClassName('activity-ride-image');
  console.log(staticMapImage[0])
  if(staticMapImage.length > 0){
    for(var i = 0; i < staticMapImage.length; i++){
      var currentMap = staticMapImage[i];

      getRequest('click', currentMap)
      // currentMap.addEventListener("click", getRequest)
    }
  }

}


function getRequest(eventName, element){

  element.addEventListener(eventName, function(event){

     var rideId = event.currentTarget.getAttribute('ride-id')
     //console.log(rideId)
     window.location = `/showride/${rideId}`
  //    const options=  {
  //      dataType: 'json',
  //      type: "GET",
  //      url: `/showride/${rideId}`
  //    };
  //
  //     $.ajax(options)
  //     .done((results) => {
  //       console.log(results, 'resutl');
  //       renderFavPolyline(results)
  //     })
 })

}

// function renderFavPolyline(ride){
//
//   if(ride.length > 1){
//
//     var polyline = convertPolyline(ride)
//     console.log(polyline, 'polyline encoded')
//
//     const options=  {
//       dataType: 'json',
//       type: "GET",
//       url: `/showride/`
//     };
//
//     window.location = '/showride'
//
//     //  $.ajax(options)
//     //  .done(() => {
//     //    console.log('get here')
//     //    renderNewPath(polyline)
//     //  })
//   }
// }
