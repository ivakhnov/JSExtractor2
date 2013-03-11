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
			_addPluginName(fileName);
			
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
			var pView = new view(plugin.viewJson());
			_pluginViews.push(pView);
		}
	});

	// private members ------------------
	var _pluginNames = [];
	var _plugins = [];
	var _pluginViews = [];

	// _pluginNames should be of the following form:
	// {"id":[integer], "toolName":[string]},
	var _addPluginName = function(pluginName) {
		var id = _pluginNames.length + 1;
		_pluginNames.push({
			'id':id, 'toolName':pluginName
		});
	};

	// public members --------------------
	
	// passes to the callback an array with names of all plugins
	this.getNamesJson = function(callback) {
		callback({ toolsList: _pluginNames });
	};

	// returns the html of a particular plugin
	this.getHtml = function(pluginName, callback) {
		console.log('_pluginViews: ' + _pluginViews);
		console.log('_pluginNames: ' + _pluginNames);
		console.log('_plugins: ' + _plugins);

		for (var i = 0; i < _pluginNames.length; i++) {
			if(_pluginNames[i].toolName === pluginName){
				callback(_pluginViews[i].getHtml());
				break;
			}
		}
	}

};


/**
 * Export the Plugin Manager 
 */
module.exports = new pluginManager();