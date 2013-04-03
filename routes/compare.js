/**
 * Module dependencies
 */
var pluginManager = require ('../lib/pluginManager');

/*
 * Setup the routes and request handlers.
 */
module.exports = function(app){

	app.get('/compare', function(req, res){
		pluginManager.getNamesJson(function(json){
			res.render('compare', json);
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
