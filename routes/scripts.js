/**
 * Module dependencies
 */
var db = require('../lib/dbManager');
var async = require('async');


/*
 * Setup the routes and request handlers.
 */
module.exports = function(app){
	
	app.get('/scripts', function(req, res){
		var userUrl = res.locals.userUrl;
		// Just make sure the user is always associated with the url of the webpage he wants to
		// analyse. If the user didn't pass through the home page and did not enter a url to analyse
		// there needs to be a redirect to the home page.
		if (!userUrl) { 
			return res.redirect('/'); 
		};
		getScripts(res, userUrl, function(results) {
			res.render('scripts', results)
		});
	});

};


/***********************
 * Controller functions.
 */

var getScripts = function(res, userUrl, callback){
	var userUrl = res.locals.userUrl;
	db.getScripts(userUrl, function(scripts) {
		var inplace = [];
		var sourceFiles = [];
		var sourceFilesCrossDomain = [];
		for(var i = 0; i < scripts.length; i++) {
			var script = scripts[i];
			switch (script.properties.type) {
				case 'inplace':
					inplace.push(script);
					break;
				case 'file_nonCrossDomain':
					sourceFiles.push(script);
					break;
				case 'file_crossDomain':
					sourceFilesCrossDomain.push(script);
					break;
			};
		};
		callback ({ all: scripts,
					inplace: inplace, 
					sourceFiles: sourceFiles, 
					sourceFilesCrossDomain: sourceFilesCrossDomain });
	});
};
