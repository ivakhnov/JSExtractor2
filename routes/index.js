/**
 * Module dependencies
 */
var pluginManager = require ('../lib/pluginManager');

/*
 * Setup the routes and request handlers.
 */
module.exports = function(app){

	app.get('/', function(req, res){
		pluginManager.getNames(function(json){
			console.log(json);
			res.render('index', { "pluginsList": json });
		});
	});
	app.get('/plugin', function(req, res){
		pluginManager.getNames(function(json){
			console.log(json);
			res.render('index', { "pluginsList": json });
		});
	});
};


/***********************
 * Controller functions.
 */