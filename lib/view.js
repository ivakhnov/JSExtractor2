var View = function(viewJson) {
	
	// private members ------------------
	var _html = "";
	
	// public members --------------------
	this.getHtml = function(){
		return _html;
	};

	// method executed on creation, normaly none
	for (var i = 0; i < viewJson.length; i++) {
		var view = viewJson[i];

		var toolTip = view.toolTip;

		var result = "";

		switch(view.type)
		{
		case 'text':
			var description = "<form>" + view.description;
			var type = " <input type='" + view.type + "' class='input-xlarge'";
			var name = " name='" + view.name + "'>";
			result += description + "<br>" + type + name + "</form>";
			break;
		// radio OR checkbox 
		case 'radio':
		case 'checkbox':
			var description = "<form>" + view.description;
			result += description + "<br>";
			for (var v = 0; v < view.values.length; v++) {
				var type = " <input type='" + view.type + "'";
				var name = " name='" + view.name + "'";
				var value = " value='" + view.values[v].value + "'>";
				var descr = view.values[v].description;
				//var end = if(v == view.values.length) { return ""; } else { return "<br>"; }
				result += type + name + value + descr + "<br>";
			}
			result += "</form>";
			break;
		case 'select':
			var description = view.description;
			result += "<p><select>"
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
};


/**
 * Export View
 */
module.exports = View;