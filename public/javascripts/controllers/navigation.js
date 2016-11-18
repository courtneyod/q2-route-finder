'use strict'


$('#explore-rides').click((event) => {
		//event.preventDefault();
		//$.getJSON(`/find-ride`)
		$(location).attr('href', '/find-ride')

});


$('#logout').click((event) => {
		//event.preventDefault();
		$(location).attr('href', '/logout');
});


$('#record-ride').click((event) => {
		//event.preventDefault();
		$(location).attr('href', '/sockets-backend')
	});

$('#dashboard').click((event) => {
		//event.preventDefault();
		console.log('regeresteds')
		$(location).attr('href', '/dashboard')
	});
