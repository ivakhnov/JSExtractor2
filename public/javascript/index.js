(function($,W,D)
{
	var JQUERY4U = {};

	JQUERY4U.UTIL =
	{
		setupFormValidation: function()
		{
			//form validation rules
			$("#inputSites-form").validate({
				rules: {
					urls: "required"
				},
				messages: {
					urls: "Please enter one or more urls (comma separated)."
				},
				submitHandler: function(form) {
					form.submit();
				}
			});
		}
	}


	$(document).ready(function() {
		JQUERY4U.UTIL.setupFormValidation();
	});

})(jQuery, window, document);
