var View = function(viewJson) {
	// method executed on creation, normaly none
	console.log('viewJson: ' + viewJson);

	// private members ------------------
	var html = "<form>Query: <input type='password' name='pwd'></form><form><input type='checkbox' name='vehicle' value='Bike'>Scripts<br><input type='checkbox' name='vehicle' value='Car'>Events</form>"


	// public members --------------------
	this.getHtml = function(){
		return html;
	}
};


/**
 * Export View
 */
module.exports = View;