const fs = require('fs');
const path = require('path');
const knexConfig = require('../../knexfile');  // Adjust the path as necessary
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'development']);

const runSqlFile = () => {
  fs.readFile('src/db/sql/volcano.sql', { encoding: 'utf-8' }, (err, sqlContent) => {
    if (err) {
      console.error('Error reading SQL file:', err);
      return;
    }

    // Execute the SQL content as a raw query
    knex.raw(sqlContent).then(() => {
      console.log('SQL file executed successfully');
    }).catch(err => {
      console.error('Error executing SQL:', err);
    }).finally(() => {
      knex.destroy(); // Close the database connection
    });
  });
};

module.exports = runSqlFile;
