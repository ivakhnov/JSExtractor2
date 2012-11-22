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
      searchJs(url, function(results) {
        final(res, results);
      });
    });

    //other routes..
};

/***********************
 * Controller functions.
 */

function final(res, results) {

  console.log("Script tags: " + results.length);

  res.render('js_list.jade', { title: 'Extracted JS code', scripts: results });
}

/**
 * Makes a request to the given url to get the HTML of that page.
 * Creates a DOM with JDOM. Creates an array of all the extracted
 * code encapsulated between <script>..</script> tags.
 *
 * @param {object} res Is the respond object from the request handler.
 * @param {string} url The given url can be not normalized, meaning not containing 'http://'
 */
function searchJs(url, finalCallback){
	url = addHttp(url);

  request(url, function(error, response, body) {
    if (error || response.statusCode !== 200) {
      console.log('Error when contacting ' + url);
      console.log(body);
    }

    var window = jsdom.jsdom(body).createWindow();
	  var scripts = window.document.getElementsByTagName('script');
    var results = new Array(scripts.length);

    counter = scripts.length;
    function makeCallback (index) {
      return function(extractedJs) {
        counter --;

        console.log("nu bezig aan: " + index);
        console.log(extractedJs.substring(0, 50));
        results[index] = extractedJs.substring(0, 100);

        //results[index] = extractedJs;

        if(counter == 0) {
          finalCallback(results);
        }
      }
    }


    for (var i = 0; i < scripts.length; i++) {
      extractJs(url, scripts[i], makeCallback(i));
    }
  });
};

function extractJs(url, element, callb) {
  var source = element.src;
  if(source) {
    if(!startWithHttp(source)) source = concatenateLinks(url, source);

    request(source, function(error, response, body) {
      callb(body);
    });
    
  } else {
    callb(element.innerHTML);
  }
}

/**
 * It is possible that the user gives a url without 'http://'
 * this method makes the concatenation if needed.
 * 
 * @param {string} url of a web page
 */
function addHttp(url) {
  if(!startWithHttp(url)) {
      url = "http://" + url;
  }
  return url;
}

function startWithHttp(url) {
  var pattern = /^((http|https|ftp):\/\/)/;
  return pattern.test(url);
}


function concatenateLinks() {
  var result = arguments[0];
  for (var i = 1; i < arguments.length; i++) {
    var argument = arguments[i];
    //       ***/ + /***
    //       **** + /***
    //       ***/ + ****
    //       **** + ****
    if(!result.charAt(result.length - 1) == '/')  result += '/';
    if(!argument.charAt(0) == '/')  argument = argument.substring(1);
    
    result += argument;
  }
  return result;
}



