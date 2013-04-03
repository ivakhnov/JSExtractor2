function View() {

	// public members --------------------

	// method to convert data from filled from to json
	this.formFilledToJson = function(formString) {
		var resultJson = {};
		var formArray = formString.split("&");
		for (var i = 0; i < formArray.length; i++) {
			var str = formArray[i];
			var name = str.substr(0, str.indexOf("="));
			var value = str.substr(str.indexOf("=") + 1);
			resultJson[name] = value;
		};
		return resultJson;
	};

	// method executed on creation, normaly none
	this.createForm = function(viewJsonsArray) {
		resultHtml = "<form>";
		for (var i = 0; i < viewJsonsArray.length; i++) {
			var view = viewJsonsArray[i];
			var result = "";

			switch(view.type) {
				case 'text':
					var description = view.description;
					var type = " <input type='" + view.type + "' class='input-xlarge'";
					var name = " name='" + view.name + "'>";
					result += description + "<br>" + type + name;
					break;
				// radio OR checkbox 
				case 'radio':
				case 'checkbox':
					var description = view.description;
					result += description + "<br>";
					for (var v = 0; v < view.values.length; v++) {
						var type = " <input type='" + view.type + "'";
						var name = " name='" + view.name + "'";
						var value = " value='" + view.values[v].value + "'>";
						var descr = view.values[v].description;
						result += type + name + value + descr + "<br>";
					}
					break;
				case 'select':
					var description = view.description;
					result += "<p><select name='" + view.name + "'>"
					for (var v = 0; v < view.values.length; v++) {
						var value = "<option value='" + view.values[v].value + "'>";
						var descr = view.values[v].description;
						result += value + descr + "</option>";
					}
					result += "</select>"+ description + "</p>";
					break;
			};
			resultHtml += result;
		};
		resultHtml += "</form>";
		return resultHtml;
	};
	
	// method to create html for the output of the analyse
	this.createOutput = function(siteOutputArray) {
		var resultHtml = "";
		for (var i = 0; i < siteOutputArray.length; i++) {
			var outputJson = siteOutputArray[i];
						
			resultHtml += "<h3>" + outputJson.title + "</h3>"
			switch(outputJson.type) {
				case 'boolean':
					var val = outputJson.value;
					var blockStyle = null;
					if (val == 'true') { 
						blockStyle = 'trueBlock'; 
					} else { 
						blockStyle = 'falseBlock'; 
					}
					resultHtml += "<div class='" + blockStyle + "'>" + val + "</div>";
					break;
			};
		}
		return resultHtml;
	};

	// creating table to search on plugin output
	this.createComparisonTable = function(outputFormatArray) {
		resultHtml = '<table class="table table-striped table-bordered comparisonTable">';
		resultHtml += '<thead><tr>';

		// the first column is always a list of sites, so add this first
		resultHtml += '<th>Sites</th>';
		for (var i = 0; i < outputFormatArray.length; i++) {
			var column = outputFormatArray[i];
			resultHtml += '<th>' + column.title + '</th>';
		};
		resultHtml += "</tr></thead><tbody>";
		return resultHtml;
	};


	// private members ------------------

};


/**
 * Export View
 */
//module.exports = new View();
var view = new View();