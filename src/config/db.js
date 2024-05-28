const knex = require('knex');
const knexConfig = require('../../knexfile'); // adjust the path based on your project structure if necessary

const environment = process.env.NODE_ENV || 'development';
const config = knexConfig[environment];

const db = knex(config);

module.exports = db;
