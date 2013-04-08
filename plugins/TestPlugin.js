var TestPlugin = function() {
	// method executed on creation, normaly none

	// public members --------------------
	this.getInputView = function(){
		return _inputView;
	};

	this.getOutputFormat = function(){
		return _outputFormat;
	}
	
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
											"type": "barchart",
											"value": {
												"labels" : ["January","February","March","April","May","June","July"],
												"datasets" : [
													{
														"fillColor" : "rgba(120,120,120,0.5)",
														"strokeColor" : "rgba(120,120,120,1)",
														"data" : [65,59,90,81,56,55,40]
													},
													{
														"fillColor" : "rgba(151,187,205,0.5)",
														"strokeColor" : "rgba(151,187,205,1)",
														"data" : [28,48,40,19,96,27,100]
													}
												]
											}
										},
										{
											"title": "Test property 3",
											"type": "boolean",
											"value": "true"
										}
									]
					};
		callback(err, result);
	};
	
	// private members ------------------
	var _outputFormat = [
		{
			"title": "Test property 1",
			"type": "boolean"
		},
		{
			"title": "Test property 2",
			"type": "boolean"
		}
	];

	var _inputView = [
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