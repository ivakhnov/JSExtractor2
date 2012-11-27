/**
 * Module dependencies
 */
var urlLib = require('../lib/urlLib');
var request = require('request');
var jsdom = require('jsdom');
var async = require('async');




/**
 * Setup the routes and request handlers.
 */
module.exports = function(app){

    app.post('/extract', function(req, res){
    	var url = req.body.url;
    	parsePage(url, function(results) {
    		final(res, results);
    	});
    });

    //other routes..
};

/***********************
 * Controller functions.
 */

function final(res, result) {

	console.log("Script tags: " + result.scripts.length);
	console.log("DOM Events: " + result.events.length);

	res.render('js_list.jade', { title: 'Extracted JS code', scripts: result.scripts });
};

/**
 * Makes a request to the given url to get the HTML of that page.
 * Creates a DOM with JDOM. Creates an array of all the extracted
 * code encapsulated between <script>..</script> tags.
 *
 * @param {object} res Is the respond object from the request handler.
 * @param {string} url The given url can be not normalized, meaning not containing 'http://'
 */
function parsePage(url, finalCallback){
  // It is possible that the user gives a url without 'http://'
	url = urlLib.addHttp(url);

  request(url, function(error, response, body) {
    if (error || response.statusCode !== 200) {
     	console.log('Error when contacting ' + url);
     	console.log(body);
    }

    var document = jsdom.jsdom(body);
	var window = document.createWindow();

    // An array or object containing functions to run, 
    // each function is passed a callback it must call on completion.
    async.parallel({
    	scripts: function(callback){
    		callback(null, extractJs(document, url));
    	},
    	events: function(callback){
    		callback(null, extractDomEvents(document));
    	},
    }, function(err, results) {
    	window.close();
    	finalCallback(results); 
	});

    
  });
};


function extractJs(document, url) {
	var result = [];
	var elements = document.getElementsByTagName('script');
	for (var i = 0; i < elements.length; i++) {
		var element = elements[i];
		// If the given element between <script> tags actually is a reference to an external .js file
		var source = element.src;
		// so it has a 'source' attribute
		if(source) {
			// then check if this is a reference to a cross domain file. 
			// If not, construct the url to that file, otherwise we already have it as attribute.
			var domainBool = 'non-crossDomain';			
			if(!urlLib.startWithHttp(source)) { 
				domainBool = 'crossDomain';
				source = urlLib.concatenateLinks(url, source);
			}
			// Now make a http request to that url, 
			// and the javascript of that file will be in the body of the response.
			request(source, function(error, response, body) {
				result.push({
					'code': body,
					'properties': {
						'domainBool': domainBool,
						'location': source
					} 
				});
		});
		// Without the src attribute, the element contains its javascript code.
		} else {
			result.push({
				'code': element.innerHTML,
				'properties': 'inplace' 
			});
		}
	};
	return result;
};


function extractDomEvents(document) {
	var result = [];
	var all = document.getElementsByTagName('*');
	var types = [ 'click', 'dblclick', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 
			'mouseup', 'change', 'focus', 'blur', 'scroll', 'select', 'submit', 'keydown', 'keypress', 
			'keyup', 'load', 'unload' ];
	
	for (var i = 0; i < all.length; i++) {
		for (var j = 0; j < types.length; j++) {
			if (typeof all[i]['on'+types[j]] == 'function') {
				result.push({
					"node": all[i],
					"listeners": [ {
						"type": types[j],
						//"func": all[i]['on'+types[j]].toString(),
						"func": all[i].getAttribute('on'+types[j]).toString(),
						"removed": false,
						"source": 'DOM 0 event'
					} ]
				});
			}
		}
	};
	return result;
};
