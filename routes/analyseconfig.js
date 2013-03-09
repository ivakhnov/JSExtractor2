/**
 * Module dependencies
 */

/*
 * Setup the routes and request handlers.
 */
module.exports = function(app){
	var json = { toolsList: [
		{"id":1, "toolName":"JSLint"},
		{"id":2, "toolName":"JShint"},
		{"id":3, "toolName":"WALA"},
		{"id":4, "toolName":"DoctorJS"},
		{"id":5, "toolName":"JSAnalyse"}
	]};

	app.get('/analyseconfig', function(req, res){
		res.render('analyseconfig', json);
	});

};


/***********************
 * Controller functions.
 */

