var fs = require('fs');
var view = require('./view');

var pluginManager = function() {
	// method executed on creation

	// initialise all plugins, i.e. create a 'view' for each of them
	fs.readdir('./plugins', function(err, files){
		if(err) { throw new Error('Error while reading plugin folder, none initialised!'); }

		for (var i in files) {
			var file = files[i];
			// each file ends with '.js'
			fileName = file.substring(0, file.length - 3)
			_pluginNames.push(fileName);
			
			console.log('name: ' + fileName);

			// fs.readFile('./plugins/' + fileName, function(err, data){
			// 	_plugins.push(data);
			// 	console.log('teest: ' + data);

			// 	// create new View object based on the user definition of the needed view
			// 	var pView = view(data.viewJson);
			// 	_pluginViews.push(pView);
			// });
			var plugin = require('../plugins/' + fileName);
			_plugins.push(plugin);
			console.log('plugin: ' + plugin);

			// create new View object based on the user definition of the needed view
			var pView = view(plugin.viewJson());
			_pluginViews.push(pView);
		}
	});

	// private members ------------------
	var _pluginNames = [];
	var _plugins = [];
	var _pluginViews = [];

	// public members --------------------
	
	// passes to the callback an array with names of all plugins
	this.getNamesAll = function(callback) {
		callback(_pluginNames);
	};

	// returns the html of a particular plugin
	this.getHtml = function(pluginName, callback) {
		var index = _pluginNames.indexOf(pluginName);
		callback(_pluginViews[index].getHtml());
	}

};


/**
 * Export the Plugin Manager 
 */
module.exports = new pluginManager();