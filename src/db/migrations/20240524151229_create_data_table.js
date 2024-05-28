exports.up = function(knex) {
  return knex.schema.createTable('data', table => {
    table.increments('id').primary();
    table.string('name', 40).notNullable();
    table.string('country', 40).notNullable();
    table.string('region', 30).notNullable();
    table.string('subregion', 40).notNullable();
    table.string('last_eruption', 10).notNullable();
    table.integer('summit').defaultTo(0);
    table.integer('elevation').defaultTo(0);
    table.integer('population_5km').defaultTo(0);
    table.integer('population_10km').defaultTo(0);
    table.integer('population_30km').defaultTo(0);
    table.integer('population_100km').defaultTo(0);
    table.decimal('latitude', 10, 4).notNullable();
    table.decimal('longitude', 11, 4).notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('data');
};
