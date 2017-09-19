const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const router = express.Router();

const queries = require('../db/queries');
const knex = require('../db/connection');

router.get('/', (req, res, next) => {
    queries.getAllUsers()
    .then((user) => {
        res.json({
            status: 'success',
            data: user
        });
    })
    .catch((err) => {
        console.log('Error!');
        return next(err);
    });
});

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

router.post('/', (req, res, next) => {
    if(!req.body.user || !req.body.email || !req.body.pass){
        res.json({
            status: 'incomplete'
        });
    }else{
        queries.findUserIfExists({ user: req.body.user, email: req.body.email })
        .then((user) => {
            if(user.length){
                res.json({
                    status: 'existing'
                });
            }else{
                bcrypt.hash(req.body.pass, 10)
                .then((pass) => {
                    queries.createUser(req.body.user, req.body.email, pass)
                    .then(() => {
                        let token = jwt.sign({
                            user: req.body.user,
                            email: req.body.email,
                            pass: pass
                        }, process.env.TOKEN);

                        res.json({
                            status: 'success',
                            data: token
                        });
                    })
                })
            }
        })
        .catch((err) => {
            console.log('Error!');
            res.json(err);
        });
    }
});

module.exports = router;
