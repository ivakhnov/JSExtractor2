var extractor = require('./lib/extractor');
var urlLib = require('./lib/urlLib');
var db = require('./lib/dbManager');
var async = require('async');
var fnPool = require('./lib/fnPool');
var analyseConfig = require('./routes/analyseconfig.js');

				
var urlsArray =['www.google.com',
				'webmail.vub.ac.be',
				'hln.be'];

			
var testPluginConfigs = [
	{
		"configName": "MyConfig 1",
		"description": "Cillum tattooed pickled, meggings non nostrud enim dolor blog freegan mustache sint actually Austin. Nostrud mustache tempor sed post-ironic. Swag labore quinoa helvetica, vero proident excepteur dreamcatcher godard photo booth stumptown VHS reprehenderit +1 mixtape. Sustainable irony vero, esse tempor before they sold out salvia skateboard lo-fi elit non. +1 typewriter shoreditch intelligentsia hoodie chambray. Assumenda ugh commodo VHS locavore, narwhal squid sapiente chillwave pork belly carles dreamcatcher. Chambray wes anderson irony art party, beard you probably haven't heard of them minim officia. Mcsweeney's skateboard umami marfa, whatever irony stumptown cliche salvia tousled ut exercitation intelligentsia hoodie put a bird on it. Stumptown fashion axe cupidatat letterpress, quis echo park tousled consectetur mollit post-ironic. Ea fixie tempor sapiente labore 3 wolf moon. Incididunt flannel pickled small batch, voluptate put a bird on it in echo park sustainable DIY. Banjo hella VHS four loko est. Ethnic scenester next level occupy, culpa chillwave pork belly. Est assumenda voluptate, exercitation tempor swag beard et four loko helvetica readymade consectetur.",
		"config": {	
			"userInput1":"userInputField1",
			"userInput2":"scripts",
			"userInput3":"events",
			"userInput4":"true"
		}
	},
	{
		"configName": "MyConfig 2",
		"description": "Cred letterpress non irure, nisi aliquip portland. Wolf master cleanse leggings, blue bottle swag banksy laborum cillum terry richardson accusamus fixie pork belly umami ullamco. Ullamco raw denim placeat irony master cleanse, quinoa sint odio proident scenester flannel etsy. Lo-fi tonx VHS hoodie incididunt. Beard keffiyeh raw denim officia. Laboris eiusmod high life organic mlkshk try-hard. Terry richardson salvia cupidatat organic, ea cray aesthetic laborum.",
		"config": {	
			"userInput1":"userInputField1",
			"userInput2":"events",
			"userInput3":"events",
			"userInput4":"default"
		}
	},
	{
		"configName": "MyConfig 3",
		"description": "VHS raw denim portland, hashtag pour-over quinoa put a bird on it tattooed placeat deep v fap esse photo booth eu high life. Ugh incididunt church-key et, occupy lo-fi umami do dolore squid gluten-free freegan keytar. Adipisicing gluten-free ethnic, pinterest narwhal ea neutra salvia nulla hashtag selfies banjo cupidatat. Church-key retro brooklyn sed, vinyl intelligentsia brunch trust fund cred sint magna esse. Kale chips high life Austin, single-origin coffee squid vegan whatever. Ad quis freegan veniam, blog mcsweeney's mumblecore fingerstache 90's. Godard sapiente occupy, ex vegan master cleanse literally. Jean shorts try-hard next level, photo booth placeat dolore cardigan PBR gentrify ex tempor. Street art 8-bit fanny pack, single-origin coffee mumblecore banjo cupidatat non. Yr artisan occaecat seitan photo booth intelligentsia DIY nostrud. Pour-over DIY beard banksy, tonx fanny pack try-hard brooklyn portland lomo ex PBR. Fanny pack echo park mumblecore, beard meggings esse consectetur nulla vegan nostrud quis ex mcsweeney's. Disrupt in authentic etsy ugh nulla synth tempor scenester. Gastropub artisan et, etsy tempor 8-bit kale chips brooklyn aesthetic laboris odd future quinoa. Laborum locavore cupidatat, mollit nulla ex butcher aesthetic disrupt. Shoreditch sunt church-key echo park art party. DIY chillwave vegan dolore culpa fixie. Umami pinterest actually, aute squid whatever excepteur. Vero jean shorts church-key next level, officia beard hoodie stumptown ethnic tonx. You probably haven't heard of them intelligentsia sriracha umami pitchfork, delectus tumblr godard nisi biodiesel tonx food truck anim. Hashtag aute esse, art party nostrud fanny pack tempor bespoke.",
		"config": {	
			"userInput1":"userInputField1",
			"userInput2":"events",
			"userInput3":"scripts",
			"userInput4":"false"
		}
	},
	{
		"configName": "MyConfig 4",
		"description": "VHS raw denim portland, hashtag pour-over quinoa put a bird on it tattooed placeat deep v fap esse photo booth eu high life. Ugh incididunt church-key et, occupy lo-fi umami do dolore squid gluten-free freegan keytar. Adipisicing gluten-free ethnic, pinterest narwhal ea neutra salvia nulla hashtag selfies banjo cupidatat. Church-key retro brooklyn sed, vinyl intelligentsia brunch trust fund cred sint magna esse. Kale chips high life Austin, single-origin coffee squid vegan whatever. Ad quis freegan veniam, blog mcsweeney's mumblecore fingerstache 90's. Godard sapiente occupy, ex vegan master cleanse literally.",
		"config": {	
			"userInput1":"userInputField1",
			"userInput2":"scripts",
			"userInput3":"scripts",
			"userInput4":"true"
		}
	}
];

var JSLintConfigs = [
	{
		"configName": "MyConfig 1",
		"description": "Cillum tattooed pickled, meggings non nostrud enim dolor blog freegan mustache sint actually Austin. Nostrud mustache tempor sed post-ironic. Swag labore quinoa helvetica, vero proident excepteur dreamcatcher godard photo booth stumptown VHS reprehenderit +1 mixtape. Sustainable irony vero, esse tempor before they sold out salvia skateboard lo-fi elit non. +1 typewriter shoreditch intelligentsia hoodie chambray. Assumenda ugh commodo VHS locavore, narwhal squid sapiente chillwave pork belly carles dreamcatcher. Chambray wes anderson irony art party, beard you probably haven't heard of them minim officia. Mcsweeney's skateboard umami marfa, whatever irony stumptown cliche salvia tousled ut exercitation intelligentsia hoodie put a bird on it. Stumptown fashion axe cupidatat letterpress, quis echo park tousled consectetur mollit post-ironic. Ea fixie tempor sapiente labore 3 wolf moon. Incididunt flannel pickled small batch, voluptate put a bird on it in echo park sustainable DIY. Banjo hella VHS four loko est. Ethnic scenester next level occupy, culpa chillwave pork belly. Est assumenda voluptate, exercitation tempor swag beard et four loko helvetica readymade consectetur.",
		"config": {	
			"userInput1":"userInputField1",
			"userInput2":"scripts",
			"userInput3":"events",
			"userInput4":"true"
		}
	},
	{
		"configName": "Config for NodeJS",
		"description": "Cred letterpress non irure, nisi aliquip portland. Wolf master cleanse leggings, blue bottle swag banksy laborum cillum terry richardson accusamus fixie pork belly umami ullamco. Ullamco raw denim placeat irony master cleanse, quinoa sint odio proident scenester flannel etsy. Lo-fi tonx VHS hoodie incididunt. Beard keffiyeh raw denim officia. Laboris eiusmod high life organic mlkshk try-hard. Terry richardson salvia cupidatat organic, ea cray aesthetic laborum.",
		"config": {	
			"node":"true",
			"white":"true", 
			"regexp":"true", 
			"todo":"true",
			"vars":"true",
			"plusplus":"true"
		}
	},
	{
		"configName": "MyConfig 3",
		"description": "VHS raw denim portland, hashtag pour-over quinoa put a bird on it tattooed placeat deep v fap esse photo booth eu high life. Ugh incididunt church-key et, occupy lo-fi umami do dolore squid gluten-free freegan keytar. Adipisicing gluten-free ethnic, pinterest narwhal ea neutra salvia nulla hashtag selfies banjo cupidatat. Church-key retro brooklyn sed, vinyl intelligentsia brunch trust fund cred sint magna esse. Kale chips high life Austin, single-origin coffee squid vegan whatever. Ad quis freegan veniam, blog mcsweeney's mumblecore fingerstache 90's. Godard sapiente occupy, ex vegan master cleanse literally. Jean shorts try-hard next level, photo booth placeat dolore cardigan PBR gentrify ex tempor. Street art 8-bit fanny pack, single-origin coffee mumblecore banjo cupidatat non. Yr artisan occaecat seitan photo booth intelligentsia DIY nostrud. Pour-over DIY beard banksy, tonx fanny pack try-hard brooklyn portland lomo ex PBR. Fanny pack echo park mumblecore, beard meggings esse consectetur nulla vegan nostrud quis ex mcsweeney's. Disrupt in authentic etsy ugh nulla synth tempor scenester. Gastropub artisan et, etsy tempor 8-bit kale chips brooklyn aesthetic laboris odd future quinoa. Laborum locavore cupidatat, mollit nulla ex butcher aesthetic disrupt. Shoreditch sunt church-key echo park art party. DIY chillwave vegan dolore culpa fixie. Umami pinterest actually, aute squid whatever excepteur. Vero jean shorts church-key next level, officia beard hoodie stumptown ethnic tonx. You probably haven't heard of them intelligentsia sriracha umami pitchfork, delectus tumblr godard nisi biodiesel tonx food truck anim. Hashtag aute esse, art party nostrud fanny pack tempor bespoke.",
		"config": {	
			"userInput1":"userInputField1",
			"userInput2":"events",
			"userInput3":"scripts",
			"userInput4":"false"
		}
	}
];
			
var testPerspectiveFns = [
	{
		"perspName": "MyPerspective 1",
		"description": "Cillum tattooed pickled, meggings non nostrud enim dolor blog freegan mustache sint actually Austin. Nostrud mustache tempor sed post-ironic. Swag labore quinoa helvetica, vero proident excepteur dreamcatcher godard photo booth stumptown VHS reprehenderit +1 mixtape. Sustainable irony vero, esse tempor before they sold out salvia skateboard lo-fi elit non. +1 typewriter shoreditch intelligentsia hoodie chambray. Assumenda ugh commodo VHS locavore, narwhal squid sapiente chillwave pork belly carles dreamcatcher. Chambray wes anderson irony art party, beard you probably haven't heard of them minim officia. Mcsweeney's skateboard umami marfa, whatever irony stumptown cliche salvia tousled ut exercitation intelligentsia hoodie put a bird on it. Stumptown fashion axe cupidatat letterpress, quis echo park tousled consectetur mollit post-ironic. Ea fixie tempor sapiente labore 3 wolf moon. Incididunt flannel pickled small batch, voluptate put a bird on it in echo park sustainable DIY. Banjo hella VHS four loko est. Ethnic scenester next level occupy, culpa chillwave pork belly. Est assumenda voluptate, exercitation tempor swag beard et four loko helvetica readymade consectetur.",
		"fn": "testfunctie1"
	},
	{
		"perspName": "MyPerspective 2",
		"description": "Cred letterpress non irure, nisi aliquip portland. Wolf master cleanse leggings, blue bottle swag banksy laborum cillum terry richardson accusamus fixie pork belly umami ullamco. Ullamco raw denim placeat irony master cleanse, quinoa sint odio proident scenester flannel etsy. Lo-fi tonx VHS hoodie incididunt. Beard keffiyeh raw denim officia. Laboris eiusmod high life organic mlkshk try-hard. Terry richardson salvia cupidatat organic, ea cray aesthetic laborum.",
		"fn": "testfunctie1"
	},
	{
		"perspName": "MyPerspective 3",
		"description": "VHS raw denim portland, hashtag pour-over quinoa put a bird on it tattooed placeat deep v fap esse photo booth eu high life. Ugh incididunt church-key et, occupy lo-fi umami do dolore squid gluten-free freegan keytar. Adipisicing gluten-free ethnic, pinterest narwhal ea neutra salvia nulla hashtag selfies banjo cupidatat. Church-key retro brooklyn sed, vinyl intelligentsia brunch trust fund cred sint magna esse. Kale chips high life Austin, single-origin coffee squid vegan whatever. Ad quis freegan veniam, blog mcsweeney's mumblecore fingerstache 90's. Godard sapiente occupy, ex vegan master cleanse literally. Jean shorts try-hard next level, photo booth placeat dolore cardigan PBR gentrify ex tempor. Street art 8-bit fanny pack, single-origin coffee mumblecore banjo cupidatat non. Yr artisan occaecat seitan photo booth intelligentsia DIY nostrud. Pour-over DIY beard banksy, tonx fanny pack try-hard brooklyn portland lomo ex PBR. Fanny pack echo park mumblecore, beard meggings esse consectetur nulla vegan nostrud quis ex mcsweeney's. Disrupt in authentic etsy ugh nulla synth tempor scenester. Gastropub artisan et, etsy tempor 8-bit kale chips brooklyn aesthetic laboris odd future quinoa. Laborum locavore cupidatat, mollit nulla ex butcher aesthetic disrupt. Shoreditch sunt church-key echo park art party. DIY chillwave vegan dolore culpa fixie. Umami pinterest actually, aute squid whatever excepteur. Vero jean shorts church-key next level, officia beard hoodie stumptown ethnic tonx. You probably haven't heard of them intelligentsia sriracha umami pitchfork, delectus tumblr godard nisi biodiesel tonx food truck anim. Hashtag aute esse, art party nostrud fanny pack tempor bespoke.",
		"fn": "testfunctie1"
	},
	{
		"perspName": "MyPerspective 4",
		"description": "VHS raw denim portland, hashtag pour-over quinoa put a bird on it tattooed placeat deep v fap esse photo booth eu high life. Ugh incididunt church-key et, occupy lo-fi umami do dolore squid gluten-free freegan keytar. Adipisicing gluten-free ethnic, pinterest narwhal ea neutra salvia nulla hashtag selfies banjo cupidatat. Church-key retro brooklyn sed, vinyl intelligentsia brunch trust fund cred sint magna esse. Kale chips high life Austin, single-origin coffee squid vegan whatever. Ad quis freegan veniam, blog mcsweeney's mumblecore fingerstache 90's. Godard sapiente occupy, ex vegan master cleanse literally.",
		"fn": "testfunctie1"
	}
];

var JSLintPerspectiveFns = [
	{
		"perspName": "Scan Pie",
		"description": "Cillum tattooed pickled, meggings non nostrud enim dolor blog freegan mustache sint actually Austin. Nostrud mustache tempor sed post-ironic. Swag labore quinoa helvetica, vero proident excepteur dreamcatcher godard photo booth stumptown VHS reprehenderit +1 mixtape. Sustainable irony vero, esse tempor before they sold out salvia skateboard lo-fi elit non. +1 typewriter shoreditch intelligentsia hoodie chambray. Assumenda ugh commodo VHS locavore, narwhal squid sapiente chillwave pork belly carles dreamcatcher. Chambray wes anderson irony art party, beard you probably haven't heard of them minim officia. Mcsweeney's skateboard umami marfa, whatever irony stumptown cliche salvia tousled ut exercitation intelligentsia hoodie put a bird on it. Stumptown fashion axe cupidatat letterpress, quis echo park tousled consectetur mollit post-ironic. Ea fixie tempor sapiente labore 3 wolf moon. Incididunt flannel pickled small batch, voluptate put a bird on it in echo park sustainable DIY. Banjo hella VHS four loko est. Ethnic scenester next level occupy, culpa chillwave pork belly. Est assumenda voluptate, exercitation tempor swag beard et four loko helvetica readymade consectetur.",
		"fn": "ScanPie"
	},
	{
		"perspName": "Number of remarks",
		"description": "Cred letterpress non irure, nisi aliquip portland. Wolf master cleanse leggings, blue bottle swag banksy laborum cillum terry richardson accusamus fixie pork belly umami ullamco. Ullamco raw denim placeat irony master cleanse, quinoa sint odio proident scenester flannel etsy. Lo-fi tonx VHS hoodie incididunt. Beard keffiyeh raw denim officia. Laboris eiusmod high life organic mlkshk try-hard. Terry richardson salvia cupidatat organic, ea cray aesthetic laborum.",
		"fn": "RemarksNumber"
	},
	{
		"perspName": "Error Report",
		"description": "Cred letterpress non irure, nisi aliquip portland. Wolf master cleanse leggings, blue bottle swag banksy laborum cillum terry richardson accusamus fixie pork belly umami ullamco. Ullamco raw denim placeat irony master cleanse, quinoa sint odio proident scenester flannel etsy. Lo-fi tonx VHS hoodie incididunt. Beard keffiyeh raw denim officia. Laboris eiusmod high life organic mlkshk try-hard. Terry richardson salvia cupidatat organic, ea cray aesthetic laborum.",
		"fn": "ErrorReport"
	}
];

var standaardPerspFns = { };
standaardPerspFns.testfunctie1 = function(analyseOutput) {
	
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
	var val = analyseOutput[0].value
	
	if (val == 'true') { 
		val = 'true';
		blockStyle = 'trueBlock';
	} else { 
		val = 'false';
		blockStyle = 'falseBlock';
	}
	resultHtml += "<div class='" + blockStyle + "'>" + val + "</div>";

	return resultHtml;
};

standaardPerspFns.ScanPie = function (analyseOutput) {
				
	var valScanned = analyseOutput.match(/(?:\S+\s)?\S*scanned/g);
	var val = "";
	if(valScanned.length > 0) {
		valScanned = valScanned[0].substr(1);
		val = valScanned.split(" ")[0];
	} else {
		val = "100%";
	}
	val = parseInt(val);
	
	var data = [{
					value: val,
					color:"#58F331"
				},
				{
					value : 100,
					color : "#E0E4CC"
				}];
	
	var js = "<script type='text/javascript'>"+
			'$($(".toParsePieChart").get(0)).replaceWith($("<canvas class=\'pieChart\'></canvas>"));'+
			'var ctx = $(".pieChart").last()[0].getContext("2d");'+
			'new Chart(ctx).Pie('+ JSON.stringify(data) +');'+
		"</script>";

	resultHtml = "<canvas class='toParsePieChart'></canvas>";
	resultHtml += js;
	
	console.log(resultHtml);

	return resultHtml;
};

standaardPerspFns.RemarksNumber = function(analyseOutput) {
	
	var resultHtml = '<style media="screen" type="text/css">'+
			'.countBlock {'+
			'	height: 90px;'+
			'	width: 10%;'+
			'	font-size: 48px;'+
			'	text-align: center;'+
			'	display: table-cell;'+
			'	vertical-align: middle;'+
			'}'+
		'</style>';

	var blockStyle = 'countBlock';
	// the g in the regular expression says to search the whole string 
	// rather than just find the first occurrence
	var val = analyseOutput.match(/<cite>/g).length;

	resultHtml += "<div class='" + blockStyle + "'>" + val + "</div>";

	return resultHtml;
};

standaardPerspFns.ErrorReport = function(analyseOutput) {
	
	var resultHtml = '<style media="screen" type="text/css">'+
			'.errorReportBlock {'+
			'	height: 90px;'+
			'	width: 10%;'+
			'	font-size: 11px;'+
			'	text-align: left;'+
			'	display: table-cell;'+
			'	vertical-align: middle;'+
			'}'+
		'</style>';

	var blockStyle = 'errorReportBlock';
	var val = analyseOutput;

	resultHtml += "<div class='" + blockStyle + "'>" + val + "</div>";

	return resultHtml;
};

//////////////////////////////////////////////////////////
// End of dummy data. Starting to add it to application //
//////////////////////////////////////////////////////////


function resetDb(callback) {
	var err = null;
	db.resetDb();
	callback(err, 'Database resetted!');
};

function addExtractions(plugins, callback) {
	async.forEachSeries(urlsArray, 
		function (url, callb) { 
			analyseConfig.parsePage(url, function (err) {
				if(err != null) { callb (err); }
				else { analyseConfig.analyseSite(url, plugins, callb); }
			});
		}, 
		function (err, results){
			callback(err, 'OK - extracting JS')
	});
};

function async(arg, callback) {
  console.log(arg);
  extractor.parsePage(urlLib.addHttp(arg), function(results) {
	db.savePage(urlLib.addHttp(arg), results.scripts, results.events, function(err, reply) {
		console.log(arg + ' ...');
		if(err) {
			console.log('Catched an error in extractor.js');
			console.log(err);
		} else {
			callback('ok');
		}
	});    
  });
  
};
function final() { console.log('Done'); };

var items = urlsArray;
var running = 0;
var limit = 1;

function launcher() {
  while(running < limit && items.length > 0) {
	var item = items.shift();
	async(item, function(result) {
	  running--;
	  if(items.length > 0) {
		launcher();
	  } else if(running == 0) {
		final();
	  }
	});
	running++;
  }
};

function addConfigs(pluginName, pluginConfigs, callback) {
	var err = null;
	function loopFun (conf, callback) {
		var confName = conf.configName;
		var confDescription = conf.description;
		var confConfig = conf.config;
				
		db.savePluginConfig(pluginName, confName, confDescription, confConfig, function(res) {
			console.log('Added configuration "' + confName + '" for plugin "' + pluginName);
			callback(res);
		});
	};
	
	async.mapSeries(pluginConfigs, 
		loopFun,
		function(res) {
			console.log('OK - saving configurations!');
			callback(err, 'OK - saving configurations!');
	});
};

function addPerspectiveFns(pluginName, pluginPerspectives, callback) {
	var err = null;
	function loopFun (persp, callback) {
		var perspName = persp.perspName;
		var perspDescription = persp.description;
		var fnString = persp.fn;
				
		//fn = eval(fnString);
		var fn = standaardPerspFns[fnString];
		fnPool.addFn(fn, function (fnID) {
			db.savePluginPersp(pluginName, pluginName+": "+perspName, perspDescription, fnID, function (res) {
				console.log('Added perspective function "' + perspName + '" with id='+ fnID +' for plugin "' + pluginName);
				callback(res);
			});
		});
	};
	
	async.mapSeries(pluginPerspectives, 
		loopFun,
		function(res) {
			console.log('OK - saving perspective functions TestPlugin!');
			callback(err, 'OK - saving perspective functions TestPlugin!');
	});
};

async.series([
	function(callback){
		resetDb(callback);
	},
	function(callback){
		addConfigs('TestPlugin', testPluginConfigs, callback);
	},
	function(callback){
		addConfigs('JSLint', JSLintConfigs, callback);
	},
	function(callback){
		addPerspectiveFns('TestPlugin', testPerspectiveFns, callback);
	},
	function(callback){
		addPerspectiveFns('JSLint', JSLintPerspectiveFns, callback);
	},
	function(callback){
		var plugins = [ { pluginID: '1', configName: 'Config for NodeJS' } ];
		addExtractions(plugins, callback);
	},
],
// optional callback
function(err, results){
	console.log('\n Dummy data added to database! \n \n Done!');
	require('./app');
});

