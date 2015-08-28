// Simple route middleware to ensure user is authenticated.  Otherwise send to login page.
var ensureAuthenticated = function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login');
};

module.exports = ensureAuthenticated;