window.onload = function() {
  const options = {
  dataType: 'json',
  type: 'get',
  url: `/showRide/${route}`
};

$.ajax(options)
  .done((res) => {
    //console.log(res)
    removeElOne[0].remove()
    removeElTwo[0].remove()
    element[0].remove()
    //$('.favorites').text('Saved')
  })
  .fail((err) => {
    console.log(err)
    console.log('did not work')
  });
}

function addEventListenerMap (){
  var staticMapImage = $(".activity-ride-image");
  if(staticMapImage.length > 0){
    for(var i = 0; i < staticMapImage.length; i++){
      var currentMap = staticMapImage[i];

      currentMap.addEventListener("click", getRequest)
    }
  }

}

 function getRequest(elementId){

  var rideId = event.currentTarget.attr('ride-id')

  const options=  {
    dataType: 'json',
    type: "GET",
    url: `/rides/${rideId}`
  };

   $.ajax(options)
   .done((results) => {
     console.log(results);
   })
 }

}
