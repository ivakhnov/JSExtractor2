$(document).ready(function () {
	var pluginName = PLUGIN_NAME;
	var inputView = JSON.parse(INPUT_VIEW);

	$('#confName').append('Title: <p><input type="text" name="confName"></p>');
	$('#confDescription').append('Description: <p><textarea name="confDescription" rows="4" cols="80"></textarea></p>');
	$('#confForm').append(view.createForm(inputView));
	
	$('#saveConfig').click(function() {
		var confName = $('#confName > p > input').val();		
		var confDescription = $('#confDescription > p > textarea').val();		
		
		// The actual configuration
		var formString = $('#confForm').children('form').serialize();
		var configForm = view.formFilledToJson(formString);
		
		$.post('/plgconfigs', {
				pluginName: pluginName,
				confName : confName,
				confDescription : confDescription,
				confConfig: JSON.stringify(configForm)
			}, function(res){
				location.reload();
			});
		//resultForm.submit();
		
	});

});
