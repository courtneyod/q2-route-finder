
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table){
      table.increments('id').primary();
      table.string('first_name').notNullable().defaultTo('');
      table.string('last_name').notNullable().defaultTo('');
      table.string('location').defaultTo('');
      table.string('email').unique().notNullable();
      table.string('strava_id').unique();
      table.boolean('strava_account_check').defaultTo(false);
      table.string('strava_access_token').defaultTo('');
      table.text('photo_url', 'medium').notNullable().defaultTo("");
      table.specificType('hashed_password', 'char(60)');
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
