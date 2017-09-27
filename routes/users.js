const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const router = express.Router();

const queries = require('../db/queries');
const knex = require('../db/connection');

// router.get('/', (req, res, next) => {
//     queries.getAllUsers()
//     .then((user) => {
//         res.json({
//             status: 'success',
//             data: user
//         });
//     })
//     .catch((err) => {
//         console.log('Error!');
//         return next(err);
//     });
// });

router.post('/', (req, res, next) => {
    function auth(userOrEmail, pass){
        return Promise.resolve({userOrEmail, pass})
            .then(checkArgs)
            .then(() => Promise.all([
                queries.checkUser(userOrEmail),
                queries.checkEmail(userOrEmail)
            ]))
            .then(checkPass)
            .catch(err => {
                console.log(err.toString());

                res.json({
                    status: 'failure',
                    data: err.toString()
                });
            });
    }

    function checkArgs({userOrEmail, pass}){
        if(!userOrEmail || !pass) throw new Error('Invalid Input');
        return {userOrEmail, pass};
    }

    function checkPass(user){
        [user] = user.filter(element => element !== undefined);

        if(!user) throw new Error('User Not Found');

        return bcrypt.compare(req.body.pass, user.pass)
            .then(verify)
            .then(() => sendToken(user));
    }

    function verify(check){
        if(!check) throw new Error('Incorrect Password');
    }

    function sendToken(user){
        jwt.sign({
            id: user.id,
            user: user.user,
            email: user.email
        }, process.env.TOKEN, (err, token) => {
            res.json({
                status: 'success',
                data: token
            });
        });
    }

    auth(req.body.userOrEmail, req.body.pass);
});

router.post('/signup', (req, res, next) => {
    function create({user, email, pass, confirmPass}){
        return Promise.resolve({user, email, pass, confirmPass})
            .then(checkArgs)
            .then(() => Promise.all([
                queries.checkUser(user),
                queries.checkEmail(email)
            ]))
            .then(checkExists)
            .then(() => hashPass({user, email, pass}))
            .then(queries.createUser)
            .then(sendToken)
            .catch(err => {
                console.log(err.toString());

                res.json({
                    status: 'failure',
                    data: err.toString()
                });
            });
    }

    function checkArgs({user, email, pass, confirmPass}){
        return Promise.all([
            checkUser(user),
            checkEmail(email),
            checkPass(pass, confirmPass)
        ]);
    }

    function checkUser(user){
        if(!user) throw new Error('Enter a username');
        if(user.length < 5 || user.length > 20) throw new Error('Username must be between 5 and 20 characters');
        if(user.includes('@')) throw new Error('Username cannot include \'@\' symbol');
    }

    function checkEmail(email){
        if(!email) throw new Error('Enter an email');
        if(email.length > 200) throw new Error('Email must be 200 characters or less');
        if(!email.includes('@') || !email.includes('.')) throw new Error('Please enter a valid email');
    }

    function checkPass(pass, confirmPass){
        if(!pass || !confirmPass) throw new Error('Please enter both passwords');
        if(pass.length > 200 || pass.length < 8 || confirmPass.length > 200 || confirmPass.length < 8) throw new Error('Password must be between 8 and 200 characters');
        if(pass !== confirmPass) throw new Error('Passwords do not match');
    }

    function checkExists(user){
        if(user.filter(element => element !== undefined).length) throw new Error('Username or email already exists');
    }

    function hashPass({user, email, pass}){
        return bcrypt.hash(pass, 12)
            .then(hash => {
                return {user, email, pass: hash};
            });
    }

    function sendToken([user]){
        jwt.sign({
            id: user.id,
            user: user.user,
            email: user.email
        }, process.env.TOKEN, (err, token) => {
            res.json({
                status: 'success',
                data: token
            });
        });
    }

    create(req.body);
});

// router.post('/', (req, res, next) => {
//     if(req.body.userOrEmail.length && req.body.pass.length){
//         queries.checkUser(req.body.userOrEmail)
//         .then(userOrEmail => {
//             console.log(userOrEmail);
//
//             if(userOrEmail.length){
//                 userOrEmail = userOrEmail[0];
//
//                 return bcrypt.compare(req.body.pass, userOrEmail.pass)
//                 .then(check => {
//                     console.log('bcrypt compare: ', check);
//                     if(check){
//                         let token = jwt.sign({
//                             id: userOrEmail.id,
//                             user: userOrEmail.user,
//                             email: userOrEmail.email
//                         }, process.env.TOKEN);
//
//                         res.json({
//                             status: 'success',
//                             data: token
//                         });
//
//                         return false;
//                     }else{
//                         return true;
//                     }
//                 })
//                 .catch((err) => {
//                     console.log('Error!');
//                     return next(err);
//                 });
//             }else{
//                 return true;
//             }
//         })
//         .then(not => {
//             if(not){
//                 queries.checkEmail(req.body.userOrEmail)
//                 .then(userOrEmail => {
//                     if(userOrEmail.length){
//                         bcrypt.compare(req.body.pass, userOrEmail[0].pass)
//                         .then(check => {
//                             if(check){
//                                 let token = jwt.sign({
//                                     id: userOrEmail[0].id,
//                                     user: userOrEmail[0].user,
//                                     email: userOrEmail[0].email
//                                 }, process.env.TOKEN);
//
//                                 res.json({
//                                     status: 'success',
//                                     data: token
//                                 });
//                             }else{
//                                 res.json({
//                                     status: 'failure'
//                                 });
//                             }
//                         })
//                         .catch((err) => {
//                             console.log('Error!');
//                             return next(err);
//                         });
//                     }else{
//                         res.json({
//                             status: 'failure'
//                         });
//                     }
//                 })
//                 .catch((err) => {
//                     console.log('Error!');
//                     return next(err);
//                 });
//             }
//         })
//         .catch((err) => {
//             console.log('Error!');
//             return next(err);
//         });
//     }else{
//         res.json({
//             status: 'failure'
//         });
//     }
// });

router.get('/:id', (req, res, next) => {
    queries.getUser(req.params.id)
    .then((user) => {
        if(!user.length){
            res.json({
                status: 'failure'
            });
        }else{
            res.json({
                status: 'success',
                data: user
            });
        }
    })
    .catch((err) => {
        console.log('Error!');
        return next(err);
    });
});

// router.post('/signup', (req, res, next) => {
//     if(!req.body.user || !req.body.email || !req.body.pass){
//         res.json({
//             status: 'incomplete'
//         });
//     }else{
//         queries.checkUser({ user: req.body.user, email: req.body.email })
//         .then(user => {
//             if(user.length){
//                 res.json({
//                     status: 'existing'
//                 });
//             }else{
//                 bcrypt.hash(req.body.pass, 10)
//                 .then(pass => {
//                     queries.createUser(req.body.user, req.body.email, pass)
//                     .then(newUser => {
//                         newUser = newUser[0];
//
//                         let token = jwt.sign({
//                             id: newUser.id,
//                             user: newUser.user,
//                             email: newUser.email
//                         }, process.env.TOKEN);
//
//                         res.json({
//                             status: 'success',
//                             data: token
//                         });
//                     })
//                 });
//             }
//         })
//         .catch((err) => {
//             console.log('Error!');
//             res.json(err);
//         });
//     }
// });

module.exports = router;
