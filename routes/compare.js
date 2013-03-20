/**
 * Module dependencies
 */
var db = require('../lib/dbManager');
//var db__ = require('../lib/DT_server_side');


/*
 * Setup the routes and request handlers.
 */
module.exports = function(app){
	
	app.get('/compare', function(req, res){
		//var userUrl = res.locals.userUrl;
		var userUrl = 'http://webmail.ulb.ac.be';
		// Just make sure the user is always associated with the url of the webpage he wants to
		// analyse. If the user didn't pass through the home page and did not enter a url to analyse
		// there needs to be a redirect to the home page.
		if (!userUrl) { 
			return res.redirect('/'); 
		};
		getData(res, userUrl, function(results) {
			res.render('compare', results)
		});
	});


	// For AJAX calls from DataTables
	app.get('/compare/table', function(req, res){
		//var userUrl = res.locals.userUrl;
		//var userUrl = 'http://webmail.ulb.ac.be';
		// Just make sure the user is always associated with the url of the webpage he wants to
		// analyse. If the user didn't pass through the home page and did not enter a url to analyse
		// there needs to be a redirect to the home page.
		// if (!userUrl) { 
		// 	return res.redirect('/'); 
		// };
		console.log('TEEEEST');
		//console.log(req.query);
//		db__.process(req.query);
	});

};


/***********************
 * Controller functions.
 */

var getData = function(res, userUrl, callback){
	// db.getEvents(userUrl, function(err, events) {
	// 	if(err) {
	// 		console.log('ter hoogte van de events.js ging er iets verkeerd');
	// 		console.log(err);
	// 		//res.render('error');
	// 	} else {
	// 		callback ({ all: events });
	// 	};
	// });
	
	callback ({ userPage: 'events',
				otherPages: 'pages' });
};
