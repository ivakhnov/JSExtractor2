$(document).ready(function () {
	var accordionList = [];
	
	function startButton() {

		var plugins = [];
		for(var i = 0; i < accordionList.length; i++){
			var pluginID = accordionList[i];
			var configNameSelect = $('div.' + pluginID + " > select.configNameSelect").val();
			plugins.push({ 
				'pluginID': pluginID,
				'configName': configNameSelect,
			});
		};
		var resultForm = $("<form></form>");
		
		// urls
		var urlsInput = $('#form-content input:text.urls');
		urlsInput.clone().appendTo(resultForm);
		
		// selected plugins
		var pluginsInput = $('<input>').attr({
			type: 'hidden',
			name: 'plugins',
			value: JSON.stringify(plugins)});
		pluginsInput.appendTo(resultForm);
		
		//resultForm.submit();
		var str = resultForm.serialize();
		
		$.post('/analysis/add', str, function(data) {
			$('#addAlert').append($('<div class="alert alert-success">'+
				'<button type="button" class="close" data-dismiss="alert">&times;</button>'+
				'<h4>Success!</h4>'+
				'</div>'));
		});
	};
	
	function delAccItem(id) {
		// get the index of that element in de accordion list
		var idx = accordionList.indexOf(id);

		accordionList.splice(idx, 1);
		var head = $('h3.' + id);
		var div = $('div.' + id);
		div.add(head).fadeOut('slow',function(){$(this).remove();});
	};
	
	function addConfigSelect(pluginConfigs) {
		var configNameSelect = $("<p>Choose plugin configuration</p>"+
			"<select class='configNameSelect select'>");
		// Initialise select options for configurations of a plugin
		$.each(pluginConfigs, function(i, conf) {
			configNameSelect.append($('<option>').text(conf.confName).attr('value', conf.confName));
		});
		return configNameSelect;
	};
	
	function addEmptyAlert() {
		var alert = $("<p>No configurations for this plugin! The analysis "+
			"will run with default configuration provided by implementator. "+
			"Or choose 'Plugin configurations' in the sidebar menu, and define your own configuration!</p>");
		return alert;
	};
	
	function addAccItem(pluginName, pluginID) {
		accordionList.push(pluginID);
		// ajax call to get html of the selected plugin
		$.get('/analyseconfig/plugin', { pluginName: pluginName }).done(function(json){			
			var htmlDiv = $("<h3 class="+ pluginID +">"+
				"<a href='#'>" + pluginName + "</a></h3>"+
				"<div class="+ pluginID +"></div>");
			
			var pluginConfigs = json.pluginConfigs;
			var content = null;
			if (pluginConfigs.length > 0) {
				content = addConfigSelect(pluginConfigs);
			} else {
				content = addEmptyAlert();
			}
			
			// using index 1 of htmlDiv to get the <div> for insertion
			$(htmlDiv[1]).append(content);
			
			// Add this to the page
			$('.pluginsAccordion').append(htmlDiv);
			$('.pluginsAccordion').accordion('refresh');
			// make the new accordion element active
			var index = $( ".pluginsAccordion h3" ).length - 1;
			$('.pluginsAccordion').accordion( {active:index} );
		});
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
			delAccItem(id);

		// or a new item is selected
		} else {
			var pluginName = e.added.text;
			var pluginID = e.added.id;
			
			addAccItem(pluginName, pluginID);

		}

	});

	//form validation rules
	$("#analyseConfig-form").validate({
		rules: {
			urls: "required"
		},
		messages: {
			urls: "Please enter one or more urls (comma separated).",
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
