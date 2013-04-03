var redis = require('redis');
var async = require('async');



var DbManager = function() {
	
// COMMENTS INCONSISTENT WITH REAL REPRESENTATION!!!!!!!!!!!!!

///////////////////////////////////////////////////////////////////////////////////////
// JSON Structures                                                                   //
///////////////////////////////////////////////////////////////////////////////////////
//                                                                                   //
// --> JSON structure of a script:                                                   //
//  {                                                                                //
//  'code': code,                                                                    //
//  'properties': {                                                                  //
//      'type': type,                                                                //
//      'location': location                                                         //
//      }                                                                            //
//  }                                                                                //
//                                                                                   //
//                                                                                   //
//  --> JSON structure of an event:                                                  //
//  {                                                                                //
//  'nodeName': nodeName,                                                            //
//  'listeners': {                                                                   //
//      'type': type,                                                                //
//      'func': func,                                                                //
//      'source': source                                                             //
//      }                                                                            //
//  }                                                                                //
//                                                                                   //
//                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////
// PAGES                                                                             //
///////////////////////////////////////////////////////////////////////////////////////
//  -- formal:                  [key] - {datatype}                                   //
//  -- formal structure:        {value, ... , value}                                 //
//                                                                                   //
//  -- concrete:                [pages] - {SET}                                      //
//  -- concrete structure:      {string, ... , string}                               //
//                                                                                   //
//  -- example:                 {"http://site1", "http://site2"}                     //
//                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////
// PAGE                                                                              //
///////////////////////////////////////////////////////////////////////////////////////
//  -- formal:                  [key] - {datatype}                                   //
//  -- formal structure:        {field -> value, ..., field -> value}                //
//                                                                                   //
//  -- concrete:                [page:*pageUrl*] - {HASH}                            //
//  -- concrete structure:      {[scripts:*id*] –> {string/json},                    //
//                               [scripts:count]-> {integer},                        //
//                               [events:*id*]  -> {string/json}                     //
//                               [events:count] -> {integer}}                        //
//                                                                                   //
//  -- example:                 {[scripts:1]    -> <see JSON structure of a script>, //
//                                  ... ,                                            //
//                               [scripts:9999] -> <see JSON structure of a script>, //
//                               [scripts:count]-> 9999 (= number of stored scripts),//
//                               [events:1]     -> <see JSON structure of an event>, //
//                                  ... ,                                            //
//                               [events:9999]  -> <see JSON structure of an event>},//
//                               [events:count] -> 9999 (= number of stored events)  //
///////////////////////////////////////////////////////////////////////////////////////
	
	
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
					callback(err);
				});
			};
		});
	};
	
	this.saveAnalyse = function(pageUrl, pluginName, analyseResults, callback) {
		var err = null;

		console.log("opslaan van pageUrl: " + pageUrl);
		console.log("opslaan van pluginName: " + pluginName);
		console.log("opslaan van analyseResults: " + analyseResults);
		callback(err, "OKEEEEE");
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

};


/**
 * Export the Database Manager 
 */
module.exports = new DbManager();