
exports.up = function(knex, Promise) {
  return knex.schema.createTable('rides', function(table){
      table.increments('id').primary();
      table.string('location').notNullable().defaultTo('');
      table.integer('ride_with_gps_id').notNullable().unique();
      table.string('city_state').notNullable().defaultTo('');
      table.float('distance').notNullable();
      table.float('elevation_gain').notNullable();
      table.float('elevation_loss').notNullable();
      table.float('first_lat').notNullable();
      table.float('last_lat').notNullable();
      table.float('first_lng').notNullable();
      table.float('last_lng').notNullable();
      table.float('duration').notNullable();
      table.string('city').notNullable().defaultTo('');
      table.string('state').notNullable().defaultTo('');
      table.integer('postal_code').notNullable().defaultTo(0);
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('rides');
};
