/**
 * Module dependencies
 */
var pluginManager = require ('../lib/pluginManager');

/*
 * Setup the routes and request handlers.
 */
module.exports = function(app){
	app.get('/corpus', function(req, res){
		pluginManager.getNames(function(plugins){
			res.render('corpus', { "pluginsList": plugins });
		});
	});

};


/***********************
 * Controller functions.
 */