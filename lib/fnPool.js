

var fnPool = function() {
	//////////////////////
	// Private members ///
	//////////////////////
	
	/**
	 * Object with all the functions
	 */
	var _functions = {};
	
	/**
	 * Counter of how many times a new function has been added,
	 * used to give new functions a new ID
	 */
	var _currID = 0;
	
	/**
	 * Function to increment the id counter. Returns the new id.
	 */
	var createID = function (callback) {
		_currID++;
		callback(_currID);
	};

	/////////////////////
	// Public members ///
	/////////////////////
	
	/**
	 * Adds the function to the pool and  returns the ID of it.
	 */
	this.addFn = function (fn, callback) {
		createID(function (id) {
			_functions[id] = fn;
			callback(id);
		})
	};
	
	/**
	 * Accessor to functions in the pool
	 */
	this.getFn = function (fnID, callback) {
		callback(_functions[fnID]);
	};
};


/**
 * Export function pool
 */
module.exports = new fnPool();