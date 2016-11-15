
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return Promise.join(
    knex('users').del(),

    knex('users').insert([])
  );
};
