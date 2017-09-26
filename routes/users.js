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

router.post('/signup', (req, res, next) => {
    if(!req.body.user || !req.body.email || !req.body.pass){
        res.json({
            status: 'incomplete'
        });
    }else{
        queries.checkUser({ user: req.body.user, email: req.body.email })
        .then(user => {
            if(user.length){
                res.json({
                    status: 'existing'
                });
            }else{
                bcrypt.hash(req.body.pass, 10)
                .then(pass => {
                    queries.createUser(req.body.user, req.body.email, pass)
                    .then(newUser => {
                        newUser = newUser[0];

                        let token = jwt.sign({
                            id: newUser.id,
                            user: newUser.user,
                            email: newUser.email
                        }, process.env.TOKEN);

                        res.json({
                            status: 'success',
                            data: token
                        });
                    })
                });
            }
        })
        .catch((err) => {
            console.log('Error!');
            res.json(err);
        });
    }
});

module.exports = router;
