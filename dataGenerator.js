var extractor = require('./lib/extractor');
var urlLib = require('./lib/urlLib');
var db = require('./lib/dbManager');




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

db.resetDb();
launcher();