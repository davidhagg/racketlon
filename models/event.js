var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EventSchema = new Schema({
    name: String,
    userId: String
});

EventSchema.statics.createEvent = function(name, user, fn) {
    var event = new this();
    event.userId = user;
    event.name = name;
    event.save(fn);
};

EventSchema.statics.getEvents = function(user, fn) {
    console.log('getEvents: ' + user);
    
    this.find({ 'userId': user }, 'name userId', function(err, event) {
        if (err) return fn(err, null);

        fn(null, event);
    });
};

EventSchema.statics.getEventById = function(eventId, fn) {
    console.log('getEventById: ' + eventId);

    this.findById(eventId, function(err, event) {
        if (err) return fn(err, null);

        fn(null, event);
    });
};

module.exports = mongoose.model('Event', EventSchema);