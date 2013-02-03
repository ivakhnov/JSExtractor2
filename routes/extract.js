/**
 * Module dependencies
 */
var urlLib = require('../lib/urlLib');
var db = require('../lib/dbManager');
var extractor = require('../lib/extractor');





/**
 * Setup the routes and request handlers.
 */
module.exports = function(app){

    app.post('/extract', function(req, res){
    	var url = req.body.url;
    	// It is possible that the user gives a url without 'http://'
		urlHttp = urlLib.addHttp(url);
		// Store the session for that user and use the url as identifier.
		req.session.userUrl = url;
    	extractor.parsePage(urlHttp, function(results) {
    		req.session.scriptsCount = results.scripts.length;
			req.session.eventsCount = results.events.length;
    		

			var scripts = results.scripts;
			var events = results.events;
			var frameworks = results.frameworks;

    		console.log("Script tags: " + scripts.length);
			console.log("DOM Events: " + events.length);
			console.log("Frameworks: " + frameworks.length);
			
			//db.resetDb();	
			db.savePage(url, scripts, events, frameworks, function(err, reply) {
				if(err) {
					console.log('Catched an error in extractor.js');
					console.log(err);
					//res.render('error');
				} else {
					res.redirect('/scripts');
				}
			});    		
    	});
    });

};
