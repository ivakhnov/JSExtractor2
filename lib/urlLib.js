/**
 * It is possible that the user gives a url without 'http://'
 * this method makes the concatenation if needed.
 * 
 * @param {string} url of a web page
 */
function addHttp(url) {
  if(!startWithHttp(url)) {
      url = "http://" + url;
  }
  return url;
};
module.exports.addHttp = addHttp;


function startWithHttp(url) {
  var pattern = /^((http|https|ftp):\/\/)/;
  return pattern.test(url);
};
module.exports.startWithHttp = startWithHttp;


function concatenateLinks() {
  var result = arguments[0];
  for (var i = 1; i < arguments.length; i++) {
    var argument = arguments[i];
    //       ***/ + /***
    //       **** + /***
    //       ***/ + ****
    //       **** + ****
    if(!result.charAt(result.length - 1) == '/')  result += '/';
    if(!argument.charAt(0) == '/')  argument = argument.substring(1);
    
    result += argument;
  }
  return result;
};
module.exports.concatenateLinks = concatenateLinks;


/**
 * Returns the last part of a URL (i.e. slash separated string)
 * @param  {string} url 
 * @return {string}
 */
function getLast(url) {
	var splitted = url.split('/');
	return splitted[splitted.length - 1];
};
module.exports.getLast = getLast;