var View = function(viewJson) {
	
	// private members ------------------
	var _html = "";
	
	// public members --------------------
	this.getHtml = function(){
		return _html;
	};

	// method executed on creation, normaly none
	_html += "<form>";
	for (var i = 0; i < viewJson.length; i++) {
		var view = viewJson[i];

		var toolTip = view.toolTip;

		var result = "";

		switch(view.type)
		{
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
		}
		_html += result;
	};
	_html += "</form>";
};


/**
 * Export View
 */
module.exports = View;