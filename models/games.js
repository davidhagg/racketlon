// Schemas
var playerSchema = new Schema({
    eventId: { type: String, index: true, unique: true },
    fullName: {type: String, index: true, unique: true},
    games: {type: [Schema.ObjectId], ref: 'Game'}
});

var gameSchema = new Schema({
    homePlayer: [{player: {fullName: String}, score: Number}],
    awayPlayer: [{player: {fullName: String}, score: Number}]
});

// Models
var Player = mongoose.model('Player', playerSchema);
var Game = mongoose.model('Game', gameSchema);

// Middleware
gameSchema.post('save', function (game) {
    var addMatchToPlayer = function(name) {
        Player.findOne({ fullName: name }, function(err, player) {
            if (!err && player && player.games.indexOf(game._id) === -1) {
                player.games.push(game._id);
                player.save();
            }
        });
    };

    for (var i = 0; i < game.homeTeam.length; i++) {
        addMatchToPlayer(game.homeTeam[i].name);
    }

    for (var i = 0; i < game.awayTeam.length; i++) {
        addMatchToPlayer(game.awayTeam[i].name);
    }
});

playerSchema.post(req.body.fullName, req.body.eventId, function(err, event) {
    if (err) res.error(err.message);

    var player = new Player();
    player.fullname = 

    res.redirect('/players');
});

// Queries
Player.findOne({name: 'Roel van Uden'}).populate('games').exec(function (err, player) {
});