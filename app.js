/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var expressLayouts = require('express3-ejs-layout');
var passport = require('passport');
var passportLocal = require('passport-local');
var mongoose = require('mongoose');
var messages = require('./lib/messages');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layout');


//app.use(favicon(__dirname + '/public/favicon.ico'))
app.use(morgan('combined'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(multer());

app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(messages);
app.use(expressLayouts);

app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

// Passport setup
var LocalStrategy = passportLocal.Strategy;
var Account = require('./models/account');

// passport config
//passport.use(new LocalStrategy(Account.authenticate()));
passport.use(Account.createStrategy());
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// mongoose
mongoose.connect('mongodb://localhost:27017/racketlon');

// Append user to all requests
app.use(function(req, res, next){
  res.locals.user = req.session.passport.user;
  if (req.user) {
    res.locals.name = req.user.name;
  }
  
  next();
});


// root route
app.get('/', function (req, res) {
    res.render('index', { user: req.session.passport.user });
});

var userRoutes = require('./routes/userroutes.js');
var eventRoutes = require('./routes/eventroutes.js');
var playerRoutes = require('./routes/playerroutes.js');
var resultRoutes = require('./routes/resultroutes.js');

app.use(userRoutes);
app.use(eventRoutes);
app.use(playerRoutes);
app.use(resultRoutes);

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
