/**
 * Module dependencies
 */
var db = require('../lib/dbManager');
var async = require('async');


/*
 * Setup the routes and request handlers.
 */
module.exports = function(app){
	
	app.get('/events', function(req, res){
		var userUrl = res.locals.userUrl;
		// Just make sure the user is always associated with the url of the webpage he wants to
		// analyse. If the user didn't pass through the home page and did not enter a url to analyse
		// there needs to be a redirect to the home page.
		if (!userUrl) { 
			return res.redirect('/'); 
		};
		getEvents(res, userUrl, function(results) {
			res.render('events', results)
		});
	});

};


/***********************
 * Controller functions.
 */

var getEvents = function(res, userUrl, callback){
	var userUrl = res.locals.userUrl;
	db.getEvents(userUrl, function(events) {
		callback ({ all: events });
	});
};
