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
	
	db.getScripts(userUrl, function(err, scripts) {
		if(err) {
			console.log('ter hoogte van de scripts.js ging er iets verkeerd');
			console.log(err);
			//res.render('error');
		} else {
			callback ({ all: scripts.all,
						inplace: scripts.inplace, 
						sourceFiles: scripts.sourceFiles, 
						sourceFilesCrossDomain: scripts.sourceFilesCrossDomain });
		};
	});
};
