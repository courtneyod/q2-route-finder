'use strict'

window.onload = function() {

	$( ".login-form" ).submit(function( event ) {
		event.preventDefault();


		var url = $('.login-form').serialize()
		console.log(url)
		url = url.replace('%40', '@');
		url = JSON.parse('{"' + decodeURI(url).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
		console.log((url))

		const options = {
        contentType: 'application/json',
        data: JSON.stringify(url),
        dataType: 'json',
        type: 'POST',
        url: '/login'
      };

      $.ajax(options)
        .done((results) => {
					console.log(results)
					$(location).attr('href', '/dashboard');

        })
        .fail((err) => {
					//console.log(err.responseText, 'this is err')
					$('.password-error-holder').text('')
					$('.email-error-holder').text('')

					if (err.responseText === 'Password needs to be longer than 8 character'){
						$('.password-error-holder').text('Password needs to be longer than 8 character');
					} else if (err.responseText === 'This email address is already taken' ) {
						$('.email-error-holder').text('User already in database');
					} else if (err.responseText === 'Password does not match'){
						$('.password-error-holder').text('Password does not match');
					} else {
						console.log(err.responseText)
					}
          // console.log(err.responseText)
					// console.log(JSON.stringify(err))
        });
	});


}
