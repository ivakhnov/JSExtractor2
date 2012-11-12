/**
 * Module dependencies
 */
var request = require('request');
var jsdom = require('jsdom');



/**
 * Setup the routes and request handlers.
 */
module.exports = function(app){

    app.post('/extract', function(req, res){
      var url = req.body.url;
      extract(res, url);
    });

    //other routes..
};

/***********************
 * Controller functions.
 */

/**
 * Makes a request to the given url to get the HTML of that page.
 * Creates a DOM with JDOM. Creates an array of all the extracted
 * code encapsulated between <script>..</script> tags.
 *
 * @param {object} res Is the respond object from the request handler.
 * @param {string} url The given url can be not normalized, meaning not containing 'http://'
 */
var extract = function(res, url){
	url = addHttp(url);

  request(url, function(error, response, body) {
    var window = jsdom.jsdom(body).createWindow();
	  var scripts = window.document.getElementsByTagName('script');
	  res.render('js_list.jade', { title: 'Extracted JS code', scripts: scripts });
  });
};

/**
 * It is possible that the user gives a url without 'http://'
 * this method makes the concatenation if needed.
 * 
 * @param {string} url of a web page
 */
var addHttp = function(url) {
  var pattern = /^((http|https|ftp):\/\/)/;

  if(!pattern.test(url)) {
      url = "http://" + url;
  }
  return url;
}