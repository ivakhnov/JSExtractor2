
/**
 * Module dependencies.
 */


var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var request = require('request');
var jsdom = require('jsdom');
var url = require('url');

/*

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

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
*/


var throwError = function(errorMessage, errorCode) {
  console.log(errorMessage + '\n' + 'Error: ' + errorCode);
}


var addHttp = function(url) {
  var pattern = /^((http|https|ftp):\/\/)/;

  if(!pattern.test(url)) {
      url = "http://" + url;
  }
  return url;
}


var getByScriptTags = function(normalized_url, retries) {
  if(retries <= 0) {
    return throwError('Error contacting website', 404);
  }


  request({ uri:normalized_url }, function (error, response, body) {
    if (error && response.statusCode !== 200) {
      console.log('attempts left: ' + retries);
      return getHTML(retries - 1);
    }

    var window = jsdom.jsdom(body).createWindow();
    var script = window.document.getElementsByTagName('script');


    console.log(script[0].innerHTML);

  });

};


url = 'webmail.ulb.ac.be/webmail.php';

url = addHttp(url);

getByScriptTags(url, 5); 
