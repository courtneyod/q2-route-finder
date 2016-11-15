
exports.up = function(knex, Promise) {
  return knex.schema.createTable('favorite_rides', function(table){
    table.increments('id').primary();
    table.integer('user_id').notNullable().references('id').inTable('users').onDelete('cascade');
    table.integer('ride_id').notNullable().references('id').inTable('rides').onDelete('cascade');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('favorite_rides');
};
