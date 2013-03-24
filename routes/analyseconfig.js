/**
 * Module dependencies
 */
var pluginManager = require ('../lib/pluginManager');

/*
 * Setup the routes and request handlers.
 */
module.exports = function(app){
	app.get('/analyseconfig', function(req, res){
		pluginManager.getNamesJson(function(json){
			res.render('analyseconfig', json);
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

