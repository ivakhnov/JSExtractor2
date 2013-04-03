var fs = require('fs');
var async = require('async');

var pluginManager = function() {
	// method executed on creation

	// initialise all plugins, i.e. create a 'view' for each of them
	fs.readdir('./plugins', function(err, files){
		if(err) { throw new Error('Error while reading plugin folder, none initialised!'); }

		for (var i in files) {
			var file = files[i];
			
			var fileName = file.substring(0, file.length - 3);
			var plugin = require('../plugins/' + fileName);
			
			plugin.id = _plugins.length + 1;
			plugin.pluginName = fileName
			
			_plugins.push(plugin);
		}
	});

	// private members ------------------
	var _plugins = [];

	// public members --------------------
	
	// passes to the callback an array with names of all plugins
	this.getNamesJson = function(callback) {
		var pluginNames = _plugins.map(function(plugin) {
			return { 'id':plugin.id, 'pluginName':plugin.pluginName }
		});
		callback({ 'pluginsList': pluginNames });
	};

	// returns the json object with properties for input form
	this.getInputView = function(pluginName, callback) {
		for (var i = 0; i < _plugins.length; i++) {
			if(_plugins[i].pluginName === pluginName){
				callback(_plugins[i].getInputView());
				break;
			}
		}
	};

	// returns json with properties (format) of the output (needed for searching
	// based on plugin output)
	this.getOutputFormat = function(pluginName, callback) {
		for (var i = 0; i < _plugins.length; i++) {
			if(_plugins[i].pluginName === pluginName){
				callback(_plugins[i].getOutputFormat());
				break;
			}
		}
	};
	
	this.startPlugin = function(pluginID, configJson, sites, callback) {
		// ID of a plugin corrsponds with the index in the array, except the index start from 0, and an ID starts from 1
		var pluginID = (pluginID - 1);
		var plugin = _plugins[pluginID];
		
		function analyseSite(site, callback){
			plugin.start(configJson, site, function(err, result) {
				var error = null;
				if(err != null){
					error = 'Error while running plugin: ' + pluginName;
				}
				callback(error, result);
			});
		};
		
		async.mapSeries(sites, analyseSite, function(err, results){
			callback(err, { 
				'pluginName': plugin.pluginName,
				'output': results
			});
		});
	};

};


/**
 * Export the Plugin Manager 
 */
module.exports = new pluginManager();