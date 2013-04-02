/**
 * Module dependencies
 */
var async = require('async');
var pluginManager = require('../lib/pluginManager');

/*
 * Setup the routes and request handlers.
 */
module.exports = function(app){
	app.post('/analyseresults', function(req, res){
		var config = JSON.parse(req.body.config);
		console.log('aantal plugins actief in analyse: ' + config.length);

		var userUrls = res.locals.userUrls;
		
		function triggerPlugin(conf, callback){
			console.log('config in POST - id: ' + conf.pluginID);
			console.log('config in POST - con: ' + conf.config);
			pluginManager.startPlugin(conf.pluginID, conf.config, userUrls, function(err, analyseResults) {
				if(err != null) {
					callback(err);
				} else {
					// add results to database
					callback(err, analyseResults);
				}
			});
		};
		
		async.mapSeries(config, triggerPlugin, function(err, results){
			console.log('result of map: ' + JSON.stringify(results));
			res.render('analyseresults', { 'results': results });
		});
	});

};


/***********************
 * Controller functions.
 */

