var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// todo: create sub doc instead
var PlayerSchema = new Schema({
    fullName: String,
    eventId: String
});

PlayerSchema.statics.registerPlayer = function(fullName, eventId, fn) {
    var player = new this();
    player.fullName = fullName;
    player.eventId = eventId;

    player.save(fn);
};

PlayerSchema.statics.getPlayers = function(eventId, fn) {
    this.find({ 'eventId': eventId }, 'fullName eventId', function(err, players) {
        if (err) return fn(err, null);
        fn(null, players);
    });
};

module.exports = mongoose.model('Player', PlayerSchema);

