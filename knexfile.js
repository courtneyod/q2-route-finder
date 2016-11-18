'use strict';

module.exports = {
  development: {
    client: 'postgresql',
    connection: 'postgres://localhost/route_finder_dev',
    pool: {
      min: 1,
      max: 1
    }
  },

  test: {
    client: 'postgresql',
    connection: 'postgres://localhost/route_finder_test',
    pool: {
      min: 1,
      max: 1
    }
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 1,
      max: 1
    }
  }
};
