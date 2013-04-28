var extractor = require('./lib/extractor');
var urlLib = require('./lib/urlLib');
var db = require('./lib/dbManager');
var async = require('async');




var sites =['ted.com',
			'google.com',
			'facebook.com',
			'yahoo.com',
			'youtube.com',
			'live.com',
			'wikipedia.com',
			'Blogger.com',
			'msn.com',
			'myspace.com',
			'Twitter.com',
			'WordPress.com',
			'Bing.com',
			'RapidShare.com',
			'flickr.com',
			'amazon.com',
			'ebay.com',
			'Craigslist.org',
			'LinkedIn.com',
			'hln.be',
			'Go.com',
			'imdb.com',
			'aol.com',
			'nytimes.com',
			'economist.com',
			'photobucket.com',
			'blogspot.com',
			'Ask.com',
			'MediaFire.com',
			'about.com',
			'ImageShack.com',
			'orkut.com',
			'livejournal.com',
			'4shared.com',
			'archive.org',
			'Hotfile.com',
			'digg.com',
			'Delicious.com',
			'Answers.com',
			'Skyrock.com',
			'popurls.com',
			'Tagged.com',
			'Hulu.com',
			'ehow.com',
			'Metacafe.com',
			'ft.com',
			'ezinearticles.com',
			'businessweek.com',
			'wsj.com',
			'Metacritic.com',
			'thefreedictionary.com',
			'howstuffworks.com',
			'fotolog.com',
			'CNET.com',
			'sciencemag.org',
			'Discovery.com',
			'nationalgeographic.com',
			'WebMD.com',
			'MedHelp.org',
			'MayoClinic.com',
			'NIH.gov',
			'wordreference.com',
			'EW.com',
			'Plentyoffish.com',
			'StumbleUpon.com',
			'reddit.com',
			'Guardian.com',
			'Reuters.com',
			'ICQ.com',
			'GameSpot.com',
			'IGN.com',
			'gamefaqs.com',
			'ediets.com',
			'models.com',
			'Cosmopolitan.com',
			'womensforum.com',
			'NFL.com',
			'SI.com'];
			
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

var items = sites;
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

function addConfigs() {
	function loopFun (conf, callback) {
		var confName = conf.configName;
		var confDescription = conf.description;
		var confConfig = conf.config;
		
		var pluginName = 'TestPlugin';
		
		db.savePluginConfig(pluginName, confName, confDescription, confConfig, function(res) {
			console.log('Configuration "' + confName + '" for plugin "' + pluginName + '" has been added to database..');
			callback(res);
		});
	};
	
	async.mapSeries(testPluginConfigs, loopFun, function(res) {
		console.log('OK!');
		// db.getPluginConfigs('TestPlugin', function(res) { console.log('TEST: ' + res); });
	});
};

db.resetDb();
//launcher();
addConfigs();
