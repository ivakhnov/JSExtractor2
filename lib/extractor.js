var request = require('request');
var jsdom = require('jsdom');
var async = require('async');
var urlLib = require('../lib/urlLib');



var Extractor = function() {

	/**
	 * Makes a request to the given url to get the HTML of that page.
	 * Creates a DOM with JDOM. Creates an array of all the extracted
	 * code encapsulated between <script>..</script> tags.
	 *
	 * @param {object} res Is the respond object from the request handler.
	 * @param {string} url The given url can be not normalized, meaning not containing 'http://'
	 */
	this.parsePage = function(url, finalCallback){

		request(url, function(error, response, body) {
			if(error || response.statusCode !== 200) {
				console.log('Error when contacting ' + url);
				console.log(body);
			}

			var document = jsdom.jsdom(body);
			var window = document.createWindow();

			// An array or object containing functions to run, 
			// each function is passed a callback it must call on completion.
			async.parallel({
				scripts: function(callback){
					extractJs(document, url, function(err, reply) {
				    	if(err) { callback(err); } 
						else { callback(null, reply); }
					});
				},
				events: function(callback){
					extractDomEvents(document, function(err, reply) {
				    	if(err) { callback(err); } 
						else { callback(null, reply); }
					});
				},
			}, function(err, results) {
				//window.close();
				finalCallback(results); 
			});

			
		});
	};

	var storeScript = function(code, type, location) {
		return {
			'code': code,
			'properties': {
				'type': type,
				'location': location
			}
		}
	};

	var storeEvent = function(nodeName, type, func, source) {
		return {
			'nodeName': nodeName,
			'listeners': {
				'type': type,
				'func': func,
				'source': source
			}
		}
	};

	var extractJs = function(document, url, callback) {
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
				if(urlLib.startWithHttp(source)) { 
					type = 'file_crossDomain';
				} else {
					type = 'file_nonCrossDomain';
					source = urlLib.concatenateLinks(url, source);
				}
				// Now make a http request to that url, 
				// and the javascript of that file will be in the body of the response.
				request(source, function(error, response, body) {
					code = body;
				});
			// Without the src attribute, the element itself contains its javascript code.
			} else {
				source = url;
				code = element.innerHTML;
				type = 'inplace';
			}
			results.push(storeScript(code, type, source));
		};
		callback(null, results);
	};


	var extractDomEvents = function(document, callback) {
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
		callback(null, results);
	};
};


module.exports = new Extractor();