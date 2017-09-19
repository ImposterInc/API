exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('users').del().then(function() {
        // Inserts seed entries
        return knex('users').insert([
            {
                user: 'aaa',
                email: 'a@a.com',
                pass: '$2a$10$0kaVMk15m7VxumhtaOz3V.0Ryfey7JPlJcr.ipBz87bfeZ038aYEG'
            },
            {
                user: 'bbb',
                email: 'b@b.com',
                pass: '$2a$10$6WSg36SYTeCYs8UHnohmSelRsJdkC4xXi7hLcx2dwvnYpKDqCH.t2'
            },
            {
                user: 'ccc',
                email: 'c@c.com',
                pass: '$2a$10$qtyk4GpcEFhgqoMY5F/o9.DRCjT3pAjxpSIFW9kKnkWyaF2uBut4m'
            }
        ]);
    });
};
