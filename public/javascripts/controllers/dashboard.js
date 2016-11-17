'use strict'

window.rideactivity = null;
window.rideFavorites = null;

window.onload = function() {
  getUserInfo();
	getActivityTimeLine()
		.done((results) => {
			//console.log(results, 'this is the json call')
			// renderStravaActivity(results)
			// getFourWeekStatsTable(results)
			window.rideactivity = results
			//console.log( window.rideactivity, 'hi here');
			renderStravaActivity(window.rideactivity);
			getFourWeekStatsTable(window.rideactivity);
			getYearStatsTable('2016');
		})
		.fail((err) => {
			console.log(err)
		});
	grabFavoriteRides()
		.done((results) => {
			window.rideFavorites = results
      console.log(window.rideFavorites, 'favs are here')
			renderFavoriteActivity(window.rideFavorites);
		})
		.fail((err) => {
			console.log(err)
		});
}

// =========================== UPdate 4 weeks stats on table=============================

const getFourWeekStatsTable = function(results) {

	var currentDate = new Date();
	var fourWeeksAgo = new Date(currentDate.getTime() - (60*60*24*28*1000));

	fourWeeksAgo = fourWeeksAgo.toISOString().split("T")[0];

	var fourWeeksDistance = '';
	var fourWeeksDuration = '';
	var fourWeeksNumRides = '';

	for(var i = 0; i < results.length; i ++){
		var rideDate = (results[i].start_date).split("T")[0]

		if (results[i].start_date > fourWeeksAgo){
				fourWeeksDistance += results[i].distance;
				fourWeeksDuration += results[i].moving_time;
				fourWeeksNumRides += 1;
		}
	}
	fourWeeksDistance = ((fourWeeksDistance/4)/(1760)).toFixed(1);
	fourWeeksDuration = fourWeeksDuration/4;
	fourWeeksDuration = secondsToHms(fourWeeksDuration);
	fourWeeksDuration = fourWeeksDuration.split(":")
	fourWeeksDuration = (fourWeeksDuration[0] + 'h ' + fourWeeksDuration[1] + 'm')
	fourWeeksNumRides = (fourWeeksNumRides/4).toFixed(0);
	//console.log("fourWeeksDuration", fourWeeksDuration, "fourWeeksDistance", fourWeeksDistance, "fourWeeksNumRides", fourWeeksNumRides)

	$('.avg-rides-per-wk').text(fourWeeksNumRides)
	$('.avg-duration-per-wk').text(fourWeeksDuration)
	$('.avg-distance-per-wk').text(fourWeeksDistance)
};

// ===========================Update Year stats on dashboard table ==============================

const getYearStatsTable = function(year) {
	var results = window.rideactivity
	//console.log(results, 'sjdhfjdhfjdhfj')
	var upperRange = '';
	var lowerRange = '';
	var currentDate = new Date();
	//var year = new Date(currentDate.getTime() - (60*60*24*year*1000));

	if(year === '2016'){
		upperRange = currentDate
		lowerRange = '2016-01-01'
	} else if (year === '2015'){
		upperRange = '2015-12-31'
		lowerRange = '2015-01-01'
	} else if (year === '2014'){
		upperRange = '2014-12-31'
		lowerRange = '2014-01-01'
	} else {
		upperRange = '2013-12-31'
		lowerRange = '2011-01-01'
	}

	//fourWeeksAgo = fourWeeksAgo.toISOString().split("T")[0]
	//console.log(fourWeeksAgo, 'here')

	var yearDistance = 0;
	var yearDuration = 0;
	var yearNumRides = 0;
	var yearElevationGain = 0;

	for(var i = 0; i < results.length; i ++){
		var rideDate = (results[i].start_date).split("T")[0]
		//console.log(rideDate)
		if (results[i].start_date < upperRange && results[i].start_date > lowerRange){
				yearDistance += results[i].distance;
				yearDuration += results[i].moving_time;
				yearElevationGain += results[i].total_elevation_gain;
				yearNumRides += 1;
				//console.log(yearDuration)
		}
	}
	yearDistance = ((yearDistance)/(1760)).toFixed(0) + ' mi';
	yearDuration = secondsToHms(yearDuration);
	yearDuration = yearDuration.split(":")
	yearDuration = (yearDuration[0] + 'h ' + yearDuration[1] + 'm')
	yearNumRides = (yearNumRides).toFixed(0);
	yearElevationGain = (yearElevationGain*3).toFixed(0) + ' ft';
	yearElevationGain = commaSeparateNumber(yearElevationGain)
	//console.log("yearElevationGain", yearElevationGain, "yearDuration", yearDuration, "yearDistance", yearDistance, "yearNumRids", yearNumRides)

	$('.yr-rides').text(yearNumRides)
	$('.yr-duration').text(yearDuration)
	$('.yr-distance').text(yearDistance)
	$('.yr-elevation-gain').text(yearElevationGain)
};


function commaSeparateNumber(val){
    while (/(\d+)(\d{3})/.test(val.toString())){
      val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
    }
    return val;
  }

// ===========================Render user on dashboard==============================

const renderUser = function(results) {
	//console.log(results.location, 'location')
	$('#first-name').text(results.first_name + " " + results.last_name);
	$('#location').text(results.location);
	$('#photo-url').css("background-image", `url(${results.photo_url})`);
};

// ===========================Render the Strava Activity on Dashbaord ==============================

const renderStravaActivity = function(results) {
	const activityFeed = $('#activity-feed');

	console.log(results, 'we have the results');
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
		var btnGroup = $('<div>').addClass('btn-group');
		var btnKudo = $('<button>').addClass('btn-kudo');
		var iconKudo = $('<span>').addClass('icon-kudo');
		var countKudos = $('<span>').addClass('count-kudos');

		var btnComment = $('<button>').addClass('btn-comment');
		var iconComment = $('<span>').addClass('icon-comment');
		var countComments = $('<span>').addClass('count-comments');

		var date = convertDate(results[i].start_date_local);
		day.text(date);
		activityProfileImage.attr("src","http://1.bp.blogspot.com/-1gOMRhlVQVY/T9fD_nqvtUI/AAAAAAAAAVM/OL2GhVS_7Dw/s320/strava_cycling.png");
		activityRideImage.attr("src","http://i.imgur.com/FcSaIeK.png");
		activityHeadline.text(results[i].name + ', ' + results[i].location_city + ' ' + results[i].location_state);

		btnKudo.attr("title","Give Kudos");
		iconKudo.text("Kudos");
		countKudos.attr("data-kudo-count","1");
		countKudos.text("0");
		btnComment.attr("title","Comment");
		iconComment.text("0");

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
    activityDetails.append(social);

		activityEntry.append(activityHeadline);
		activityEntry.append(activitySpecs);

		activitySpecs.append(entryDuration);
		activitySpecs.append(entryDistance);
		activitySpecs.append(entryElevation);

		social.append(btnGroup);
		btnGroup.append(btnKudo);
		btnKudo.append(iconKudo);
		btnKudo.append(countKudos);

		social.append(btnComment);
		btnComment.append(iconComment);
		btnComment.append(countComments);
	}
	// $('#first-name').text(results.first_name + " " + results.last_name);
	// $('#location').text(results.location);
	// $('#photo-url').css("background-image", `url(${results.photo_url})`);
};



// ====================== Render Favorite Rides ======================================

const renderFavoriteActivity = function(results) {
  //console.log('here we are in fav function')
	const activityFeed = $('#favorite-feed');

	//console.log(results, 'we have the results');
	// var length = 10;
	// if (results.length < 10) {
	// 	length = results.length;
	// }
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
		// var btnGroup = $('<div>').addClass('btn-group');
		// var btnFav = $('<button>').addClass('btn-fav');
    var removeFavBtn = $('<button>').addClass('remove-fav-btn');
    removeFavBtn.text('Remove from Favs')

    var name = results[i].ride_name
    if(results[i].ride_name === ''){
      name = 'favorite bike ride'
    }
    day.text(name);
		activityProfileImage.attr("src","http://manayunk.com/assets/content/images/DSR/DSR_BikeIcon_Circle.jpg");
		activityRideImage.attr("src","http://i.imgur.com/FcSaIeK.png");
		activityHeadline.text(results[i].city + ', ' + results[i].state);

	//	btnFav.attr("title","Fav Rides");
		// iconKudo.text("Kudos");
		// countKudos.attr("data-kudo-count","1");
		// countKudos.text("0");
		// btnComment.attr("title","Comment");
		// iconComment.text("0");

		entryDuration.text(results[i].duration);
		entryDistance.text((results[i].distance/(1760)).toFixed(1) + 'mi');
		entryElevation.text(results[i].elevation_gain + 'ft');

    activityFeed.append(dateActivity);
		dateActivity.append(day);

		activityFeed.append(activityDetails);
		activityDetails.append(social);

		activityDetails.append(activityProfileImage);
		activityDetails.append(activityEntry);
		activityDetails.append(activityRideImage);

		activityEntry.append(activityHeadline);
		activityEntry.append(activitySpecs);

		activitySpecs.append(entryDuration);
		activitySpecs.append(entryDistance);
		activitySpecs.append(entryElevation);

		social.append(removeFavBtn);
		//btnGroup.append(btnFav);

		// social.append(btnComment);
		// btnComment.append(iconComment);
		// btnComment.append(countComments);
	}
	// $('#first-name').text(results.first_name + " " + results.last_name);
	// $('#location').text(results.location);
	// $('#photo-url').css("background-image", `url(${results.photo_url})`);
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
	//console.log(arr, 'hi')
	//var date = new Date(arr[0], arr[1] -1, arr[2], arr[3], arr[4], arr[5]);
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

function dropDownListener(){
	var dropDownValues = document.getElementsByClassName('clickable')
	//var dropDownButton = $('selection')
	//console.log(dropDownValues)
	for(var i = 0; i < dropDownValues.length; i ++){
		// Listen for the event.
		dropDownValues[i].addEventListener('click', function (event) {
		  // e.target matches elem
				//console.log(typeof event.target.innerHTML)
				if(event.target.innerHTML === "2015"){
					getYearStatsTable('2015')
					$('.selection').text('2015')
				} else if (event.target.innerHTML === "2014") {
					getYearStatsTable('2014')
					$('.selection').text('2014')
				} else if (event.target.innerHTML === "2013"){
					getYearStatsTable('2013')
					$('.selection').text('2013')
				} else {
					getYearStatsTable('2016')
					$('.selection').text('2016')
				}
		}, false);
	}

}

// ==========================Toggle ==========================================

$( ".switch" ).click(function() {
  var checkBox = document.getElementById('checked')
  $( "#strava-activity-toggle" ).toggle('slow', function() {

    if(checkBox.checked === false){
      $("#strava-activity-toggle" ).show()

      $('.toggle-values-strava').css('color', '#2196F3')
      $('.toggle-values-strava').show()

      $("#favorite-ride-toggle").hide()

      $('.toggle-values-favorites').hide()
    } else {
      $("#strava-activity-toggle" ).hide()

      $('.toggle-values-strava').css('display', 'none')
      $('.toggle-values-strava').hide()

      $("#favorite-ride-toggle").show()

      $('.toggle-values-favorites').css('color', '#2196F3')
      $('.toggle-values-favorites').show()
    }

  });
});
