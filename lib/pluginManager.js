var fs = require('fs');
var view = require('./view');

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
			plugin.toolName = fileName
			plugin.html = view.jsonToHtml(plugin.viewConstr());
			
			_plugins.push(plugin);
		}
	});

	// private members ------------------
	var _plugins = [];

	// public members --------------------
	
	// passes to the callback an array with names of all plugins
	this.getNamesJson = function(callback) {
		var pluginNames = _plugins.map(function(plugin) {
			return { 'id':plugin.id, 'toolName':plugin.toolName }
		});
		callback({ toolsList:pluginNames });
	};

	// returns the html of a particular plugin
	this.getHtml = function(pluginName, callback) {
		for (var i = 0; i < _plugins.length; i++) {
			if(_plugins[i].toolName === pluginName){
				// console.log('getHtml: ' + JSON.stringify(_plugins[i]));
				callback(_plugins[i].html);
				break;
			}
		}
	};
	
	this.formToJson = function(toolID, formString, sites) {
		var configJson = view.formToJson(formString);
		// ID of a plugin corrsponds with the index in the array, except the index start from 0, and an ID starts from 1
		toolID = (toolID - 1);
		_plugins[toolID].start(configJson);
	};

};


/**
 * Export the Plugin Manager 
 */
module.exports = new pluginManager();