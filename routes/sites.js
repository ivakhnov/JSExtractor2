/*
 * Module dependencies
 */
var async = require('async');
var db = require('../lib/dbManager');
var pluginManager = require ('../lib/pluginManager');

/*
 * Setup the routes and request handlers.
 */
module.exports = function(app){
	app.get('/sites', function(req, res){
		pluginManager.getNames(function(plugins){
			db.getUrls(function(err, urls){
				res.render('sites', { 
					"urlsList"	: urls,
					"pluginsList"	: plugins
				});
			});
		});
	});

	app.get('/site', function(req, res){
		// take the string with the urls and selected plugins (config)
		var urlString = req.query["url"];		
		
		async.parallel({
			scripts	: 	function(callback) {
				db.getScripts(urlString, callback);
			},
			events	: 	function(callback) {
				db.getEvents(urlString, callback);
			}
		}, function(err, results) {
			res.send(results);	
		})
	});
};


/***********************
 * Controller functions.
 */