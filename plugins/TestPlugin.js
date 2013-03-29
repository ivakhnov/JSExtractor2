var TestPlugin = function() {
	// method executed on creation, normaly none

	// public members --------------------
	this.getInputView = function(){
		return _view;
	};
	
	this.start = function(configJson, site, callback){
		var err = null;
		var result = {
						"siteName": site,
						"siteOutput": [
										{
											"title": "Test property 1",
											"type": "boolean",
											"value": "false"
										},
										{
											"title": "Test property 2",
											"type": "boolean",
											"value": "true"
										}
									]
					};
		callback(err, result);
	};
	
	// private members ------------------
	var _view = [
		{	"type": "text",
			"name": "userInput1",
			"description": "This is just a silly dummy text for description, please fill in: "
		},
		{	"type": "checkbox",
			"name": "userInput2",
			"values": [ { "value": "scripts",
						  "description": "The first checkbox for scripts" },
						{ "value": "events",
						  "description": "The second checkbox for events" }
					  ],
			"description": "This is an other description for the user, please check all the needed boxes: "
		},
		{	"type": "radio",
			"name": "userInput3",
			"values": [ { "value": "scripts",
						  "description": "The first radio for scripts" },
						{ "value": "events",
						  "description": "The second radio for events" }
					  ],
			"description": "Again a description, choose the right value: "
		},
		{	"type": "select",
			"name": "userInput4",
			"values": [ { "value": "default",
						  "description": "default" },
						{ "value": "true",
						  "description": "true" },
						{ "value": "false",
						  "description": "false" }
					  ],
			"description": " Again a description, choose the right value."
		}
	];
};


/**
 * Export TestPlugin
 */
module.exports = new TestPlugin();