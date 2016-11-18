
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return Promise.join(
    knex('rides').del(),

    knex('rides').insert([{
		  id: 1,
		  ride_with_gps_id: 964335,
		  location: '',
		  city_state: '610 Old Mason St, San Francisco',
		  ride_name: 'This is a test ride',
		  city: 'San Francisco',
		  state: 'CA',
      encoded_polyline: '_p~iF~ps|U_ulLnnqC_mqNvxq`@',
		  duration: '05:32:40',
		  distance: '80969.4',
		  postal_code: 0,
		  elevation_loss: '742.197',
		  elevation_gain: '741.371',
		  first_lng: '37.803127',
		  first_lat: '-122.459229',
		  last_lat: '-99.999999',
		  last_lng: '-99.999999',
		  created_at: new Date('2016-06-29 14:26:16 UTC'),
		  updated_at: new Date('2016-06-29 14:26:16 UTC')
    },
    {
      id: 2,
      ride_with_gps_id: 15607247,
      location: '',
      city_state: 'Jauss St, San Francisco',
      ride_name: 'This is a test ride',
      city: 'San Francisco',
      state: 'CA',
      encoded_polyline: '',
      duration: '03:14:04',
      distance: '80479.4',
      postal_code: 0,
      elevation_loss: '890.792',
      elevation_gain: '890.834',
      first_lng: '-122.45256',
      first_lat: '37.805229',
      last_lat: '38.261276',
      last_lng: '-122.623337',
      created_at: new Date('2016-06-29 14:26:16 UTC'),
      updated_at: new Date('2016-06-29 14:26:16 UTC')
    }, {
      id: 3,
      ride_with_gps_id: '7624627',
      location: '',
      city_state: "1188 Old Mason St, San Francisco",
      city: 'San Francisco',
      state: 'CA',
      distance: '80531.2',
      duration: "03:31:57",
      postal_code: 0,
      elevation_gain: '892.51',
      elevation_loss: '911.877',
      first_lat: '37.805073',
      first_lng: '-122.448189',
      last_lat: '37.804047',
      last_lng: '-122.425728',
      created_at: new Date('2016-06-29 14:26:16 UTC'),
      updated_at: new Date('2016-06-29 14:26:16 UTC')
      }])
    );
  };
