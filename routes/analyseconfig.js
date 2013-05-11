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
	app.get('/analyseconfig', function(req, res){
		pluginManager.getNames(function(json){
			res.render('analyseconfig', { "pluginsList": json });
		});
	});

	app.get('/analyseconfig/plugin', function(req, res){
		var pluginName = req.query['pluginName'];
		
		db.getPluginConfigs(pluginName, function(pluginConfigs){
			res.json({ 'pluginConfigs': pluginConfigs });
		});
	});
	
	app.post('/analysis/add', function(req, res){
		// take the string with the urls and selected plugins (config)
		var urlsString = req.body.urls;		
		// Separate the urls in the string and create array of strings 
		// delimiters: comma, semicolon and whitespace
		var urlsArray = urlsString.split(/\s*[,;]\s*|\s{1,}|[\r\n]+/);

		var plugins = JSON.parse(req.body.plugins);

		// Go through urlsArray and extract JS from pages. When done, get the names of all
		// installed plugins and render the page, or return to main page if any of the urls 
		// is wrong or causes a problem.
		async.map(urlsArray, 
			function (url, callback) { 
				parsePage(url, function (err) {
					if(err) { callback (err); }
					else { analyseSite(url, plugins, callback); }
				});
			}, 
			function (err, results){
				if(err) {
					console.log(err);
					console.log('Catched an error in extractor.js');
					//res.render('error');
				} else {
					res.json({ "status": "SUCCESS" });
				}
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
			
			db.savePage(url, scripts, events, function(err, reply) {
				console.log('saved in database');
				callback(err, reply);
			});
		};
	});
};

function triggerPlugin(plugin, url, callback){
	var pluginID = plugin.pluginID;
	var pluginName = pluginManager.getPluginName(pluginID);
	var pluginConfig = plugin.configNameSelect;

	pluginManager.startPlugin(pluginID, pluginConfig, url, function(err, analyseResults) {
		if(err != null) {
			callback(err);
		} else {
			// add results to database
			db.saveAnalyse(url, pluginName, pluginConfig, analyseResults, function(err, saveResp){
				callback(err, {
					'pluginName':		pluginName,
					'analyseResults':	analyseResults
				});
			});
		}
	});
};

function analyseSite(url, plugins, callback){
	async.map(plugins, 
		function(plugin, callback) {
			triggerPlugin(plugin, url, callback);
		}, 
		function(err, results){
			callback(err, {
				'siteName': url,
				'siteOutput': results
		});
	});
};