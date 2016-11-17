'use strict'


$('#explore-rides').click((event) => {
		//event.preventDefault();
		console.log('hi im here')
		//$.getJSON(`/find-ride`)
		$(location).attr('href', '/find-ride')

});


$('#logout').click((event) => {
		//event.preventDefault();
		$(location).attr('href', '/logout');
});


$('#record-ride').click((event) => {
		//event.preventDefault();
		$(location).attr('href', '/record')
	});

$('#dashboard').click((event) => {
		//event.preventDefault();
		$(location).attr('href', '/dashboard')
	});
