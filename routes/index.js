/**
 * Module dependencies
 */
var pluginManager = require ('../lib/pluginManager');

/*
 * Setup the routes and request handlers.
 */
module.exports = function(app){

    app.get('/', function(req, res){
    	pluginManager.getNamesJson(function(json){
			console.log(json);
			res.render('index', json);
		});
    });
};


/***********************
 * Controller functions.
 */