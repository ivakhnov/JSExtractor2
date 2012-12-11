
/*
 * Setup the routes and request handlers.
 */
module.exports = function(app){

    app.get('/', function(req, res){
    	index(res);
    });

    //other routes..
};


/***********************
 * Controller functions.
 */

/**
 * Show the page where user can give the url to extract JS code.
 * @param  {object} res Is the respond object from the request handler.
 */
var index = function(res){
  res.render('index');
};
