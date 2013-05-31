var fs = require('fs');
var async = require('async');

var pluginManager = function() {
	//////////////////////////////////
	// Method executed on creation ///
	//////////////////////////////////
	
	// Initialise all plugins, i.e. create a 'view' for each of them
	fs.readdir('./plugins', function (err, pluginNames){
		if(err) { throw new Error('Error while reading plugin folder, none initialised!'); }
		
		async.map(pluginNames, _readPluginFiles, function (err, results){
			console.log(results);
			console.log('Plugins installed successfully!')
		});
		
	});

	//////////////////////
	// Private members ///
	//////////////////////
	
	/**
	 * Array with all plugins
	 */
	var _plugins = [];
	
	/**
	 * Reads and installs plugins
	 * @param  {string}   pluginName Name of the plugin
	 * @return {string}              Returns a string which indicates of the plugin was read
	 */
	var _readPluginFiles = function (pluginName, callback) {
		// skip hidden files in directory
		if (pluginName.indexOf(".") !== 0) {
			fs.readdir('./plugins/' + pluginName, function (err, files){
				// there are only 2 files in a directory of a plugin, and the 
				// file with perspective functions has to start with an underscore
				
				// read plugin code file
				var plugin = require('../plugins/' + pluginName + '/' + pluginName + '.js');
				
				plugin.id = _plugins.length + 1;
				plugin.pluginName = pluginName
				
				_plugins.push(plugin);
				callback(err, 'Installed ' + pluginName);
			});
		} else {
			var err = null;
			callback(err, 'Skip hidden file');
		}
	};

	/////////////////////
	// Public members ///
	/////////////////////
	
	// passes to the callback an array with names of all plugins
	this.getNames = function (callback) {
		var pluginNames = _plugins.map(function(plugin) {
			return { 'id':plugin.id, 'pluginName':plugin.pluginName }
		});
		callback(pluginNames);
	};
	
	// Get the name of a plugin by giving it's ID
	this.getPluginName = function (pluginID) {
		// ID of a plugin corrsponds with the index in the array, except the index start from 0, and an ID starts from 1
		var pluginID = (pluginID - 1);
		var plugin = _plugins[pluginID];
		return plugin.pluginName;
	};

	// returns the json object with properties for input form
	this.getInputView = function (pluginName, callback) {
		for (var i = 0; i < _plugins.length; i++) {
			if(_plugins[i].pluginName === pluginName){
				callback(_plugins[i].getInputView());
				break;
			}
		}
	};
	
	this.startPlugin = function(pluginID, configName, siteUrl, callback) {
		// ID of a plugin corrsponds with the index in the array, except the index start from 0, and an ID starts from 1
		var pluginID = (pluginID - 1);
		var plugin = _plugins[pluginID];

		plugin.start(configName, siteUrl, function(err, result) {
			var error = null;
			if(err != null){
				error = 'Error while running plugin: ' + pluginName;
			}
			callback(error, result);
		});
	};

};


/**
 * Export the Plugin Manager 
 */
module.exports = new pluginManager();