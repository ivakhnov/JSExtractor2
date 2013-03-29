$(document).ready(function () {
	// Variable 'RESULTS' is already loaded from other script on this page,
	// so it is also local/visible to this script file. We only need to parse it to a JSON
	var results = JSON.parse(RESULTS);


	// to create a jQuery function, you basically just extend the jQuery prototype
	// (using the fn alias)

	$.fn.processOutput = function () {
		for (var counter = 0; counter < this.length; counter++) {
			var $parent = this[counter];
			var toolName = $parent.id;
			// get the analyse results for a particular plugin
			var result = $.grep(results, function(e) { 
				return e.toolName == toolName; 
			});
			// the result is an array, so take first element
			var result = result[0];

			// per plugin, there is an array with several analyse outputs (for each site one)
			var resultOutputsArray = result.output;
			for (var i = 0; i < resultOutputsArray.length; i++) {
				var analyseOutput = resultOutputsArray[i];
				var siteName = analyseOutput.siteName;

				$($parent).append('<h3><a>' + siteName + '</a></h3>');

				// create the HTML for the output view of the analyse
				var htmlDiv = $(view.createOutput(analyseOutput.siteOutput));
				// set the id
				htmlDiv.attr('id', siteName);
				// and append it
				$($parent).append(htmlDiv);
			}
		}
		return 0;
	};

	$('.ui-acc-content').processOutput();
});