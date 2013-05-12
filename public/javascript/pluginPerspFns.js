$(document).ready(function () {
	var pluginName = PLUGIN_NAME;
	var inputView = [{	
		"type": "textarea",
		"name": "perspFn",
		"description": "Define your perspective function here: "
	}];

	$('#perspName').append('Title: <p><input type="text" name="perspName"></p>');
	$('#perspDescription').append('Description: <p><textarea name="perspDescription" style="height:100px; width:480px;"></textarea></p>');
	$('#perspForm').append(view.createForm(inputView));
	
	$('#savePersp').click(function () {
		var perspName = $('#perspName > p > input').val();		
		var perspDescription = $('#perspDescription > p > textarea').val();		
		
		// The actual perspective function
		var perspFn = $('#perspForm > form > p > textarea').val();
		
		$.post('/plgPerspFns/save', {
				'pluginName' 		: pluginName,
				'perspName' 		: perspName,
				'perspDescription' 	: perspDescription,
				'perspFn' 			: perspFn
			}, function (res){
				location.reload();
		});		
	});
	
	$('.deletePersp').click(function () {
		var perspName = $(this).attr('href');
		console.log('test: ' + perspName);
		
		$.post('/plgPerspFns/del', {
				pluginName: pluginName,
				perspName : perspName,
			}, function (res){
				location.reload();
		});
	});

});
