const knex = require('./connection');

function getAllUsers(){
    return knex('users').select();
}

function getUser(id){
    return knex('users').select().where('id', id);
}

function checkUser(user){
    return knex('users').select().where('user', user);
}

function checkEmail(email){
    return knex('users').select().where('email', email);
}

function createUser(user, email, pass){
    return knex('users')
        .insert({
            user: user,
            email: email,
            pass: pass
        })
        .returning([
            'id',
            'user',
            'email',
            'pass'
        ]);
}

module.exports = {
    getAllUsers,
    getUser,
    checkUser,
    checkEmail,
    createUser
};
