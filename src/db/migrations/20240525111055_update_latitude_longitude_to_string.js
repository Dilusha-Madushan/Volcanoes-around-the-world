exports.up = function(knex) {
  return knex.schema.alterTable('data', function(table) {
    table.string('latitude', 255).alter();
    table.string('longitude', 255).alter();
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('data', function(table) {
    table.decimal('latitude', 10, 4).notNullable().alter();
    table.decimal('longitude', 11, 4).notNullable().alter();
  });
};