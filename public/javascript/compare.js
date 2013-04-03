$(document).ready(function () {
	var pluginsList = [];

	/* For reinitialisation of the table */
	$.fn.reinitDataTable = function () {
		$('.comparisonTable').dataTable({
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
		});
	};

	$('#pluginSelect').select2({
		placeholder: 'Select plugins',
		allowClear: true
	});

	$('#pluginSelect').on('change', function(e) {
		// determine if the 'change' is a deletion
		if(pluginsList.length > e.val.length){
			// determine which item has been deleted from selection
			var ids = pluginsList.filter(function(i) {
					return !(e.val.indexOf(i) > -1)
			})
			// only one item at a time can be deleted or added to selection, no need in array
			id = ids[0];
			// get the index of that element in de accordion list
			var idx = pluginsList.indexOf(id);

			pluginsList.splice(idx, 1);
			var head = $('h3.' + id);
			var div = $('div.' + id);
			div.add(head).fadeOut('slow',function(){$(this).remove();});

		// or a new item is selected
		} else {
			pluginsList.push(e.added.id);

			// ajax call to get html of the selected plugin
			$.get('/compare/plugin', { pluginName: e.added.text }).done(function(json){
				var htmlDiv = "<h3 class='"+ e.added.id +" ui-acc-header'><a>" + e.added.text + "</a></h3>";
				htmlDiv += "<div class='"+ e.added.id +" block-content'>" + view.createComparisonTable(json.outputFormat) + "</div>";
				$('.pluginsList').append(htmlDiv);
				$().reinitDataTable();
			});

		}

	});
});
