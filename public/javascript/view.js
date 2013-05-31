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
					result += description + "<br>" + type + name + "<br>";
					break;
				case 'textarea':
					var description = view.description;
					var type = " <textarea  style='height:200px; width:480px;'";
					var name = " name='" + view.name + "'></textarea>";
					result += description + "<p>" + type + name + "</p>";
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
};


/**
 * Export View
 */
//module.exports = new View();
var view = new View();