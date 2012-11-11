
/**
 * Module dependencies.
 */


var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var extractor = require('./routes/extractor');
var http = require('http');
var path = require('path');

var request = require('request');
var jsdom = require('jsdom');
var url = require('url');



var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});
/////////////////////////////////////////////////////////////
/**
 * All the GET requests.
 */
app.get('/', routes.index);
/**
 * All the POST requests.
 */
app.post('/extract', extractor.extract);
////////////////////////////////////////////////////////////////
/**
 * Finelly create the server, and print in console the used port.
 */
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
