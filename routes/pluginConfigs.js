/**
 * Module dependencies
 */
var db = require('../lib/dbManager');
var pluginManager = require ('../lib/pluginManager');

/*
 * Setup the routes and request handlers.
 */
module.exports = function(app){

	app.get('/plgconfigs', function(req, res){
		var pluginName = req.query['pluginName'];
		
		pluginManager.getNames(function(pluginNames){
			pluginManager.getInputView(pluginName, function(inputView){			
				db.getPluginConfigs(pluginName, function(pluginConfigs){
					res.render('pluginConfigs', {
						'pluginsList': pluginNames,
						'pluginName': pluginName,
						'pluginConfigs': pluginConfigs,
						'inputView': inputView
					});
				});
			});
		});
	});
	
	app.post('/plgconfigs/save', function(req, res){
		var pluginName = req.body.pluginName;
		var confName = req.body.confName;
		var confDescription = req.body.confDescription;
		var confConfig = req.body.confConfig;

		db.savePluginConfig(pluginName, confName, confDescription, confConfig, function(result) {
			console.log('New configuration added to database!');
			res.send('New configuration added to database!');
		});
	});
	
	app.post('/plgconfigs/del', function(req, res){
		// add new config to database
		var pluginName = req.body.pluginName;
		var confName = req.body.confName;

		db.deletePluginConfig(pluginName, confName, function(result) {
			console.log('Configuration deleted from database!');
			res.send('Configuration deleted from database!');
		});
	});
};


/***********************
 * Controller functions.
 */