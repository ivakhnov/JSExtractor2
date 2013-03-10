var JSLintPlugin = function() {
	// method executed on creation, normaly none

	// private members ------------------
	var _view = [
		{	"type": "input",
			"varName": "userInput",
			"description": "This is just a silly dummy text for description, please fill in"
		},
		{	"type": "input",
			"varName": "userInput2",
			"description": "This is an other description for the user, please fill in"
		}
	];


	// public members --------------------
	this.viewJson = function(){
		return _view;
	}
};


/**
 * Export JSLintPlugin
 */
module.exports = new JSLintPlugin();

