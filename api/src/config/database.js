const path = require('path');
require('dotenv').config({ 
  path: path.resolve(__dirname, '../../.env') 
});

console.log('Database config - Environment variables:', {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT
});

const cleanPassword = process.env.DB_PASSWORD ? process.env.DB_PASSWORD.replace(/"/g, '') : '';

const connectionStringConfig = {
  client: 'pg',
  connection: `postgresql://${process.env.DB_USER || 'postgres'}:${encodeURIComponent(cleanPassword)}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'storeapp'}`,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: '../db/migrations'
  },
  seeds: {
    directory: '../db/seeds'
  }
};

module.exports = connectionStringConfig;
