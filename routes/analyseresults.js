/**
 * Module dependencies
 */
var async = require('async');
var db = require('../lib/dbManager');
var pluginManager = require('../lib/pluginManager');

/*
 * Setup the routes and request handlers.
 */
module.exports = function(app){
	app.post('/analyseresults', function(req, res){
		var config = JSON.parse(req.body.config);
		console.log('analyse conf: ' + config);

		var userUrls = res.locals.userUrls;

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

		async.map(userUrls, analyseSite, function(err, results){
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

