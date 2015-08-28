var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ResultSchema = new Schema({
    eventId: String,
    sport: String,
    playerOne: String,
    playerTwo: String,
    playerOneScore: String,
    playerTwoScore: String
});

ResultSchema.statics.registerResult = function(eventId, sport, playerOne, playerTwo, playerOneScore, playerTwoScore, fn) {
    var result = new this();
    result.eventId = eventId;
    result.sport = sport;
    result.playerOne = playerOne;
    result.playerTwo = playerTwo;
    result.playerOneScore = playerOneScore;
    result.playerTwoScore = playerTwoScore;

    result.save(fn);
};

ResultSchema.statics.getResult = function(eventId, fn) {

};

module.exports = mongoose.model('Result', ResultSchema);