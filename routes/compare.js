/**
 * Module dependencies
 */
var pluginManager = require ('../lib/pluginManager');

/*
 * Setup the routes and request handlers.
 */
module.exports = function(app){

	app.get('/compare', function(req, res){
		pluginManager.getNames(function(json){
			res.render('compare', { "pluginsList": json });
		});
	});

	app.get('/compare/plugin', function(req, res){
		pluginManager.getOutputFormat(req.query['pluginName'], function(format){
			res.json({ 'outputFormat': format });
		});
	});

};


/***********************
 * Controller functions.
 */
