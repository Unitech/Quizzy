var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

var url_site = 'http://localhost:3000';
/**** Add methods to model *****/
function Quizz(quizz) {
    if (quizz == undefined) {
	console.log('Warning quizz undefined');
	return
    }
    quizz.getPublicUrl = function() {
	return url_site + "/c/" + quizz.url_id;
    }
    quizz.getAdminUrl = function() {
	return url_site + "/a/" + quizz.url_id;
    }
    quizz.getResultUrl = function() {
	return url_site + "/r/" + quizz.url_id;
    }
}


/******* Provider *******/
QuizzProvider = function(host, port){
    this.db = new Db('node-mongo-blog', new Server(host, port, {auto_reconnect: true}, {}));
    this.db.open(function(){});
};

QuizzProvider.prototype.getCollection = function(callback) {
    this.db.collection('quizz', function(error, quizz_collection) {
	if( error ) callback(error);
	else callback(null, quizz_collection);
    });
};

QuizzProvider.prototype.find = function(data, callback) {
    this.getCollection(function(err, quizz) {
	quizz.find(data).toArray(function(err, res) {
	    Quizz(res[0]);
	    callback(null, res[0]);
	});
    });
};

QuizzProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, quizz_collection) {
	if( error ) callback(error)
	else {
            quizz_collection.find().toArray(function(error, results) {
		if( error ) callback(error)
		else callback(null, results)
            });
	}
    });
};

QuizzProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, quizz_collection) {
	if( error ) callback(error)
	else {
            quizz_collection.findOne({_id: quizz_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
		if( error ) callback(error)
		else callback(null, result)
            });
	}
    });
};

QuizzProvider.prototype.updateWithId = function(id, data_to_up, callback) {
    this.getCollection(function(error, quizz_collection) {
	quizz_collection.findOne({_id: quizz_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, res) {
	    res.choice[parseInt(data_to_up)].vote = res.choice[parseInt(data_to_up)].vote + 1;	    

	    console.log(res);
	    quizz_collection.save(res);
	    callback(null, null);
	});	    
    });
};

QuizzProvider.prototype.remove = function(id, callback) {
    this.getCollection(function(error, quizz_collection) {
	quizz_collection.remove({_id : quizz_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(err, res) {
	    callback(null, res);
	});
    });
};

QuizzProvider.prototype.save = function(quizzs, callback) {
    this.getCollection(function(error, quizz_collection) {
	if( error ) callback(error)
	else {
            if( typeof(quizzs.length)=="undefined")
		quizzs = [quizzs];

            for( var i =0;i< quizzs.length;i++ ) {

		quizz = quizzs[i];
		quizz.created_at = new Date();
		if( quizz.comments === undefined ) quizz.comments = [];
		for(var j =0;j< quizz.comments.length; j++) {
		    quizz.comments[j].created_at = new Date();
		}
            }

            quizz_collection.insert(quizzs, function() {
		callback(null, quizzs[0]);
            });
	}
    });
};

exports.QuizzProvider = QuizzProvider;