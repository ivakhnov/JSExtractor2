var request = require('request');
var jsdom = require('jsdom');



/*
 * POST the url from which JS code will be extracted.
 */

/**
 * Makes a request to the given url to get the HTML of that page.
 * Creates a DOM with JDOM. Creates an array of all the extracted
 * code encapsulated between <script>..</script> tags.
 */
exports.extract = function(req, res){
	var url = req.body.url;
	url = addHttp(url);
    console.log("De gegeven url is: " + url);

    request(url, function(error, response, body) {
      var window = jsdom.jsdom(body).createWindow();
		  var scripts = window.document.getElementsByTagName('script');
		  res.render('js_list.jade', { title: 'Extracted JS code:', scripts: scripts });
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