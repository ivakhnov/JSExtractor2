$(document).ready(function () {
	var accordionList = [];
	
	$( ".toolsAccordion" ).accordion({
		header: "> h3",
		collapsible: false,
		active: false,
		autoHeight: false,
		autoActivate: false,
		heightStyle: "content"
	});

	$('#toolSelect').select2({
		placeholder: 'Add tools',
		allowClear: true
	});

	$('#myClicker').click(function() {
		var parent = $(this).closest('div');
		var head = parent.prev('h3');
		parent.add(head).fadeOut('slow',function(){$(this).remove();});
	});

	$('#toolSelect').on("change", function(e) {
		// determine if the 'change' is a deletion
		if(accordionList.length > e.val.length){
			// determine which item has been deleted from selection
			var ids = accordionList.filter(function(i) {
					return !(e.val.indexOf(i) > -1)
			})
			// only one item at a time can be deleted or added to selection, no need in array
			id = ids[0];
			// get the index of that element in de accordion list
			var idx = accordionList.indexOf(id);

			accordionList.splice(idx, 1);
			var head = $('h3.' + id);
			var div = $('div.' + id);
			div.add(head).fadeOut('slow',function(){$(this).remove();});

		// or a new item is selected
		} else {
			accordionList.push(e.added.id);

			// ajax call to get html of the selected plugin
			$.post('/analyseconfig/plugin', { toolName: e.added.text }, function(json){
				var htmlDiv = "<h3 class="+ e.added.id +"><a href='#'>" + e.added.text + "</a></h3><div class="+ e.added.id +">" + json.htmlDiv + "</div>";
				$('.toolsAccordion').append(htmlDiv);
				$('.toolsAccordion').accordion('refresh');
				// make the new accordion element active
				var index = $( ".toolsAccordion h3" ).length - 1;
				$('.toolsAccordion').accordion( {active:index} );
			});

			// $.ajax({
			// 	url: '/analyseconfig/plugin',
			// 	type: 'post',
			// 	data: "{'toolName':'" + e.added.text + "'}",
			// 	dataType: 'html',
			// 	success: function(htmlDiv) {
			// 		$('.toolsAccordion').append(htmlDiv);
			// 		$('.toolsAccordion').accordion('refresh');
			// 		// make the new accordion element active
			// 		var index = $( ".toolsAccordion h3" ).length - 1;
			// 		$('.toolsAccordion').accordion( {active:index} );
			// 	}
			// });

			// var newDiv = "<h3 class="+ e.added.id +"><a href='#'>" + e.added.text + "</a></h3><div class="+ e.added.id +">" + e.added.text + "</div>";
			// $('.toolsAccordion').append(newDiv);
			// $('.toolsAccordion').accordion('refresh');
			// // make the new accordion element active
			// var index = $( ".toolsAccordion h3" ).length - 1;
			// $('.toolsAccordion').accordion( {active:index} );

		}

	});
});
