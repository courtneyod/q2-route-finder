'use strict'

window.rideactivity = null;
window.rideFavorites = null;

window.onload = function() {
  // console.log('here now')
  getUserInfo();
//  console.log('here now')
	getActivityTimeLine()
		.done((results) => {

			window.rideactivity = results;
      //console.log(window.rideactivity, 'rideeeeeeee')
      //console.log(results, 'results')
			renderStravaActivity(window.rideactivity);
			getFourWeekStatsTable(window.rideactivity);
			getYearStatsTable('2016');
		})
		.fail((err) => {
			console.log(err);
		});
	grabFavoriteRides()
		.done((results) => {
			window.rideFavorites = results;
			renderFavoriteActivity(window.rideFavorites);
		})
		.fail((err) => {
			console.log(err);
		});
};

// =========================== UPdate 4 weeks stats on table=============================

const getFourWeekStatsTable = function(results) {

	var currentDate = new Date();
	var fourWeeksAgo = new Date(currentDate.getTime() - (60*60*24*28*1000));

	fourWeeksAgo = fourWeeksAgo.toISOString().split("T")[0];

	var fourWeeksDistance = '';
	var fourWeeksDuration = '';
	var fourWeeksNumRides = '';

	for(var i = 0; i < results.length; i ++){
		var rideDate = (results[i].start_date).split("T")[0];

		if (results[i].start_date > fourWeeksAgo){
				fourWeeksDistance += results[i].distance;
				fourWeeksDuration += results[i].moving_time;
				fourWeeksNumRides += 1;
		}
	}
	fourWeeksDistance = ((fourWeeksDistance/4)/(1760)).toFixed(1);
	fourWeeksDuration = fourWeeksDuration/4;
	fourWeeksDuration = secondsToHms(fourWeeksDuration);
	fourWeeksDuration = fourWeeksDuration.split(":");
	fourWeeksDuration = (fourWeeksDuration[0] + 'h ' + fourWeeksDuration[1] + 'm');
	fourWeeksNumRides = (fourWeeksNumRides/4).toFixed(0);
	//console.log("fourWeeksDuration", fourWeeksDuration, "fourWeeksDistance", fourWeeksDistance, "fourWeeksNumRides", fourWeeksNumRides)

	$('.avg-rides-per-wk').text(fourWeeksNumRides);
	$('.avg-duration-per-wk').text(fourWeeksDuration);
	$('.avg-distance-per-wk').text(fourWeeksDistance);
};

// ===========================Update Year stats on dashboard table ==============================

const getYearStatsTable = function(year) {
	var results = window.rideactivity;
	//console.log(results, 'sjdhfjdhfjdhfj')
	var upperRange = '';
	var lowerRange = '';
	var currentDate = new Date();
	//var year = new Date(currentDate.getTime() - (60*60*24*year*1000));

	if(year === '2016'){
		upperRange = '2016-12-31';
		lowerRange = '2016-01-01';
	} else if (year === '2015'){
		upperRange = '2015-12-31';
		lowerRange = '2015-01-01';
	} else if (year === '2014'){
		upperRange = '2014-12-31';
		lowerRange = '2014-01-01';
	} else {
		upperRange = '2013-12-31';
		lowerRange = '2011-01-01';
	}

	var yearDistance = 0;
	var yearDuration = 0;
	var yearNumRides = 0;
	var yearElevationGain = 0;

	for(var i = 0; i < results.length; i ++){
		var rideDate = (results[i].start_date).split("T")[0];

		if (rideDate < upperRange && rideDate > lowerRange){
				yearDistance += results[i].distance;
				yearDuration += results[i].moving_time;
				yearElevationGain += results[i].total_elevation_gain;
				yearNumRides += 1;
		}
	}
	yearDistance = ((yearDistance)/(1760)).toFixed(0) + ' mi';
	yearDuration = secondsToHms(yearDuration);
	yearDuration = yearDuration.split(":");
	yearDuration = (yearDuration[0] + 'h ' + yearDuration[1] + 'm')
	yearNumRides = (yearNumRides).toFixed(0);
	yearElevationGain = (yearElevationGain*3).toFixed(0) + ' ft';
	yearElevationGain = commaSeparateNumber(yearElevationGain)

	$('.yr-rides').text(yearNumRides);
	$('.yr-duration').text(yearDuration);
	$('.yr-distance').text(yearDistance);
	$('.yr-elevation-gain').text(yearElevationGain);
};


function commaSeparateNumber(val){
    while (/(\d+)(\d{3})/.test(val.toString())){
      val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
    }
    return val;
  }

// ===========================Render user on dashboard==============================

const renderUser = function(results) {


	$('#first-name').text(results.first_name + " " + results.last_name);
	var location = $('#location')
  if(results.location.length <1){
    var browserLocation = getLocation()
    console.log(browserLocation, 'thisis current')
  } else {
    location.text(results.location);
  }
  var photoUrl = results.photo_url;
  // console.log(results.photo_url, 'sjdhfjsdhfjdshfjshjfhs')
  // console.log(results.photo_url === "")
  // if(results.photo_url === ""){
  //   photoUrl = 'https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-person-128.png'
  // }
	$('#photo-url').css("background-image", `url(${photoUrl})`);
};

function getLocation() {
  if (navigator.geolocation) {
    console.log('get location')
      return navigator.geolocation.getCurrentPosition(showPosition);
  } else {
      return "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  console.log('in show position',position.coords.latitude, position.coords.longitude )
  return {'lat': position.coords.latitude,
     'long': position.coords.longitude}
   }

// ===========================Render the Strava Activity on Dashbaord ==============================

const renderStravaActivity = function(results) {
	const activityFeed = $('#activity-feed');
  //console.log(results)

  if(results < 1){
    var addStravaContainer = $('<div>').addClass('link-strava-account');
    var addStravaText = $('<h3>').addClass('link-strava-account');
    addStravaText.text('Sign in through your Strava account and get your recent rides here');

    var inputWrapper = $('<div>').addClass('link-strava-account-wrapper');
    var stravaBtnWrapper = $('<div>').addClass('link-strava-account-btn-wrapper');
    var stravaBtn = $('<a>').addClass('link-strava-account-btn');

    stravaBtn.attr("href", "https://www.strava.com/oauth/authorize?client_id=14704&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fauth%2Fconfirm&response_type=code&scope=view_private%2Cwrite");
    stravaBtn.text('Sign in with Strava');

    activityFeed.append(addStravaContainer);
    addStravaContainer.append(addStravaText);
    addStravaContainer.append(inputWrapper);
    inputWrapper.append(stravaBtnWrapper);
    stravaBtnWrapper.append(stravaBtn);

  }

	var length = 10;
	if (results.length < 10) {
		length = results.length;
	}
	for (var i = 0; i < results.length; i++) {

	  var dateActivity = $('<div>').addClass('date-of-activity');
		var day = $('<time>').addClass('day');
		var activityDetails = $('<div>').addClass('activity-details');
		var activityProfileImage = $('<img>').addClass('activity-profile-image');
		var activityRideImage = $('<img>').addClass('activity-ride-image');
		var activityEntry = $('<div>').addClass('activity-entry');
		var activityHeadline = $('<h3>').addClass('activity-headline');
		var activitySpecs = $('<ul>').addClass('activity-specs');
		var entryDuration = $('<li>').addClass('entry-duration');
		var entryDistance = $('<li>').addClass('entry-distance');
		var entryElevation = $('<li>').addClass('entry-elevation');

		var social = $('<div>').addClass('social');
    // console.log(results[i])
    var date = convertDate(results[i].start_date)

		day.text(date);
		activityProfileImage.attr("src","http://1.bp.blogspot.com/-1gOMRhlVQVY/T9fD_nqvtUI/AAAAAAAAAVM/OL2GhVS_7Dw/s320/strava_cycling.png");
		activityRideImage.attr("src", `https://maps.googleapis.com/maps/api/staticmap?size=400x400&path=weight:5%7Ccolor:0xff0000ff%7Cenc:${results[i].map.summary_polyline}&key=AIzaSyBP3VaEqUzlMWA5k4C_MMDR3_vagF1V6Lk`);
		activityHeadline.text(results[i].name + ', ' + results[i].location_city + ' ' + results[i].location_state);

		var time = secondsToHms(results[i].moving_time);
		entryDuration.text(time);
		entryDistance.text((results[i].distance/(1760)).toFixed(1) + 'mi');
		entryElevation.text((results[i].total_elevation_gain*3).toFixed(0) + 'ft');

		activityFeed.append(dateActivity);
		dateActivity.append(day);
		activityFeed.append(activityDetails);

		activityDetails.append(activityProfileImage);
		activityDetails.append(activityEntry);
		activityDetails.append(activityRideImage);

		activityEntry.append(activityHeadline);
		activityEntry.append(activitySpecs);

		activitySpecs.append(entryDuration);
		activitySpecs.append(entryDistance);
		activitySpecs.append(entryElevation);

	}

};



// ====================== Render Favorite Rides ======================================
const renderFavoriteActivity = function(results) {
  const activityFeed = $('#favorite-feed');

  if(results < 1){
    var addStravaContainer = $('<div>').addClass('add-fav-ride-container');
    var addStravaText = $('<h3>').addClass('add-fav-ride-text');
    addStravaText.text("Looks like you don\'t have any favorites saved here. Explore new rides and save it to your dashboard.");

    var inputWrapper = $('<div>').addClass('input-wrapper');
    var stravaBtnWrapper = $('<div>').addClass('fav-ride-btn-wrapper');
    var stravaBtn = $('<a>').addClass('fav-ride-btn');

    stravaBtn.attr("href", "/find-ride");
    stravaBtn.text('Explore Routes!');


    activityFeed.append(addStravaContainer);
    addStravaContainer.append(addStravaText);
    addStravaContainer.append(inputWrapper);
    inputWrapper.append(stravaBtnWrapper);
    stravaBtnWrapper.append(stravaBtn);

  }

	for (var i = 0; i < results.length; i++) {

		var dateActivity = $('<div>').addClass('date-of-activity');
		var day = $('<time>').addClass('day');
		var activityDetails = $('<div>').addClass('activity-details');
		var activityProfileImage = $('<img>').addClass('activity-profile-image');
		var activityRideImage = $('<img>').addClass('activity-ride-image');
		var activityEntry = $('<div>').addClass('activity-entry');
		var activityHeadline = $('<h3>').addClass('activity-headline');
		var activitySpecs = $('<ul>').addClass('activity-specs');
		var entryDuration = $('<li>').addClass('entry-duration');
		var entryDistance = $('<li>').addClass('entry-distance');
		var entryElevation = $('<li>').addClass('entry-elevation');

		var social = $('<div>').addClass('remove-container');
    var removeFavBtn = $('<button>').addClass('remove-fav-btn');
    removeFavBtn.text('Remove from Favs');
    removeFavBtn.attr('ride-id', results[i].id);
    activityRideImage.attr('ride-id', results[i].id);

    var name = results[i].ride_name;
    if(results[i].ride_name === ''){
      name = 'favorite bike ride';
    }
    day.text(name);
		activityProfileImage.attr("src","http://manayunk.com/assets/content/images/DSR/DSR_BikeIcon_Circle.jpg");
		activityRideImage.attr("src", `https://maps.googleapis.com/maps/api/staticmap?size=400x400&path=weight:5%7Ccolor:0xff0000ff%7Cenc:${results[i].encoded_polyline}&key=AIzaSyBP3VaEqUzlMWA5k4C_MMDR3_vagF1V6Lk`);
		activityHeadline.text(results[i].ride_name + " " + results[i].city + ', ' + results[i].state);

		entryDuration.text(results[i].duration);
		entryDistance.text((results[i].distance/(1760)).toFixed(1) + 'mi');
		entryElevation.text(results[i].elevation_gain + 'ft');

    activityFeed.append(social);
    activityFeed.append(dateActivity);
		dateActivity.append(day);

		activityFeed.append(activityDetails);

		activityDetails.append(activityProfileImage);
		activityDetails.append(activityEntry);
		activityDetails.append(activityRideImage);

		activityEntry.append(activityHeadline);
		activityEntry.append(activitySpecs);

		activitySpecs.append(entryDuration);
		activitySpecs.append(entryDistance);
		activitySpecs.append(entryElevation);

		social.append(removeFavBtn);

    createClickEventForRemoveFav('click', removeFavBtn, results[i].id, dateActivity, activityDetails);
	}
  addEventListenerMap()

};


function secondsToHms(d) {
	d = Number(d);
	var h = Math.floor(d / 3600);
	var m = Math.floor(d % 3600 / 60);
	var s = Math.floor(d % 3600 % 60);
	return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s);
}

function convertDate(date){
	var date = date.split('T');// split string and create array.
	return date[0];
}


// ===========================Stats table drop down ==============================
/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function showDropDown() {
    document.getElementById("dropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
	dropDownListener()
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
};

// ==========================UPDATE GRPAH YEAR==========================================
function dropDownListener(){
	var dropDownValues = document.getElementsByClassName('clickable');
	//var dropDownButton = $('selection')
	for(var i = 0; i < dropDownValues.length; i ++){
		// Listen for the event.
		dropDownValues[i].addEventListener('click', function(event) {
		  // e.target matches elem
				if(event.target.innerHTML === "2015"){
					getYearStatsTable('2015');
					$('.selection').text('2015' + '∨');
				} else if (event.target.innerHTML === "2014") {
					getYearStatsTable('2014');
					$('.selection').text('2014'  + '∨');
				} else if (event.target.innerHTML === "2013"){
					getYearStatsTable('2013');
					$('.selection').text('2013' + '∨');
				} else {
					getYearStatsTable('2016');
					$('.selection').text('2016'  + '∨');
				}
		}, false);
	}

}

// ==========================Toggle ==========================================
$( ".switch" ).click(function() {
  var checkBox = document.getElementById('checked');
  $( "#strava-activity-toggle" ).toggle('slow', function() {

    if(checkBox.checked === false){
      $("#strava-activity-toggle" ).show();

      $('.toggle-values-strava').css('color', '#2196F3');
      $('.toggle-values-strava').show();

      $("#favorite-ride-toggle").hide();

      $('.toggle-values-favorites').hide();
    } else {
      $("#strava-activity-toggle" ).hide();

      $('.toggle-values-strava').css('display', 'none');
      $('.toggle-values-strava').hide();

      $("#favorite-ride-toggle").show();

      $('.toggle-values-favorites').css('color', '#2196F3');
      $('.toggle-values-favorites').show();
    }

  });
});




// ===========================REMOVE FAVORITE RIDE =================================
function createClickEventForRemoveFav(eventName, element, route, removeElOne, removeElTwo){

  element[0].addEventListener(eventName, function(event) {
    var elementId = event.currentTarget;
    elementId = element[0].getAttribute('ride-id');

    const options = {
    dataType: 'json',
    type: 'DELETE',
    url: `/favorites/${route}`
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


  });
}
