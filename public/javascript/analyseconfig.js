$(document).ready(function () {
	var accordionList = [];
	
	function startButton() {

		var plugins = [];
		for(var i = 0; i < accordionList.length; i++){
			var pluginID = accordionList[i];
			var configNameSelect = $('div.' + pluginID + " > select.configNameSelect").val();
			var perspectiveSelect = $('div.' + pluginID + " > select.perspectiveSelect").val();
			plugins.push({ 
				'pluginID': pluginID,
				'configName': configNameSelect,
				'perspectiveFun': perspectiveSelect
			});
		};
		var resultForm = $("<form action='/analyseresults' method='POST'></form>");
		
		// urls
		var urlsInput = $('#form-content input:text.urls');
		urlsInput.appendTo(resultForm);
		
		// selected plugins
		var pluginsInput = $('<input>').attr({
			type: 'hidden',
			name: 'plugins',
			value: JSON.stringify(plugins)});
		pluginsInput.appendTo(resultForm);
		
		resultForm.submit();
	};

	$('#pluginSelect').select2({
		placeholder: 'Select plugins',
		allowClear: true
	});

	$('#pluginSelect').on('change', function(e) {
		var pluginName = e.added.text;
		var pluginID = e.added.id;
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
			accordionList.push(pluginID);

			// ajax call to get html of the selected plugin
			$.get('/analyseconfig/plugin', { pluginName: pluginName }).done(function(json){
				var pluginConfigs = json.pluginConfigs;
				
				var htmlDiv = $("<h3 class="+ pluginID +">"+
					"<a href='#'>" + pluginName + "</a></h3>"+
					"<div class="+ pluginID +"></div>");
				
				// Select plugin configuration
				var configNameSelect = $("<p>Choose plugin configuration</p>"+
					"<select class='configNameSelect select'>");
				// using index 1 of htmlDiv to get the <div> for insertion
				$(htmlDiv[1]).append(configNameSelect);
				// Initialise select options for configurations of a plugin
				$.each(pluginConfigs, function(i, conf) {
					configNameSelect.append($('<option>').text(conf.confName).attr('value', conf.confName));
				});
				
				// Select function which defines perspective of the output (if plugin output is an object
				// with multiple fields, this 'perspective' defines which to show in this analyse)
				var perspectiveSelect = $("<p>Choose perspective function to show results</p>"+
					"<select class='perspectiveSelect select'>");
				$(htmlDiv[1]).append(perspectiveSelect);
				// load dynamically perspective functions
				$.getScript(pluginName+'/_'+pluginName+'.js', function () {
					// Initialise select options for configurations of a plugin
					$.each(PerspectiveFuns, function(i, persp) {
						perspectiveSelect.append($('<option>').text(persp.perspName).attr('value', persp.perspName));
					});
				});
				
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
