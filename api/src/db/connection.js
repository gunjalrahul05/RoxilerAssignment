const knex = require('knex');
const dbConfig = require('../config/database');

// connecting the knex
const db = knex(dbConfig);

module.exports = db;
