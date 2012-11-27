var redis = require('redis');

var DbManager = function() {
	
};

DbManager.prototype = {
	connect : function(callback) {
		var client = redis.createClient();
		cient.on('error', function(err) {
			console.log('Could not connect to database!' + '\n' + err);
		});
		client.on('connect', function() {
			callback(client);
		});
	},
	disconnect : function(conn) {
		conn.quit();
	}
};

exports.DbManager = DbManager;