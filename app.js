// Require all the modules
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('./config/passport.js');
var mongo = require('./config/mongo.js');
var os = require('os');
var dotenv = require('dotenv');

// Set the env variables
dotenv.config();

// Require the routes
var index = require('./routes/index');
var instance = require('./routes/instance');
var welcome = require('./routes/welcome');
var login = require('./routes/login');
var modify = require('./routes/modify');

// Creating the app with express
var app = express();

///\/\/\/\/\/\/\/\/\/\/\/\/\
/////// CONFIGURATION \\\\\\\
///\/\/\/\/\/\/\/\/\/\/\/\/\/\


// view engine setup to dynamically output variables in the HTML (here Jade)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(os.homedir()));
app.use(session({
    secret: process.env.SECRET,
    cookie: { maxAge: 2700000, secure: false }, // After 45 minutes (2700000 ms) the user is disconnected
    resave: true,
    saveUninitialized: false
}));

// MongoDB setup
mongo.init();

// Passport setup
passport.init(app);


app.use('/index', index);
app.use('/instance', instance);
app.use('/', welcome);
app.use('/login', login);
app.use('/modify', modify);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
