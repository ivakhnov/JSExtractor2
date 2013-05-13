$(document).ready(function () {
	
	var _analyseResults = [];
	var _selectedPerspectives = [];

	function initColumnDefs() {
		// map json object with analyse results to the representation requested by datatables
		var aoColumnDefs = [];
		// the first columns is for websites, so put it first
		aoColumnDefs.push({ 
			"aTargets": [ 0 ],
			"sTitle": "Websites",
			"mData": "siteName" 
		});
		for (var i = 0; i < _selectedPerspectives.length; i++) {
			var pos = (i + 1);
			var column = {
				"aTargets": [ pos ],
				"sTitle": _selectedPerspectives[i],
				"mData": "siteOutput." + i + ".analyseResults"
			};
			aoColumnDefs.push(column);
		};
		return aoColumnDefs;
	};

	/* Init the table */
	
	
	
	function startButton() {
		// get the array of all selected perspectives
		_selectedPerspectives = $('#perspectiveSelect').val();
		
		
		// table#comparisonTable.table.table-striped.table-bordered(cellpadding='10', cellspacing='10', border='10')
		
		// <table id="comparisonTable" cellpadding="10" cellspacing="10" border="10" class="table table-striped table-bordered"></table>
		
		
		console.log('En nu gaan we data aan dataTables geven');
		
		$('#table-block').remove();
		$('#databaseTable').append($('<div id="table-block">'+
			'<table id="comparisonTable" cellpadding="10" cellspacing="10" border="10" class="table table-striped table-bordered">'+
			'</table></div>'));
		
		$('#comparisonTable').dataTable({
			"sDom": "<'row-fluid'r>t<'row-fluid'<'span6'il><'span6'p>>",
			"sPaginationType": "bootstrap",
			"oLanguage": {
				"sLengthMenu": "_MENU_ records per page"
			},
			"bProcessing": true,

			"aaData": _analyseResults,
			"aoColumnDefs": initColumnDefs()
		});
		
	};

	$('#perspectiveSelect').select2({
		placeholder: 'Select perspective functions',
		allowClear: true
	});

	//form validation rules
	$("#browseConfig-form").validate({
		rules: {
			urls: "required",
			plugins: "required"
		},
		messages: {
			urls: "Please enter one or more urls (comma separated).",
			plugins: "Pick at least one tool for the analysis."
		},
		submitHandler: function(pageForm) {
			startButton();
		}
	});
});
