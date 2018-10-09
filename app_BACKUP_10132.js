var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressLayouts = require('express-ejs-layouts');
var session = require('express-session');
var passport = require('passport');
var Sequelize = require ('sequelize');
var SequelizeStore = require('connect-session-sequelize')(session.Store);
const SessionStore = require('express-session-sequelize')(session.Store);

var index = require('./routes/index');
// var todo = require('./routes/todo');
var usersrouter = require('./routes/admin');

var app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var sequelize = new Sequelize(
  "goflyfirst_development_new",
  "postgres",
  "password", {
      "host": process.env.DATABASE_URL,
      "dialect": "postgres",
      "storage": "./session.postgres"
  });

  const sequelizeSessionStore = new SessionStore({
    db: sequelize,
});

  app.use(session({
    secret: 'keyboard cat',
    store:sequelizeSessionStore,
    resave: false, // we support the touch method so per the express-session docs this should be set to false
    // proxy: true,// if you do SSL outside of node.
    saveUninitialized: false,
  }))


app.use(passport.initialize());
app.use(passport.session());
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(expressLayouts);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/admin', usersrouter);
// app.use('/todo', todo);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
