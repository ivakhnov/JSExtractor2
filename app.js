
/**
 * Module dependencies.
 */
var express = require('express');
var http = require('http');
var path = require('path');

var request = require('request');
var jsdom = require('jsdom');



var app = express();
//var store = new express.session.MemoryStore;

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({secret: 'JSExtractor2'}));
  // If we want some logic to execute before rendering each and every view, we can use dynamic helpers.
  // The object ‘session’ will now be available to every view which will right now contain user information.
  // In fact this is used to store some variables which will be displayed on every single page.
  app.use(function(req, res, next){
    res.locals.userUrls = req.session.userUrls;
    next();
  });
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});
//use:
//NODE_ENV=development node app.js

app.configure('production', function(){
  app.use(express.errorHandler());
});
//use:
//NODE_ENV=production node app.js


/**
 *  Include all the route files and setup the routes.
 */
[ 'index', 
  'extract',
  'scripts',
  'events',
  'analyseconfig',
  'analyseresults',
  'pluginConfigs',
  'compare'].map(function(controllerName) {
    require('./routes/' + controllerName)(app);
 });


/**
 * Finally create the server, and print in console the used port.
 */
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
