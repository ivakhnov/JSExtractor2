/**
 * Module dependencies
 */

/*
 * Setup the routes and request handlers.
 */
module.exports = function(app){
	app.post('/analyseresults', function(req, res){
		var config = JSON.parse(req.body.config);
		console.log('aantal tools actief in analyse: ' + config.length);

		for(var i = 0; i < config.length; i++) {
			console.log('config in POST - id: ' + config[i].toolID);
			console.log('config in POST - con: ' + config[i].config);
		};
		res.render('index');
	});

};


/***********************
 * Controller functions.
 */

