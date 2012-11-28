var redis = require('redis');


var DbManager = {
	
	testFunc : function() {
		this.prototype._client(
			function(client) {
				
				// client.set("string key", "string val", redis.print);
				// client.hset("hash key", "hashtest 1", "some value", redis.print);
				// client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
				
				client.hkeys("hash key", function (err, replies) {
				    console.log(replies.length + " replies:");
				    replies.forEach(function (reply, i) {
				        console.log("    " + i + ": " + reply);
				    });
				});
				 
				console.log('teeeest');
				
			}
		);
		 
		console.log('test');
		
	},
	
	resetDb : function() {
		this.prototype._client(
			function(client) {
				client.flushdb();
			}
		);
	}
};

DbManager.prototype = {
	_client : function(callback) {
		var client = redis.createClient();
		client.on('error', function(err) {
			console.log('Could not connect to database!' + '\n' + err);
		});
		client.on('connect', function() {
			callback(client);
			client.quit();
		});
	}
};

exports.DbManager = DbManager;

//DbManager.testFunc();