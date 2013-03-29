var JSLintPlugin = function() {
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
											"value": "true"
										},
										{
											"title": "Test property 2",
											"type": "boolean",
											"value": "false"
										}
									]
					};
		callback(err, result);
	};

	// private members ------------------
	var _view = [
		{	"type": "text",
			"name": "indent",
			"description": "The number of spaces used for indentation (default is 4)."
		},
		{	"type": "text",
			"name": "maxlen",
			"description": "The maximum number of characters in a line."
		},
		{	"type": "text",
			"name": "maxerr",
			"description": "The maximum number of warnings reported. (default is 50)"
		},
		{	"type": "text",
			"name": "predef",
			"description": "An array of strings, the names of predefined global variables, or an object whose keys are global variable names, and whose values are booleans that determine if each variable is assignable. predef is used with the option object, but not with the /*jslint*/ directive. You can also use the var statement to declare global variables in a script file."
		},
		{	"type": "select",
			"name": "bitwise",
			"values": [ { "value": "default",
						  "description": "default" },
						{ "value": "true",
						  "description": "true" },
						{ "value": "false",
						  "description": "false" }
					  ],
			"description": " Tolerate bitwise operators. #true if bitwise operators should be allowed."
		},
		{	"type": "select",
			"name": "continue",
			"values": [ { "value": "default",
						  "description": "default" },
						{ "value": "true",
						  "description": "true" },
						{ "value": "false",
						  "description": "false" }
					  ],
			"description": "Tolerate 'continue'. #true if the 'continue' statement should be allowed."
		},
		{	"type": "select",
			"name": "debug",
			"values": [ { "value": "default",
						  "description": "default" },
						{ "value": "true",
						  "description": "true" },
						{ "value": "false",
						  "description": "false" }
					  ],
			"description": " Tolerate debugger statements. #true if debugger statements should be allowed. Set this option to #false before going into production."
		},
		{	"type": "select",
			"name": "eqeq",
			"values": [ { "value": "default",
						  "description": "default" },
						{ "value": "true",
						  "description": "true" },
						{ "value": "false",
						  "description": "false" }
					  ],
			"description": " Tolerate == and != operators. #true if the == and != operators should be tolerated."
		},
		{	"type": "select",
			"name": "es5",
			"values": [ { "value": "default",
						  "description": "default" },
						{ "value": "true",
						  "description": "true" },
						{ "value": "false",
						  "description": "false" }
					  ],
			"description": " Tolerate ES5 syntax. #true if ES5 syntax should be allowed. It is likely that programs using this option will produce syntax errors on ES3 systems."
		},
		{	"type": "select",
			"name": "evil",
			"values": [ { "value": "default",
						  "description": "default" },
						{ "value": "true",
						  "description": "true" },
						{ "value": "false",
						  "description": "false" }
					  ],
			"description": " Tolerate eval. #true if eval should be allowed."
		},
		{	"type": "select",
			"name": "forin",
			"values": [ { "value": "default",
						  "description": "default" },
						{ "value": "true",
						  "description": "true" },
						{ "value": "false",
						  "description": "false" }
					  ],
			"description": " Tolerate unfiltered for in. #true if unfiltered for in statements should be allowed."
		},
		{	"type": "select",
			"name": "newcap",
			"values": [ { "value": "default",
						  "description": "default" },
						{ "value": "true",
						  "description": "true" },
						{ "value": "false",
						  "description": "false" }
					  ],
			"description": " Tolerate uncapitalized constructors. #true if Initial Caps with constructor functions is optional."
		},
		{	"type": "select",
			"name": "nomen",
			"values": [ { "value": "default",
						  "description": "default" },
						{ "value": "true",
						  "description": "true" },
						{ "value": "false",
						  "description": "false" }
					  ],
			"description": " Tolerate dangling _ in identifiers. #true if names should not be checked for initial or trailing underbars."
		},
		{	"type": "select",
			"name": "plusplus",
			"values": [ { "value": "default",
						  "description": "default" },
						{ "value": "true",
						  "description": "true" },
						{ "value": "false",
						  "description": "false" }
					  ],
			"description": " Tolerate ++ and --. #true if ++ and -- should be allowed."
		},
		{	"type": "select",
			"name": "regexp",
			"values": [ { "value": "default",
						  "description": "default" },
						{ "value": "true",
						  "description": "true" },
						{ "value": "false",
						  "description": "false" }
					  ],
			"description": " Tolerate . and [^...]. in /RegExp/ ; Set to #true if . and [^...] should be allowed in RegExp literals. They match more material than might be expected, allowing attackers to confuse applications. These forms should not be used when validating in secure applications."
		},
		{	"type": "select",
			"name": "undef",
			"values": [ { "value": "default",
						  "description": "default" },
						{ "value": "true",
						  "description": "true" },
						{ "value": "false",
						  "description": "false" }
					  ],
			"description": " Tolerate misordered definitions. #true if variables and functions need not be declared before used. This is not available in strict mode."
		},
		{	"type": "select",
			"name": "unparam",
			"values": [ { "value": "default",
						  "description": "default" },
						{ "value": "true",
						  "description": "true" },
						{ "value": "false",
						  "description": "false" }
					  ],
			"description": " Tolerate unused parameters. #true if warnings should not be given for unused parameters."
		},
		{	"type": "select",
			"name": "sloppy",
			"values": [ { "value": "default",
						  "description": "default" },
						{ "value": "true",
						  "description": "true" },
						{ "value": "false",
						  "description": "false" }
					  ],
			"description": " Tolerate missing 'use strict' pragma. #true if the ES5 'use strict'; pragma is not required. Do not use this pragma unless you know what you are doing."
		},
		{	"type": "select",
			"name": "stupid",
			"values": [ { "value": "default",
						  "description": "default" },
						{ "value": "true",
						  "description": "true" },
						{ "value": "false",
						  "description": "false" }
					  ],
			"description": " Tolerate stupidity. #true if blocking ('...Sync') methods can be used."
		},
		{	"type": "select",
			"name": "sub",
			"values": [ { "value": "default",
						  "description": "default" },
						{ "value": "true",
						  "description": "true" },
						{ "value": "false",
						  "description": "false" }
					  ],
			"description": " Tolerate inefficient subscripting. #true if subscript notation may be used for expressions better expressed in dot notation."
		},
		{	"type": "select",
			"name": "todo",
			"values": [ { "value": "default",
						  "description": "default" },
						{ "value": "true",
						  "description": "true" },
						{ "value": "false",
						  "description": "false" }
					  ],
			"description": " Tolerate TODO comments. #true if comments starting with TODO should be allowed."
		},
		{	"type": "select",
			"name": "vars",
			"values": [ { "value": "default",
						  "description": "default" },
						{ "value": "true",
						  "description": "true" },
						{ "value": "false",
						  "description": "false" }
					  ],
			"description": " Tolerate many var statements per function. #true if multiple var statement per function should be allowed."
		},
		{	"type": "select",
			"name": "white",
			"values": [ { "value": "default",
						  "description": "default" },
						{ "value": "true",
						  "description": "true" },
						{ "value": "false",
						  "description": "false" }
					  ],
			"description": " Tolerate messy white space. #true if strict whitespace rules should be ignored."
		},
		{	"type": "select",
			"name": "css",
			"values": [ { "value": "default",
						  "description": "default" },
						{ "value": "true",
						  "description": "true" },
						{ "value": "false",
						  "description": "false" }
					  ],
			"description": " Tolerate CSS workarounds. #true if CSS workarounds should be tolerated."
		},
		{	"type": "select",
			"name": "on",
			"values": [ { "value": "default",
						  "description": "default" },
						{ "value": "true",
						  "description": "true" },
						{ "value": "false",
						  "description": "false" }
					  ],
			"description": " Tolerate HTML event handlers. #true if HTML event handlers should be allowed."
		},
		{	"type": "select",
			"name": "fragment",
			"values": [ { "value": "default",
						  "description": "default" },
						{ "value": "true",
						  "description": "true" },
						{ "value": "false",
						  "description": "false" }
					  ],
			"description": " Tolerate HTML fragments. #true if HTML fragments should be allowed."
		},
		{	"type": "select",
			"name": "passfail",
			"values": [ { "value": "default",
						  "description": "default" },
						{ "value": "true",
						  "description": "true" },
						{ "value": "false",
						  "description": "false" }
					  ],
			"description": " Stop on first error. #true if the scan should stop on first error."
		},
		{	"type": "select",
			"name": "browser",
			"values": [ { "value": "default",
						  "description": "default" },
						{ "value": "true",
						  "description": "true" },
						{ "value": "false",
						  "description": "false" }
					  ],
			"description": " Assume a browser. #true if the standard browser globals should be predefined."
		},
		{	"type": "select",
			"name": "devel",
			"values": [ { "value": "default",
						  "description": "default" },
						{ "value": "true",
						  "description": "true" },
						{ "value": "false",
						  "description": "false" }
					  ],
			"description": " Assume console, alert, ... ; #true if browser globals that are useful in development should be predefined."
		},
		{	"type": "select",
			"name": "node",
			"values": [ { "value": "default",
						  "description": "default" },
						{ "value": "true",
						  "description": "true" },
						{ "value": "false",
						  "description": "false" }
					  ],
			"description": " Assume Node.js, #true if Node.js globals should be predefined."
		},
		{	"type": "select",
			"name": "rhino",
			"values": [ { "value": "default",
						  "description": "default" },
						{ "value": "true",
						  "description": "true" },
						{ "value": "false",
						  "description": "false" }
					  ],
			"description": " Assume Rhino. #true if the Rhino environment globals should be predefined."
		},
		{	"type": "select",
			"name": "windows",
			"values": [ { "value": "default",
						  "description": "default" },
						{ "value": "true",
						  "description": "true" },
						{ "value": "false",
						  "description": "false" }
					  ],
			"description": " Assume Windows. #true if the Windows globals should be predefined."
		},
		{	"type": "select",
			"name": "safe",
			"values": [ { "value": "default",
						  "description": "default" },
						{ "value": "true",
						  "description": "true" },
						{ "value": "false",
						  "description": "false" }
					  ],
			"description": " Safe Subset. #true if the safe subset rules are enforced. These rules are used by ADsafe. It enforces the safe subset rules but not the widget structure rules. safe is used with the option object, but not with the /*jslint*/ directive. "
		},
		{	"type": "select",
			"name": "adsafe",
			"values": [ { "value": "default",
						  "description": "default" },
						{ "value": "true",
						  "description": "true" },
						{ "value": "false",
						  "description": "false" }
					  ],
			"description": " Varify ADsafe. #true if ADsafe rules should be enforced. See http://www.ADsafe.org/. adsafe is used with the option object, but not with the /*jslint*/ directive. "
		}
	];
};


/**
 * Export JSLintPlugin
 */
module.exports = new JSLintPlugin();