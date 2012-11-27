//////////////////////////////////////////////////////////////////////////
// Url Library                                                          //
//                                                                      //
// A little bit of sugar sugar for handling various operations on url's //
//////////////////////////////////////////////////////////////////////////

module.exports = {

	/**
	 * It is possible that the user gives a url without 'http://'
	 * this method makes the concatenation if needed.
	 * 
	 * @param {string} url of a web page
	 * @return {string} 'http://' + the given url
	 */
	addHttp : function(url) {
	  if(!this.startWithHttp(url)) {
	      url = "http://" + url;
	  }
	  return url;
	},

	/**
	 * It is possible that the user gives a url without 'http://'
	 * This function is a boolean function that checks is the given url starts with:
	 * 		http://
	 *   	https://
	 *    	ftp://
	 * @param  {string} url
	 * @return {boolean}
	 */
	startWithHttp : function(url) {
	  var pattern = /^((http|https|ftp):\/\/)/;
	  return pattern.test(url);
	},

	/**
	 * Makes concatenation of 2 or more links/url's. There are 4 possible cases to be handled:
	 * 		___/ + /___
	 * 		____ + /___
	 * 		___/ + ____
	 * 		____ + ____
	 * @input  {string}	undefined number of parameters
	 * @return {string} constructed url with only 1 slash for each concatenation
	 */
	concatenateLinks : function() {
	  var result = arguments[0];
	  for (var i = 1; i < arguments.length; i++) {
	    var argument = arguments[i];
	    
	    if(!result.charAt(result.length - 1) == '/')  result += '/';
	    if(!argument.charAt(0) == '/')  argument = argument.substring(1);
	    
	    result += argument;
	  }
	  return result;
	},


	/**
	 * Returns the last part of a URL (i.e. slash separated string)
	 * @param  {string} url 
	 * @return {string}
	 */
	getLast : function(url) {
		var splitted = url.split('/');
		return splitted[splitted.length - 1];
	}

};