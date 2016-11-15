
exports.up = function(knex, Promise) {
  return knex.schema.createTable('ride_coordinate_points', function(table){
      table.increments('id').primary();
      table.integer('ride_id').notNullable().references('id').inTable('rides').onDelete('cascade');
      table.integer('ride_with_gps_id').notNullable().references('ride_with_gps_id').inTable('rides').onDelete('cascade');
      table.float('lat').notNullable();
      table.float('lng').notNullable();
      table.float('elevation').notNullable();
      table.float('duration').notNullable();
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    });
  };

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('ride_coordinate_points');
};
