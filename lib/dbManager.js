var redis = require('redis');
var async = require('async');


var DbManager = {
    
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
    
    /**
     * Saves all information about a web page (i.e. the url, extracted code between <script> tags and 
     * extracted event handlers).
     * @param  {string} pageUrl The url of the evaluated web page.
     * @param  {array} scripts Array of JSON objects of the extracted JavaScript code between <script> tags.
     * @param  {array} events  Array of JSON objects of the extracted event handlers.
     * @return {void}         No return value.
     */
    savePage : function(pageUrl, scripts, events) {
        this.prototype._client(function(client) {
            client.sadd('pages', pageUrl, function(err, reply) {
                // Method sadd returns number of added records. It returns 0 if no any 
                // record has been inserted (if the given url is already stored in database)
                if(reply == 0) {
                    return;
                } else {
                    // store each individual script
                    for (var id = 0; id < scripts.length; id++) {
                        scriptJsonObj = scripts[id];
                        // (id+1) because the counter starts at 0, but an id cannot be zero
                        client.hmset('page:'+pageUrl, 'scripts:'+(id+1), JSON.stringify(scriptJsonObj));
                    };
                    // ans finally store the amount of scripts for that page
                    client.hmset('page:'+pageUrl, 'scripts:count', scripts.length);
                    
                    for (var id = 0; id < events.length; id++) {
                        eventJsonObj = events[id];
                        client.hmset('page:'+pageUrl, 'events:'+(id+1), JSON.stringify(eventJsonObj));
                    };
                    client.hmset('page:'+pageUrl, 'events:count', events.length);
                };
                
                // testing results
                
                client.smembers('pages', function (err, x) { 
                    console.log("----- pages: ");
                    console.log(x);
                });
                
                client.hget('page:'+pageUrl, 'scripts:count', function (err, x) { 
                    console.log("----- scripts count: ");
                    console.log(x);
                });
                
                client.hget('page:'+pageUrl, 'scripts:1', function (err, x) { 
                    console.log("----- script number 1: ");
                    console.log(x);
                });
                
                client.hget('page:'+pageUrl, 'events:count', function (err, x) { 
                    console.log("----- events count: ");
                    console.log(x);
                });
                
                client.hget('page:'+pageUrl, 'events:1', function (err, x) { 
                    console.log("----- event number 1: ");
                    console.log(x);
                });
                
            });
        });
    }, 
        
    /**
     * Delete all the entries in the database
     * @return {void} No return value
     */
    resetDb : function() {
        this.prototype._client(function(client) {
                console.log("Reset database ...");
                client.flushdb();
        });
    }
};

/**
 * Private functions are in the prototype
 */
DbManager.prototype = {
    _client : function(callback) {
        var client = redis.createClient();
        client.on('error', function(err) {
            console.log('Could not connect to database!' + '\n' + err);
        });
        client.on('connect', function() {
            async.series([
                function(){ callback(client); },
                function(){ client.quit(); }
            ]);
        });
    }
};

/**
 * Export the Database Manager 
 */
module.exports = DbManager;