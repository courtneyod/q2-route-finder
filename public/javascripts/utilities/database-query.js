'use strict'

function getUserInfo(){
	var user;
	return $.getJSON(`/users`)
	        .done((results) => {
						console.log(results)
						renderUser(results)
	        })
	        .fail((err) => {
	          console.log(err)
	        });

}

function getActivityTimeLine(){
	return $.getJSON(`/athlete/listactivities`)
					.done((results) => {
						console.log(results, 'this is the json call')
						renderStravaActivity(results)
					})
					.fail((err) => {
						console.log(err)
					});
}

function grabFavoriteRides(){

	return $.getJSON(`/favorites`)
	        .done((favorites) => {
						console.log(favorites)
	        })
	        .fail((err) => {
	          console.log(err)
	        });

}
