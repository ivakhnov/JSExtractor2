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
		getScripts(res);
	});

};


/***********************
 * Controller functions.
 */

var getScripts = function(res){
		console.log('opgeslagen in sessie webpage: ' + res.locals.userUrl); 
		db.getScripts(res.locals.userUrl, function(scripts) {
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
			res.render('scripts', { all: scripts, 
									inplace: inplace, 
									sourceFiles: sourceFiles, 
									sourceFilesCrossDomain: sourceFilesCrossDomain });
		});
};
