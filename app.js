var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var webRoutes = require('./webserver/routes');
var apiRoutes = require('./appserver/api.routes.js');
var authRoutes = require('./appserver/controllers/auth.server.controller.js');
var settings = require('settings.js');

var app = express();

var mongoose = require('mongoose');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'webserver/app')));


app.use('/', webRoutes);
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);

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

  console.log('RUNNING IN DEV MODE');
  mongoose.connect('mongodb://localhost/home-taskboard');

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
if (app.get('env') === 'production') {
  var connectionString = 'mongodb://' + settings.USER_NAME+ ':' + settings.PASSWORD +'@ds033175.mongolab.com:33175/home-taskoard';
  mongoose.connect(connectionString);
  console.log('RUNNING IN PROD MODE');
}

app.use(function(err, req, res, next) {

  console.log('RUNNING IN PROD MODE');
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
