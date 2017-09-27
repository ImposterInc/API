const knex = require('./connection');

function getAllUsers(){
    return knex('users').select();
}

function getUser(id){
    return knex('users').select().where('id', id);
}

function checkUser(user){
    return knex('users').select().where('user', user)
    .then(([result]) => result);
}

function checkEmail(email){
    return knex('users').select().where('email', email)
    .then(([result]) => result);
}

function createUser({user, email, pass}){
    return knex('users')
        .insert({user, email, pass})
        .returning([
            'id',
            'user',
            'email'
        ]);
}

module.exports = {
    getAllUsers,
    getUser,
    checkUser,
    checkEmail,
    createUser
};
