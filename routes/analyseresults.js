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
		console.log('aantal tools actief in analyse: ' + config.length);

		var userUrls = res.locals.userUrls;
		
		function triggerTool(conf, callback){
			console.log('config in POST - id: ' + conf.toolID);
			console.log('config in POST - con: ' + conf.config);
			pluginManager.startTool(conf.toolID, conf.config, userUrls, callback);
		};
		
		async.mapSeries(config, triggerTool, function(err, results){
			console.log('result of map: ' + JSON.stringify(results));
			res.render('analyseresults', { 'results': results });
		});
	});

};


/***********************
 * Controller functions.
 */

