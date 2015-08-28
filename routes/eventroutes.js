/*
    Event routes
*/
var express = require('express');
var router = express.Router();

var Event = require('../models/event');
var Player = require('../models/player');
var Result = require('../models/result');
var ensureAuth = require('../middleware/ensureauth');

router.use(ensureAuth);

router.get('/events', function (req, res, next) {
    Event.getEvents(req.user.username, function (err, registeredEvents) {
        if (err) return next(err);

        return res.render('events/index', { registeredEvents: registeredEvents });
    })
});

router.post('/events', function (req, res, next) {
    if (!req.body.eventName) res.redirect('/events');

    Event.createEvent(req.body.eventName, req.user.username, function (err, event) {
        if (err) return next(err);

        res.redirect('/events');
    });
});

module.exports = router;