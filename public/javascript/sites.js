$(document).ready(function () {
	
	function getCodeList(arr, getterFun) { 
		var ObjUl = $('<ul></ul>');
		for (var i = 0; i < arr.length; i++) {
			var Objli = $('<li></li>');
			var Objc = $('<samp></samp>');
			
			Objc.text(getterFun(arr[i]));
			Objli.append(Objc);

			ObjUl.append(Objli);
			ObjUl.append($("<br>"));
		};
		return ObjUl;
	};
			
	function startButton() {

		$('#code-block').remove();
		
		var urlsString = $('#siteSelect').val();
		
		$.get('/site', { 
			url		: urlsString
		}).done(function (codeResults){			
			var scripts = codeResults.scripts;
			var events = codeResults.events;
			
			var htmlBlock = $("<h3 id='js-block' class='ui-acc-header'>"+
				"<a href='#'> Scripts: inplace </a></h3>"+
				"<div style='text-align: left;'></div>");
			
			var htmlScriptsInplace = htmlBlock.clone();
			$(htmlScriptsInplace[1]).append(getCodeList(scripts.inplace, function(x) {
				return JSON.parse(x).code;
			}));
			var htmlScriptsFile = htmlBlock.clone();
			$(htmlScriptsFile[1]).append(getCodeList(scripts.sourceFiles, function(x) {
				return JSON.parse(x).code;
			}));
			var htmlScriptsFileCross = htmlBlock.clone();
			$(htmlScriptsFileCross[1]).append(getCodeList(scripts.sourceFilesCrossDomain, function(x) {
				return JSON.parse(x).code;
			}));
			
			var htmlEventsFuns = htmlBlock.clone();
			$(htmlEventsFuns[1]).append(getCodeList(events, function(x) {
				return JSON.parse(x).listeners.func;
			}));
			
			var codeBlock = $("<div id='code-block'></div>");
			
			$(codeBlock).append(htmlScriptsInplace);
			$(codeBlock).append(htmlScriptsFile);
			$(codeBlock).append(htmlScriptsFileCross);
			$(codeBlock).append(htmlEventsFuns);
			
			$('#code-accordion').append(codeBlock);
			
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
