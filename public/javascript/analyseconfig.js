$(document).ready(function () {
	var accordionList = [];
	
	function startButton() {

		var config = [];
		for(var i = 0; i < accordionList.length; i++){
			var id = accordionList[i];
			var formString = $('div.' + id).children('form').serialize();
			var form = view.formFilledToJson(formString);
			config.push({ 
				'pluginID': id,
				'config': form
			});
		};
		var resultForm = $("<form action='/analyseresults' method='POST'></form>");
		
		// urls
		var urlsInput = $('#form-content input:text.urls');
		urlsInput.appendTo(resultForm);
		
		// selected plugins
		var pluginsInput = $('<input>').attr({
			type: 'hidden',
			name: 'config',
			value: JSON.stringify(config)});
		pluginsInput.appendTo(resultForm);
		
		resultForm.submit();
	};

	$('#pluginSelect').select2({
		placeholder: 'Select plugins',
		allowClear: true
	});

	$('#pluginSelect').on('change', function(e) {
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
			$.get('/analyseconfig/plugin', { pluginName: e.added.text }).done(function(json){
				var pluginConfigs = json.pluginConfigs;
				
				var htmlDiv = $("<h3 class="+ e.added.id +">"+
					"<a href='#'>" + e.added.text + "</a></h3>"+
					"<div class="+ e.added.id +"></div>");
				
				// Select plugin configuration
				var configNameSelect = $("<p>Choose plugin configuration</p>"+
					"<select class='" + e.added.id + " select' name='configNameSelect'>");
				// using index 1 of htmlDiv to get the <div> for insertion
				$(htmlDiv[1]).append(configNameSelect);
				
				// Select function which defines perspective of the output (if plugin output is an object
				// with multiple fields, this 'perspective' defines which to show in this analyse)
				var perspectiveSelect = $("<p>Choose perspective function to show results</p>"+
					"<select class='" + e.added.id + " select' name='perspectiveSelect'>");
				$(htmlDiv[1]).append(perspectiveSelect);
				
				// Initialise select options for configurations of a plugin
				$.each(pluginConfigs, function(i, conf) {
					configNameSelect.append($('<option>').text(conf.confName).attr('value', conf.confName));
				});
				
				//console.log($('select[name=configNameSelect]'));
				// Add this to the page
				$('.pluginsAccordion').append(htmlDiv);
				$('.pluginsAccordion').accordion('refresh');
				// make the new accordion element active
				var index = $( ".pluginsAccordion h3" ).length - 1;
				$('.pluginsAccordion').accordion( {active:index} );
			});

		}

	});

	//form validation rules
	$("#analyseConfig-form").validate({
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

	$('.pluginsAccordion').accordion({
		header: "> h3",
		collapsible: false,
		active: false,
		autoHeight: false,
		autoActivate: false,
		heightStyle: "content"
	});
});
