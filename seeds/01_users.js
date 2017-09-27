exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('users').del().then(function() {
        // Inserts seed entries
        return knex('users').insert([
            {
                user: 'aaaaa',
                email: 'a@aa.com',
                pass: '$2a$12$IR3EC.Gund6HUEimvYsvHuhl2hqofPDV9JiKVWNsaQhY4I7hpLEs2'
            },
            {
                user: 'bbbbb',
                email: 'b@bb.com',
                pass: '$2a$12$.tMw9rLJ6TPjIjBFyKZwmuEa7Bzqr454nYjFGStaem6iBBdle0vBu'
            },
            {
                user: 'ccccc',
                email: 'c@cc.com',
                pass: '$2a$12$wNZXZaTZlZwjURq39g8b7.Xg0kOHZdpSJNsQaVmGFeLa8t8YGbA3e'
            }
        ]);
    });
};
