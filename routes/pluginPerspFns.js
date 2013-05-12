/**
 * Module dependencies
 */
var db = require('../lib/dbManager');
var fnPool = require('../lib/fnPool');
var pluginManager = require ('../lib/pluginManager');

/*
 * Setup the routes and request handlers.
 */
module.exports = function(app){

	app.get('/plgPerspFns', function (req, res){
		var pluginName = req.query['pluginName'];
		
		pluginManager.getNames(function (pluginsList){
			db.getPluginPerspFns(pluginName, function (pluginPerspFns){
				res.render('pluginPerspFns', {
					'pluginsList'		: pluginsList,
					'pluginName'		: pluginName,
					'pluginPerspFns'	: pluginPerspFns
				});
			});
		});
	});
	
	app.post('/plgPerspFns/save', function(req, res){
		var pluginName = req.body.pluginName;
		var perspName = req.body.perspName;
		var perspDescription = req.body.perspDescription;
		var fnString = req.body.perspFn;

		fn = eval(fnString);
		fnPool.addFn(fn, function (fnID) {
			db.savePluginPersp(pluginName, perspName, perspDescription, fnID, function (result) {
				console.log('New perspective function added to database!');
				res.send('New perspective function added to database!');
			});
		});
	});
	
	app.post('/plgPerspFns/del', function(req, res){
		var pluginName = req.body.pluginName;
		var perspName = req.body.perspName;

		db.deletePluginPerspFn(pluginName, perspName, function(result) {
			console.log('Perspective function deleted from database!');
			res.send('Perspective function deleted from database!');
		});
	});
};


/***********************
 * Controller functions.
 */