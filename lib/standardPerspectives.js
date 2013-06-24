//////////////////////////////////////////////////////////////////////////
// Standard perspective functions                                       //
//                                                                      //
//////////////////////////////////////////////////////////////////////////

module.exports = {
	
	
	perspFns : [
		{
			"perspName": "Pass or crash",
			"description": "A boolean value to see whether plugin crashed or not.",
			"fn": "stdPassCrash"
		}
	],


	stdPassCrash : function(analyseOutput) {
	
	var resultHtml = '<style media="screen" type="text/css">'+
			'.falseBlock, .trueBlock {'+
			'	position: relative;'+
			'	height: 90px;'+
			'	width: 10%;'+
			'	font-size: 48px;'+
			'	text-align: center;'+
			'	display: table-cell;'+
			'	vertical-align: middle;'+
			'}'+
			'.falseBlock {'+
			'	color: #B40404;'+
			'	background: #F99D9F;'+
			'}'+
			'.trueBlock {'+
			'	color: #0B610B;'+
			'	background: #B3E0B1;'+
			'}'+
		'</style>';

	var blockStyle = null;
	
	if (analyseOutput == '') { 
		analyseOutput = 'crash';
		blockStyle = 'falseBlock';
	} else { 
		analyseOutput = 'passed';
		blockStyle = 'trueBlock';
	}
	resultHtml += "<div class='" + blockStyle + "'>" + analyseOutput + "</div>";

	return resultHtml;
}

};