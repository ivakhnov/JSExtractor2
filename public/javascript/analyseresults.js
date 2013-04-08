$(document).ready(function () {
	// Variable 'RESULTS' is already loaded from other script on this page,
	// so it is also local/visible to this script file. We only need to parse it to a JSON
	var results = JSON.parse(RESULTS);


	// to create a jQuery function, you basically just extend the jQuery prototype
	// (using the fn alias)

	$.fn.processOutput = function () {
		for (var counter = 0; counter < this.length; counter++) {
			var $parent = this[counter];
			var pluginName = $parent.id;
			// get the analyse results for a particular plugin
			var result = $.grep(results, function(e) { 
				return e.pluginName == pluginName; 
			});
			// the result is an array, so take first element
			var result = result[0];

			// per plugin, there is an array with several analyse outputs (for each site one)
			var resultOutputsArray = result.output;
			for (var i = 0; i < resultOutputsArray.length; i++) {
				var analyseOutput = resultOutputsArray[i];
				var siteName = analyseOutput.siteName;

				$($parent).append('<h3><a>' + siteName + '</a></h3>');

				// create the the output view of the analyse
				var outputView = view.createOutput(analyseOutput.siteOutput);

				// get the output HTML 
				var htmlDiv = $(outputView.resultHtml);

				console.log('__BOE ' + outputView.resultHtml);
				// and append it
				$($parent).append(htmlDiv);

				// some items have to be initalised on page, so loop through the array and
				// execute all initialisation functions for the items (e.g. for charts)
				for (var i = 0; i < outputView.initItems.length; i++) {
					var item = outputView.initItems[i];
					switch(item.type) {
						case 'barchart':
							var id = item.id;
							var data = item.data;
							//Get context with jQuery - using jQuery's .get() method.
							var ctx = $($parent).find("canvas#" + id).get(0).getContext("2d");
							//This will get the first returned node in the jQuery collection.
							var myNewChart = new Chart(ctx).Bar(data);
							break;
					}
				}
			}
		}
		return 0;
	};

	$('.ui-acc-content').processOutput();
});