var redis = require('redis');
var bcrypt = require('bcrypt');
var db = redis.createClient('17869', 'pub-redis-17869.us-east-1-4.3.ec2.garantiadata.com', null);

db.auth('Ne3york0723', function() {
    console.log('Redis client connected');
});

module.exports = User;

function User(obj) {
    for (var key in obj) {
        this[key] = obj[key];
    }
}

// Save or update user
User.prototype.save = function(fn) {
    if (this.id) {
        this.update(fn); // user already exists
    } else {
        var user = this;
        db.incr('user:ids', function(err, id) {
            if (err) return fn(err);
            user.id = id;
            user.hashPassword(function(hashErr) {
                if (hashErr) return fn(hashErr);
                user.update(fn);
            });
        });
    }
};

// Update user
User.prototype.update = function(fn) {
    var user = this;
    var id = user.id;
    db.set('user:id' + user.name, id, function(err) {
        if (err) return fn(err);
        db.hmset('user:' + id, user, function(hmsetErr) {
            fn(hmsetErr);
        });
    });
};

User.getByName = function(name, fn) {
    User.getId(name, function(err, id) {
        if (err) return fn(err);
        User.get(id, fn);
    });
};

User.getId = function(name, fn) {
    db.get('user:id:' + name, fn);
};

User.get = function(id, fn) {
    db.hgetall('user:' + id, function(err, user) {
        if (err) return fn(err);
        fn(null, new User(user));
    });
};

// Authenticate a user
User.authenticate = function(name, pass, fn) {
    User.getByName(name, function(err, user) {
        if (err) return fn(err);
        if (!user.id) return fn();
        bcrypt.hash(pass, user.salt, function(err, hash) {
            if (err) return fn(err);
            if (hash == user.pass) return fn(null, user);
            fn();
        });
    });
};

// Hash password
User.prototype.hashPassword = function(fn) {
    var user = this;
    bcrypt.genSalt(12, function(err, salt) {
        if (err) return fn(err);
        user.salt = salt;
        bcrypt.hash(user.pass, salt, function(hashErr, hash) {
            if (err) return fn(hashErr);
            user.pass = hash;
            fn();
        });
    });
};

/*
var david = new User({
    name: 'David',
    pass: 'test',
    age: '33'
});

david.save(function(err) {
    if (err) throw err;
    console.log('user id: %d', david.id);
});

*/