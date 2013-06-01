/*
 * Module dependencies
 */
var async = require('async');
var db = require('../lib/dbManager');
var fnPool = require('../lib/fnPool');
var pluginManager = require ('../lib/pluginManager');

/*
 * Setup the routes and request handlers.
 */
module.exports = function(app){
	app.get('/analysisresults', function(req, res){
		pluginManager.getNames(function(plugins){
			db.getAllPerspFnNames(function(err, perspFnNames){
				db.getUrls(function(err, urls){
					res.render('analysisresults', { 
						"urlsList"	: urls,
						"pluginsList"	: plugins,
						"perspFnNames" 	: perspFnNames
					});
				});
			});
		});
	});

	app.get('/analysisresults/browse', function(req, res){
		// take the string with the urls and selected plugins (config)
		var urlsString = req.query["urls"];		
		// Separate the urls in the string and create array of strings 
		// delimiters: comma, semicolon and whitespace
		var urlsArray = urlsString.split(/\s*[,;]\s*|\s{1,}|[\r\n]+/);

		var perspFns = req.query["perspFns"];
				
		async.map(urlsArray, 
			function (url, callback) { getSiteAnalyses(url, perspFns, callback) },
			function (err, results) {
				res.json(results);
		});
	});
};


/***********************
 * Controller functions.
 */
function getSiteAnalyses (url, perspFns, callback) {
	var siteResults = { };
	
	async.map(perspFns, 
		function (perspName, callb) {
			// get the ID of the perspective function
			db.getPerspID(perspName, function (err, fnID) {
				// now get the actual perspective function from the pool with this ID
				fnPool.getFn(fnID, function (perspFn) {
					db.getPluginOfPerspFn(perspName, function (err, pluginName) {
						db.getAnalysis(url, pluginName, function (err, siteRes) {
							siteResults[perspName] = perspFn(siteRes.analyseResults);
							callb(err, 'ok!');
						})
					})
				});
			});
			
		}, 
		function (err, resl) {
			callback(err, {
				"siteName" 	: url,
				"siteOutput": siteResults
			});
	});
};