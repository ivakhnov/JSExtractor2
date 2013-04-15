$(document).ready(function () {
	// Variable 'ANALYSE_RESULTS' is already loaded from other script on this page,
	// so it is also local/visible to this script file. We only need to parse it to a JSON
	var _analyseResults = JSON.parse(ANALYSE_RESULTS);
	// the same for the names of used plugins (table headers for columns)
	var _usedPlugins = JSON.parse(USED_PLUGINS);

	console.log(_analyseResults);

	function initColumnDefs() {
		// map json object with analyse results to the representation requested by datatables
		var aoColumnDefs = [];
		// the first columns is for websites (not analyse outputs), so put it first
		aoColumnDefs.push({ 
			"aTargets": [ 0 ],
			"sTitle": "Websites",
			"mData": "siteName" 
		});
		for (var i = 0; i < _usedPlugins.length; i++) {
			var pos = (i + 1);
			var column = {
				"aTargets": [ pos ],
				"sTitle": _usedPlugins[i].pluginName,
				"mData": "siteOutput." + i + ".analyseResults"
			};
			aoColumnDefs.push(column);
		};
		return aoColumnDefs;
	};

	/* Init the table */
	var $oTable = $('#comparisonTable').dataTable({
		"sDom": "<'row-fluid'r>t<'row-fluid'<'span6'il><'span6'p>>",
		"sPaginationType": "bootstrap",
		"oLanguage": {
			"sLengthMenu": "_MENU_ records per page"
		},
		"bProcessing": true,

		"aaData": _analyseResults,
		"aoColumnDefs": initColumnDefs()
	});

	/* Add the column filter */
	$oTable.columnFilter({
		"sPlaceHolder": "head:before",
		"aoColumns": [ 
			{ 'type':  "text" }
		]
	});

	function fnCreateSelect (pluginID) {
		var r='<select  style="width: 90%">';
		r += '<option value="fnDataPerspective1">fnDataPerspective1</option>';
		r += '<option value="fnDataPerspective2">fnDataPerspective2</option>';
		r += '<option value="fnDataPerspective3">fnDataPerspective3</option>';
		r += '<option value="fnDataPerspective4">fnDataPerspective4</option></select>';
		return r;
	}

	// the first column contains websites (not plugin results)
	// so it has no dropdown selector for visualisation of plugin results
	$("thead > tr:first > :not(:first)").each( function ( i ) {
		console.log(this.innerHTML);
		// i corresponds with the position of the plugin in de the _usedPlugins array
		var pluginName = this.innerHTML;
		this.innerHTML = fnCreateSelect(i);
		// $('select', this).change( function () {
		// 	oTable.fnFilter( $(this).val(), i );
		// } );
	} );
});