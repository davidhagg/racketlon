/*
	Result routes
*/
var express = require('express');
var router = express.Router();

var Event = require('../models/event');
var Player = require('../models/player');
var Result = require('../models/result');
var ensureAuth = require('../middleware/ensureauth');

router.use(ensureAuth);

router.get('/events/:eventId/results', function (req, res, next) {
	Event.getEventById(req.params.eventId, function (err, event) {
		if (err) return next(err);

		Player.getPlayers(event.id, function (errPlayers, players) {
			if (errPlayers) res.error(errPlayers.message);
			
			res.render('result/index', { event: event, players: players });
		});

	});
});

router.post('/events/:eventId/results', function (req, res, next) {
	if (!req.body.eventId) return res.redirect('/events/' + req.params.eventId + '/results');

	Result.registerResult(req.body.eventId, req.body.sport, req.body.playerOne, req.body.playerTwo, req.body.playerOneScore, req.body.playerTwoScore, function (err, event) {
		if (err) return next(err);

		return res.redirect('/events/' + req.params.eventId + '/results');
	});
});

module.exports = router;