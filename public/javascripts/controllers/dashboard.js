'use strict'


window.onload = function() {
  getUserInfo()
	getActivityTimeLine()
}


const renderUser = function(results) {
	//console.log(results.location, 'location')
	$('#first-name').text(results.first_name + " " + results.last_name);
	$('#location').text(results.location);
	$('#photo-url').css("background-image", `url(${results.photo_url})`);
};


const renderStravaActivity = function(results) {
	const activtyFeed = $('#activity-feed');

	//console.log(results, 'we have the results');
	var length = 10;
	if (results.length < 10) {
		length = results.length;
	}
	for (var i = 0; i < length; i++) {

		var dateActivity = $('<div>').addClass('date-of-activty');
		var day = $('<time>').addClass('day');
		var activityDetails = $('<div>').addClass('activity-details');
		var activityProfileImage = $('<img>').addClass('activity-profile-image');
		var activityRideImage = $('<img>').addClass('activity-ride-image');
		var activtyEntry = $('<div>').addClass('activty-entry');
		var activtyHeadline = $('<h3>').addClass('activty-headline');
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

		// var dateActivity = document.createElement('div')
		var date = convertDate(results[i].start_date_local)
		day.text(date);
		activityProfileImage.attr("src","http://www.bikemaine.org/wp-content/uploads/2012/05/Two-women-ride-by-ocean-copy.jpg");
		activityRideImage.attr("src","http://i.imgur.com/FcSaIeK.png");
		activtyHeadline.text(results[i].name);

		btnKudo.attr("title","Give Kudos");
		iconKudo.text("Kudos");
		countKudos.attr("data-kudo-count","1");
		countKudos.text("0");
		btnComment.attr("title","Comment");
		iconComment.text("0");

		var time = secondsToHms(results[i].moving_time)
		entryDuration.text(time);
		entryDistance.text((results[i].distance/(1760)).toFixed(1) + 'mi');
		entryElevation.text((results[i].total_elevation_gain*3).toFixed(0) + 'ft');

		activtyFeed.append(dateActivity);
		dateActivity.append(day);
		activtyFeed.append(activityDetails);
		activityDetails.append(social);

		activityDetails.append(activityProfileImage);
		activityDetails.append(activtyEntry);
		activityDetails.append(activityRideImage);

		activtyEntry.append(activtyHeadline);
		activtyEntry.append(activitySpecs);

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
	return date[0]
}
