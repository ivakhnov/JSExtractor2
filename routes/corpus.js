/**
 * Module dependencies
 */
var db = require('../lib/dbManager');
var pluginManager = require ('../lib/pluginManager');

/*
 * Setup the routes and request handlers.
 */
module.exports = function(app){
	app.get('/corpus', function(req, res){
		pluginManager.getNames(function(plugins){
			db.getAllPerspFnNames(function(err, perspFnNames){
				console.log('testlengte: ' + perspFnNames);
				res.render('corpus', { 
					"pluginsList"	: plugins,
					"perspFnNames" 	: perspFnNames
				});
			});
		});
	});

};


/***********************
 * Controller functions.
 */