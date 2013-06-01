$(document).ready(function () {
	
	function getCodeList(arr) { 
		var resultHtml = "<ul>";
		for (var i = 0; i < arr.length; i++) {
			resultHtml += "<li>"+ JSON.parse(arr[i]).code +"</li>";
		};
		resultHtml += "</ul>";
		return resultHtml;
	};
			
	function startButton() {

		$('#scripts-block').remove();
		$('#events-block').remove();
		
		var urlsString = $('#siteSelect').val();
		
		$.get('/site', { 
			url		: urlsString
		}).done(function (codeResults){			
			var scripts = codeResults.scripts;
			var events = codeResults.events;

			var htmlDivScripts = $("<div id='scripts-block'></div>");
			
			var htmlScriptsInplace = $("<h3 id='scripts-block' class='ui-acc-header'>"+
				"<a href='#'> Scripts: inplace </a></h3>"+
				"<div style='text-align: left;'>"+ getCodeList(scripts.inplace) +"</div>");
			var htmlScriptsFile = $("<h3 id='scripts-block' class='ui-acc-header'>"+
				"<a href='#'> Scripts: external file </a></h3>"+
				"<div style='text-align: left;'>"+ getCodeList(scripts.sourceFiles) +"</div>");
			var htmlScriptsFileCross = $("<h3 id='scripts-block' class='ui-acc-header'>"+
				"<a href='#'> Scripts: external file (cross-domain) </a></h3>"+
				"<div style='text-align: left;'>"+ getCodeList(scripts.sourceFilesCrossDomain) +"</div>");
			
			$(htmlDivScripts).append(htmlScriptsInplace);
			$(htmlDivScripts).append(htmlScriptsFile);
			$(htmlDivScripts).append(htmlScriptsFileCross);
			
			var htmlDivEvents = $("<h3 id='events-block' class='ui-acc-header'>"+
				"<a href='#'> Events </a></h3>"+
				"<div class='ui-acc-content'></div>");
			
			$('#code-accordion').append(htmlDivScripts);
			$('#code-accordion').append(htmlDivEvents);
			
		});		
	};

	$('#siteSelect').select2({
		placeholder: 'Query sites',
		allowClear: true,
		minimumInputLength: 1,
		maximumSelectionSize: 1
	});

	//form validation rules
	$("#browseConfig-form").validate({
		rules: {
			urls: "required",
		},
		messages: {
			urls: "Please enter at least url!",
		},
		submitHandler: function(pageForm) {
			startButton();
		}
	});
});
