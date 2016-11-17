'use strict'

function getUserInfo(){
	var user;
	return $.getJSON(`/users`)
	        .done((results) => {
						//console.log(results)
						renderUser(results)
	        })
	        .fail((err) => {
	          //console.log(err)
	        });

}

function getActivityTimeLine(){
	return $.getJSON(`/athlete/listactivities`)

}

function grabFavoriteRides(){
	return $.getJSON(`/favorites`)

}
