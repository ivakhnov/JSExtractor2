/**
 * Module dependencies
 */
var fs = require('fs');
var Showdown = require('showdown');
var pluginManager = require ('../lib/pluginManager');

/*
 * Setup the routes and request handlers.
 */
module.exports = function(app){

	app.get('/plgman', function(req, res){
		var pluginName = req.query['pluginName'];
		
		pluginManager.getNames(function(pluginsList){
			
			fs.readFile('./plugins/' + pluginName + '/README.md', 'utf8', function (err, data) {
				// redirect to error page!
				if (err) { throw err; }
				
				var converter = new Showdown.converter();
				var pluginMan = converter.makeHtml(data);
				
				res.render('pluginMan', { 
					'pluginName'	: pluginName,
					'pluginsList'	: pluginsList,
					'pluginMan'		: pluginMan
				});
			});
		});
	});
};


/***********************
 * Controller functions.
 */