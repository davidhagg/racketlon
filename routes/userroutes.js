/*
    Login and create account routes
*/
var express = require('express');
var router = express.Router();

var passport = require('passport');
var Account = require('../models/account');

router.post('/register', function (req, res) {
    Account.register(new Account({ username: req.body.username, name: req.body.name }), req.body.password, function (err, account) {
        if (err) { 
            console.log(err.message);            
            return res.redirect('/#account');
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

router.get('/login', function (req, res) {
    res.render('auth/login', { user: req.user });
});

router.post('/login', passport.authenticate('local'), function (req, res, next) {
    res.redirect('/events');
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;