exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('users').del().then(function() {
        // Inserts seed entries
        return knex('users').insert([
            {
                user: 'Tristannica',
                email: 'gilford.tristan@gmail.com',
                pass: '12345'
            },
            {
                user: 'Sitle',
                email: 'devingray13@gmail.com',
                pass: '67890'
            },
            {
                user: 'BigD',
                email: 'derek.kramer88@gmail.com',
                pass: '54321'
            }
        ]);
    });
};
