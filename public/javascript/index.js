$(document).ready(function() {
	
	/* Init the table */
	var $oTable = $('#comparisonTable').dataTable({
		"sDom": "<'row-fluid'r>t<'row-fluid'<'span6'il><'span6'p>>",
		"sPaginationType": "bootstrap",
		"oLanguage": {
			"sLengthMenu": "_MENU_ records per page"
		},
		"bProcessing": true,
		"bAutoWidth": false,
		//"bServerSide": true,
		//"sAjaxSource": "/compare/table",
		"sAjaxSource": "custom_prop.txt",
		"sAjaxDataProp": "demo",
		"aoColumns": [
			{ "bSortable": true },
			{ "bSortable": false }
		],
		"oTableTools": {
			"sRowSelect": "multi"
		},
	});

	/* Add the column filter */
	$oTable.columnFilter({
		"sPlaceHolder": "head:after",
		"aoColumns": [ 
			{ "type":  "text" },
			{ "type":  "text" }
		]
	});

});