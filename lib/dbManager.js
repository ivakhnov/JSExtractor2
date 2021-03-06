var redis = require('redis');
var async = require('async');



var DbManager = function() {
	
	this.savePage = function(pageUrl, scripts, events, callback) {
		_client.sadd('pageList', pageUrl, function(err, addedCount) {
			if(err) { callback(err); } 
			else if(addedCount == 0) { callback(null); }
			else { 
				async.parallel([
					function(callback){
						_saveScripts(pageUrl, scripts, callback);
					},
					function(callback){
						_saveEvents(pageUrl, events, callback);
					}
				],
				// callback when all the parallel tasks are done
				function(err, results){
					console.log(results);
					callback(err);
				});
			};
		});
	};
	
	this.saveAnalyse = function(pageUrl, pluginName, pluginConfig, analyseResults, callback) {
		var err = null;

		_client.HSET('pluginOutput:'+pluginName, 
			pageUrl, JSON.stringify({ 
				"pluginConfig" 		: pluginConfig,
				"analyseResults" 	: analyseResults
			}),
			callback);
	};
	
	this.getAnalysis = function(pageUrl, pluginName, callback) {
		_client.HGET('pluginOutput:'+pluginName, pageUrl, function (err, results) {
			// return the real opbject, not the string from database
			callback(err, JSON.parse(results));
		});
	};
	
	// Each plugin can be configured for an analysis. Those configurations can be stored to be reused
	this.savePluginConfig = function(pluginName, confName, confDescription, confConfig, callback) {
		_getPluginID(pluginName, function(pluginID) {
			var err = null;
			_client.zadd('pluginConfigs:'+pluginID, 0, confName,
					function (res) {
				if (res == 0) {
					callback(res);
				} else {
					_client.SET('pluginConfig:'+confName, JSON.stringify({
							'confDescription' : confDescription,
							'config' : JSON.stringify(confConfig) 
						}), function (res) {
							callback(err);
					});
				};
			});
		});
	};
	
	/**
	 * Returns an array of JSON objects with names of available plugin configurations and descriptions for those configs
	 * @return {Object}            Object containing configuration, name and description
	 */
	this.getPluginConfigs = function(pluginName, callback) {
		_client.HGET('plugins', pluginName, function (err, pluginID) {
			if (pluginID == null) { callback([]); }
			else {
				_client.ZRANGE('pluginConfigs:'+pluginID, 0, -1, function (err, confNames) {
					console.log('confnames: ' + confNames);
					async.map(confNames, getConfDescription, function (err, results) {
						callback(results);
					});
				});
			};
		});
	};
	
	/**
	 * Returns the object with name of the configuration and the description of it.
	 * @param  {string}   confName  Name/title of the configuration
	 * @return {Object}             Object containing the name and the description
	 */
	var getConfDescription = function (confName, callback) {
		_client.GET('pluginConfig:'+confName, function (err, config) {
			var conf = JSON.parse(config);
			callback (err, {
				'confName' : confName,
				'confDescription' : conf.confDescription
			});
		});
	};
	
	/**
	 * Removes a configuration from database
	 * @param  {string}   pluginName Name of the plugin related to the configuration
	 * @param  {string}   confName   Name/title of the configuration to be deleted
	 * @return {string}              String 'Deleted!'
	 */
	this.deletePluginConfig = function (pluginName, confName, callback) {
		_getPluginID(pluginName, function(pluginID) {
			var err = null;
			_client.DEL('pluginConfig:'+confName, function (err, res) {
				_client.ZREM('pluginConfigs:'+pluginID, confName, function (err, res) {
					callback('Deleted!');
				});
			});
		});
	};

	/**
	 * Returns the configurations (string) of a plugin
	 * @return {string}              String that describes the plugin configuration
	 */
	this.getPluginConfig = function(configName, callback) {
		_client.GET('pluginConfig:'+configName, function (err, config) {
			var conf = JSON.parse(config);
			callback (err, conf.config);
		});
	};
	
	/**
	 * Saves a perspective function for a plugin, with its title, description and ID
	 * to find it bacj in the functions pool.
	 * @param  {string}   pluginName       For wich plugin is this perspective function.
	 * @param  {string}   perspName        Title of the perspective function.
	 * @param  {string}   perspDescription Description the user gave to his function.
	 * @param  {integer}  fnID             The ID to find this function in de function pool, obvious the functions itself 
	 * is not stored in hte database.
	 * @return {integer}                   The return value is the error of the seving procedure (0 or the actua error)
	 */
	this.savePluginPersp = function(pluginName, perspName, perspDescription, fnID, callback) {
		_getPluginID(pluginName, function(pluginID) {
			var err = null;
			_client.zadd('pluginPerspectives:'+pluginID, 0, perspName,
					function (res) {
				if (res == 0) {
					callback(res);
				} else {
					_client.SET('pluginPerspective:'+perspName, JSON.stringify({
							'perspDescription' 	: perspDescription,
							'fnID' 				: fnID,
							'pluginName' 		: pluginName
						}), function (res) {
							callback(err);
					});
				};
			});
		});
	};
	
	/**
	 * Given the name of a perspective function, returns the name of the plugin to which it is related to
	 */
	this.getPluginOfPerspFn = function(perspName, callback) {
		_client.GET('pluginPerspective:'+perspName, function (err, res) {
			var persp = JSON.parse(res);
			callback(err, persp.pluginName);
		});
	};
	
	/**
	 * Return an array with names of all perspective functions for all plugins
	 */
	this.getAllPerspFnNames = function(callback) {
		_client.KEYS('pluginPerspective:*', function (err, dbKeys) {			
			for(var key in dbKeys) {
				dbKeys[key] = dbKeys[key].substr(18)
			}
			callback(err, dbKeys);
		});
	};
	
	/**
	 * Returns an array of JSON objects conataining names and descriptions for perspective functions for a plugin
	 * @return {Object}            Object containing configuration, name and description
	 */
	this.getPluginPerspFns = function(pluginName, callback) {
		_client.HGET('plugins', pluginName, function (err, pluginID) {
			if (pluginID == null) { callback([]); }
			else {
				_client.ZRANGE('pluginPerspectives:'+pluginID, 0, -1, function (err, perspNames) {
					console.log('perspnames: ' + perspNames);
					async.map(perspNames, getPerspDescription, function (err, results) {
						callback(results);
					});
				});
			};
		});
	};
	
	/**
	 * Get the ID of a perspective function by its name/title
	 * @param  {string}   perspName Name of the perspective function
	 * @return {integer}            The ID in the function pool
	 */
	this.getPerspID = function (perspName, callback) {
		_client.GET('pluginPerspective:'+perspName, function (err, perspective) {
			var persp = JSON.parse(perspective);
			callback (err, persp.fnID);
		});
	};
	
	/**
	 * Returns the object with name of the perspective function and the description of it.
	 * @param  {string}   perspName Name/title of the perspective function
	 * @return {Object}             Object containing the name and the description
	 */
	var getPerspDescription = function (perspName, callback) {
		_client.GET('pluginPerspective:'+perspName, function (err, perspective) {
			var persp = JSON.parse(perspective);
			callback (err, {
				'perspName' 		: perspName,
				'perspDescription' 	: persp.perspDescription,
				'fnID' 				: persp.fnID 
			});
		});
	};
	
	/**
	 * Removes a perspective function of a plugin
	 * @param  {string}   pluginName Name of the plugin related to the perspective function
	 * @param  {string}   perspName  Name/title of the function to be deleted
	 * @return {string}              String 'Deleted!'
	 */
	this.deletePluginPerspFn = function (pluginName, perspName, callback) {
		_getPluginID(pluginName, function(pluginID) {
			var err = null;
			_client.DEL('pluginPerspective:'+perspName, function (err, res) {
				_client.ZREM('pluginPerspectives:'+pluginID, perspName, function (err, res) {
					callback('Deleted!');
				});
			});
		});
	};
	
	// Returns all the saved urls in database
	this.getUrls = function(callback) {
		_client.SMEMBERS('pageList', callback);
	};
	
	this.getScripts = function(pageUrl, callback) {
		// get the amount of members
		_client.zcard('scripts:'+pageUrl, function(err, count) {
			if(err) { callback(err); }
			else {
				async.parallel({
					// get all scripts
					all : function(callback){
						_client.zrange('scripts:'+pageUrl, 0, -1, callback);
					},
					// get scripts that are inplace
					inplace : function(callback){
						_getScriptsByType(pageUrl, count, 'inplace', callback);
					},
					// get scripts that are from other file non cross domain
					sourceFiles : function(callback){
						_getScriptsByType(pageUrl, count, 'file_nonCrossDomain', callback);
					},
					// get scripts that are from other file that is on other domain
					sourceFilesCrossDomain : function(callback){
						_getScriptsByType(pageUrl, count, 'file_crossDomain', callback);
					},
				},
				// callback when all the parallel tasks are done
				function(err, results){
					callback(err, results);
				});
			}
		});
		
	};
	
	
	this.getEvents = function(pageUrl, callback) {
		_client.zrange('events:'+pageUrl, 0, -1, function(err, reply) {
			callback(err, reply);
		});
		
	};
	
	
	/**
	 * Delete all the entries in the database
	 * @return {void} No return value
	 */
	this.resetDb = function() {
		console.log("Reset database ...");
		_client.flushdb();
	};
	
	/////////////////////
	// private functions
	// //////////////////////////////////
	var _client = redis.createClient();
	_client.on('error', function(err) {
		console.log('Could not connect to database!' + '\n' + err);
	});
	//////////////////////////////////////////////////////////
	var scriptTypes = ['inplace', 'file_nonCrossDomain', 'file_crossDomain'];
	//////////////////////////////////////////////////////////
	var _saveScripts = function(pageUrl, scripts, callback) {
		var added_counter = 0;
		if(scripts.length == 0) { callback(null, 0); }
		else {
			for(var i=0; i<scripts.length; i++) {
				var script = scripts[i];
				var categoryNr = scriptTypes.indexOf(script.properties.type);
				var id = i + categoryNr * scripts.length;
				_client.zadd('scripts:'+pageUrl, id, JSON.stringify(script), function(err) {
					added_counter++;
					if(err) { callback(err); } 
					else if (added_counter == scripts.length) { 
						callback(null, added_counter); 
					};
				});
			}
		};
		
	};

	var _saveEvents = function(pageUrl, events, callback) {
		var added_counter = 0;
		if(events.length == 0) { callback(null, 0); }
		else {
			for(var i=0; i<events.length; i++) {
				_client.zadd('events:'+pageUrl, i, JSON.stringify(events[i]), function(err) {
					added_counter++;
					if(err) { callback(err); } 
					else if (added_counter == events.length) { 
						callback(null, added_counter); 
					};
				});
			}
		};
	};
	
	var _getScriptsByType = function(pageUrl, totalCount, scriptType, callback) {
		var typeNr = scriptTypes.indexOf(scriptType);
		var min = totalCount * typeNr;
		var max = totalCount * (typeNr + 1);
		_client.zrangebyscore('scripts:'+pageUrl, min, (max-1), function(err, reply) {
			callback(err, reply);
		});
	};
	
	// Returns the ID of plugin with the given name, or adds it to the hash with all names and returns new ID
	var _getPluginID = function(pluginName, callback) {
		_client.HEXISTS('plugins', pluginName, function(err, res) {
			if (res == 0) {
				_client.INCR('pluginID', function(err, id){
					_client.HSET('plugins', pluginName, id, function(err, res) {
						callback(id);
					});
				});
			} else {
				_client.HGET('plugins', pluginName, function(err, id) {
					callback(id);
				});
			}
		});
	};

};


/**
 * Export the Database Manager 
 */
module.exports = new DbManager();