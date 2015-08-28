/*
    Player routes
*/

var express = require('express');
var router = express.Router();

var Event = require('../models/event');
var Player = require('../models/player');
var Result = require('../models/result');
var ensureAuth = require('../middleware/ensureauth');    

router.use(ensureAuth);

router.get('/events/:eventId/players', function (req, res, next) {
    if (!req.params.eventId) res.redirect('/events');

    Event.getEventById(req.params.eventId, function (err, event) {
        if (err) return next(err);

        Player.getPlayers(event.id, function (errPlayers, players) {
            if (errPlayers) return next(errPlayers);

            return res.render('players/index', { event: event, players: players });
        });
    });
});

router.post('/events/:eventId/players', function (req, res, next) {
    if (!req.body.fullName) return res.redirect('/events/' + req.params.eventId + '/players');

    Player.registerPlayer(req.body.fullName, req.body.eventId, function (err, event) {
        if (err) return next(err);

        return res.redirect('/events/' + req.params.eventId + '/players');
    });
});

module.exports = router;
