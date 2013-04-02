/**
 * Module dependencies
 */
var async = require('async');
var db = require('../lib/dbManager');
var urlLib = require('../lib/urlLib');
var extractor = require('../lib/extractor');
var pluginManager = require ('../lib/pluginManager');

/*
 * Setup the routes and request handlers.
 */
module.exports = function(app){
	// SUPPORTING GET REQUESTS ONLY FOR TESTING:
	app.get('/analyseconfig', function(req, res){
		pluginManager.getNamesJson(function(json){
			res.render('analyseconfig', json);
		});
	});

	app.post('/analyseconfig', function(req, res){
		// take the string with the urls
		var urlsString = req.body.urls;
		// Separate the urls in the string and create array of strings 
		// delimiters: comma, semicolon and whitespace
		var urlsArray = urlsString.split(/\s*[,;]\s*|\s{1,}|[\r\n]+/);

		// Store urls in a cookie. (not needed on this page, but is required on
		// analyseresults page, so instead of sending those urls back and forward on each 
		// post en get request, store it temporarily in cookie)
		req.session.userUrls = urlsArray;

		// Go through urlsArray and extract JS from pages. When done, get the names of all
		// installed plugins and render the page, or return to main page if any of the urls 
		// is wrong or causes a problem.
		async.map(urlsArray, parsePage, function(err, results){
			if(err) {
				console.log(err);
				console.log('Catched an error in extractor.js');
				//res.render('error');
			} else {
				pluginManager.getNamesJson(function(json){
					res.render('analyseconfig', json);
				});
			}
		});
	});

	app.get('/analyseconfig/plugin', function(req, res){
		pluginManager.getInputView(req.query['toolName'], function(html){
			res.json({ 'inputView': html });
		});
	});

};


/***********************
 * Controller functions.
 */

// extract different JS code from page
function parsePage(url, callback){
	// It is possible that the user gives a url without 'http://'
	urlHttp = urlLib.addHttp(url);
	
	extractor.parsePage(urlHttp, function(err, results) {
		if(err != null) {
			callback(err);
		} else {
			var scripts = results.scripts;
			var events = results.events;

			console.log("Script tags: " + scripts.length);
			console.log("DOM Events: " + events.length);
			
			//db.resetDb();	
			db.savePage(url, scripts, events, function(err, reply) {
				console.log('saved in database');
				callback(err, reply);
			});
		};
	});
};