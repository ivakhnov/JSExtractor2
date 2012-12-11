/*
 * Setup the routes and request handlers.
 */
module.exports = function(app){

    app.get('/scripts', function(req, res){
    	scripts(res);
    });

    //other routes..
};


/***********************
 * Controller functions.
 */


var scripts = function(res){
  res.render('scripts');
};
