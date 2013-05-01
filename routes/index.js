/**
 * Module dependencies
 */
var pluginManager = require ('../lib/pluginManager');

/*
 * Setup the routes and request handlers.
 */
module.exports = function(app){

	app.get('/', function(req, res){
		pluginManager.getNames(function(pluginsList){
			res.render('index', { "pluginsList": pluginsList });
		});
	});
};


/***********************
 * Controller functions.
 */