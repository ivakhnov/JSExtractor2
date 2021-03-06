var fs = require('fs');
var db = require('./dbManager');
var async = require('async');
var stdPersp = require('./standardPerspectives');
var fnPool = require('./fnPool');

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
	
	var addPerspectiveFns = function (pluginName, callback) {
	var err = null;
	function loopFun (persp, callback) {
		var perspName = persp.perspName;
		var perspDescription = persp.description;
		var fnString = persp.fn;
				
		var fn = stdPersp[fnString];
		fnPool.addFn(fn, function (fnID) {
			db.savePluginPersp(pluginName, pluginName+": "+perspName, perspDescription, fnID, function (res) {
				console.log('Added perspective function "' + perspName + '" with id='+ fnID +' for plugin "' + pluginName);
				callback(res);
			});
		});
	};
	
	async.mapSeries(stdPersp.perspFns, 
		loopFun,
		function(res) {
			var message = 'OK - saving standard perspective functions '+pluginName+'!';
			console.log(message);
			callback(err, message);
	});
};
	
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
				addPerspectiveFns(pluginName, function(err, res) {
					callback(err, 'Installed ' + pluginName);
				});
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
		
		async.waterfall([
			function(callback){
				db.getScripts(siteUrl, callback);
			},
			function(scripts, callback){
				// The plugin or the tool which it controls may crash, but it shouldn't
				// take down the whole application.
				var error = null;
				var results = null;
				try {
					plugin.start(configName, scripts.all, function(err, res) {
						error = err;
						results = res;
					});
				} catch (e) {
					error = e;
				} finally {
					callback(error, results);
					
				};
			}
		], function (err, result) {
			var error = null;
			if(err != null){
				error = 'Error while running plugin: ' + _plugins[pluginID].pluginName;
				console.log(error);
				console.log(err);
			}
			callback(error, result);   
		});
	};

};


/**
 * Export the Plugin Manager 
 */
module.exports = new pluginManager();