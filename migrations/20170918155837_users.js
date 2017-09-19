
exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', (table) => {
        table.increments();
        table.string('user');
        table.string('email');
        table.string('pass');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('users');
};
