exports.up = function(knex) {
  return knex.schema.createTable('comments', table => {
    table.increments('id').primary();
    table.integer('volcano_id').unsigned().references('id').inTable('data').onDelete('CASCADE');
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.text('comment');
    table.integer('rating').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('comments');
};