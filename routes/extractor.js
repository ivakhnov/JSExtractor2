/**
 * Module dependencies
 */
var urlLib = require('../lib/urlLib');
var db = require('../lib/dbManager');
var request = require('request');
var jsdom = require('jsdom');
var async = require('async');




/**
 * Setup the routes and request handlers.
 */
module.exports = function(app){

    app.post('/extract', function(req, res){
    	var url = req.body.url;
    	// It is possible that the user gives a url without 'http://'
		url = urlLib.addHttp(url);
    	parsePage(url, function(results) {
    		final(res, url, results);
    	});
    });

    //other routes..
};

/***********************
 * Controller functions.
 */

function final(res, url, result) {

	console.log("Script tags: " + result.scripts.length);
	console.log("DOM Events: " + result.events.length);
	
	db.resetDb();	
	//console.log(JSON.stringify(result.events));
	db.savePage(url, result.scripts, result.events);

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

function storeScript(code, type, location) {
	return {
		'code': code,
		'properties': {
			'type': type,
			'location': location
		}
	}
};

function storeEvent(nodeName, type, func, source) {
	return {
		'nodeName': nodeName,
		'listeners': {
			'type': type,
			'func': func,
			'source': source
		}
	}
};

function extractJs(document, url) {
	var results = [];
	var elements = document.getElementsByTagName('script');
	for (var i = 0; i < elements.length; i++) {
		var code, type;
		var element = elements[i];		
		// If the given element between <script> tags actually is a reference to an external .js file
		var source = element.src;
		// so it has a 'source' attribute
		if(source) {
			// then check if this is a reference to a cross domain file. 
			// If not, construct the url to that file, otherwise we already have it as attribute.
			if(!urlLib.startWithHttp(source)) { 
				type = 'file_crossDomain';
				source = urlLib.concatenateLinks(url, source);
			}
			// Now make a http request to that url, 
			// and the javascript of that file will be in the body of the response.
			request(source, function(error, response, body) {
				code = body;
				type = 'file_nonCrossDomain';
		});
		// Without the src attribute, the element itself contains its javascript code.
		} else {
			source = url;
			code = element.innerHTML;
			type = 'inplace';
		}
		results.push(storeScript(code, type, source));
	};
	return results;
};


function extractDomEvents(document) {
	var results = [];
	var all = document.getElementsByTagName('*');
	var types = [ 'click', 'dblclick', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 
			'mouseup', 'change', 'focus', 'blur', 'scroll', 'select', 'submit', 'keydown', 'keypress', 
			'keyup', 'load', 'unload' ];
	
	for (var i = 0; i < all.length; i++) {
		for (var j = 0; j < types.length; j++) {
			if (typeof all[i]['on'+types[j]] == 'function') {
				
				var nodeName = all[i].nodeName;
				var type = types[j];
				var func = all[i].getAttribute('on' + type).toString();
				var source = 'DOM 0 Event';

				results.push(storeEvent(nodeName, type, func, source));
			}
		}
	};
	return results;
};
