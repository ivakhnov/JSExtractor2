$(document).ready(function () {
	var pluginName = PLUGIN_NAME;
	var inputView = JSON.parse(INPUT_VIEW);

	$('#confName').append('Title: <p><input type="text" name="confName"></p>');
	$('#confDescription').append('Description: <p><textarea name="confDescription" style="height:100px; width:480px;"></textarea></p>');
	$('#confForm').append(view.createForm(inputView));
	
	$('#saveConfig').click(function () {
		var confName = $('#confName > p > input').val();		
		var confDescription = $('#confDescription > p > textarea').val();		
		
		// The actual configuration
		var formString = $('#confForm').children('form').serialize();
		var configForm = view.formFilledToJson(formString);
		
		$.post('/plgconfigs/save', {
				pluginName: pluginName,
				confName : confName,
				confDescription : confDescription,
				confConfig: JSON.stringify(configForm)
			}, function (res){
				location.reload();
		});		
	});
	
	$('.deleteConf').click(function () {
		var confName = $(this).attr('href');
		console.log('test: ' + confName);
		
		$.post('/plgconfigs/del', {
				pluginName: pluginName,
				confName : confName,
			}, function (res){
				location.reload();
		});
	});

});
