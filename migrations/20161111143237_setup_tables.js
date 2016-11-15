
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table){
      table.increments('id').primary();
      table.string('first_name').notNullable().defaultTo('');
      table.string('last_name').notNullable().defaultTo('');
      table.string('email').unique();
      table.string('strava_id').unique();
      table.text('photo_url', 'medium').notNullable().defaultTo("");
      table.specificType('hashed_password', 'char(60)').notNullable();
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
