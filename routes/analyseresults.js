/**
 * Module dependencies
 */
var async = require('async');
var db = require('../lib/dbManager');
var urlLib = require('../lib/urlLib');
var extractor = require('../lib/extractor');
var pluginManager = require('../lib/pluginManager');

/*
 * Setup the routes and request handlers.
 */
module.exports = function(app){
	app.post('/analyseresults', function(req, res){
		// take the string with the urls and selected plugins (config)
		var urlsString = req.body.urls;
		var config = JSON.parse(req.body.config);
		
		console.log('TEEEST: ' + req.body.config);

		// Separate the urls in the string and create array of strings 
		// delimiters: comma, semicolon and whitespace
		var urlsArray = urlsString.split(/\s*[,;]\s*|\s{1,}|[\r\n]+/);

		
		console.log('analyse conf: ' + config);

		var usedPlugins = config.map (function(pluginConf){
			var pluginID = pluginConf.pluginID;
			return {
				'pluginName': pluginManager.getPluginName(pluginID),
				'dataPerspectives': pluginManager.getDataPerspectives(pluginID)
			};
		});

		function analyseSite(url, callback){

			function triggerPlugin(conf, callback){
				var pluginID = conf.pluginID;
				var pluginName = pluginManager.getPluginName(pluginID);
				var analyseConfig = conf.config;

				pluginManager.startPlugin(pluginID, analyseConfig, url, function(err, analyseResults) {
					if(err != null) {
						callback(err);
					} else {
						// add results to database
						db.saveAnalyse(url, pluginName, analyseResults, function(err, saveResp){
							callback(err, {
								'pluginName':		pluginName,
								'analyseResults':	analyseResults
							});
						});
					}
				});
			};

			async.map(config, triggerPlugin, function(err, results){
				callback(err, {
					'siteName': url,
					'siteOutput': results
				});
			});
		};

		// Go through urlsArray and extract JS from pages. When done, get the names of all
		// installed plugins and render the page, or return to main page if any of the urls 
		// is wrong or causes a problem.
		async.map(urlsArray, parsePage, function(err, results){
			if(err) {
				console.log(err);
				console.log('Catched an error in extractor.js');
				//res.render('error');
			} else {
				pluginManager.getNames(function(json){
					res.render('analyseconfig', { "pluginsList": json });
				});
			}
		});

		async.map(urlsArray, analyseSite, function(err, results){
			res.render('analyseresults', { 
				'usedPlugins': usedPlugins, 
				'analyseResults': results 
			});
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