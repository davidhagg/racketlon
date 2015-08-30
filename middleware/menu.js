var s = require('string');

var menu = function setMenu(req, res, next) {
    
    if (s(req.url).endsWith('events')) {
        res.locals.menu = 'events';    
    } else if (s(req.url).endsWith('players')) {
        res.locals.menu = 'players';
    } else if (s(req.url).endsWith('results')) {
        res.locals.menu = 'results';
    } else {
        res.locals.menu = '';
    }
    
    return next();
};

module.exports = menu;