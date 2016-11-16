
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return Promise.join(
    knex('users').del(),

    knex('users').insert([{
  	  id: 1,
  	  first_name: 'Court',
  	  last_name: 'ODonnell',
  	  location: 'Santa Barbara',
  	  email: 'courtney.od@gmail.com',
  	  strava_id: '1877355',
      strava_account_check: false,
      strava_access_token: '',
  	  photo_url: 'https://dgalywyr863hv.cloudfront.net/pictures/athletes/1877355/565714/2/large.jpg',
  	  hashed_password: '$2a$12$C9AYYmcLVGYlGoO4vSZTPud9ArJwbGRsJ6TUsNULzR48z8fOnTXbS',  // youreawizard
  	  created_at: new Date('2016-06-29 14:26:16 UTC'),
  	  updated_at: new Date('2016-06-29 14:26:16 UTC')
    },{
  	  id: 2,
  	  first_name: 'Jeremy',
  	  last_name: 'Beal',
  	  location: 'San Francisco',
  	  email: 'courtney@gmail.com',
      strava_id: 0,
      strava_account_check: false,
      strava_access_token: '',
      photo_url: 'https://dgalywyr863hv.cloudfront.net/pictures/athletes/1877355/565714/2/large.jpg',
  	  hashed_password: '$2a$12$C9AYYmcLVGYlGoO4vSZTPud9ArJwbGRsJ6TUsNULzR48z8fOnTXbS',  // youreawizard
  	  created_at: new Date('2016-06-29 14:26:16 UTC'),
  	  updated_at: new Date('2016-06-29 14:26:16 UTC')
    }])
  );
};
