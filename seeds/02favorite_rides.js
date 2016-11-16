exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return Promise.join(
    knex('favorite_rides').del(),

    knex('favorite_rides').insert([{
  	  id: 1,
  	  ride_id: '2',
  	  user_id: '1',
  	  created_at: new Date('2016-06-29 14:26:16 UTC'),
  	  updated_at: new Date('2016-06-29 14:26:16 UTC')
    },{
      id: 2,
  	  ride_id: '1',
  	  user_id: '2',
  	  created_at: new Date('2016-06-29 14:26:16 UTC'),
  	  updated_at: new Date('2016-06-29 14:26:16 UTC')
    }])
  );
};
