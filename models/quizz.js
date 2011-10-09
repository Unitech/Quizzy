var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

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
		console.log('New quizz created = ' + quizzs[i].title);
		quizz = quizzs[i];
		quizz.created_at = new Date();
		if( quizz.comments === undefined ) quizz.comments = [];
		for(var j =0;j< quizz.comments.length; j++) {
		    quizz.comments[j].created_at = new Date();
		}
            }

            quizz_collection.insert(quizzs, function() {
		callback(null, quizzs);
            });
	}
    });
};

exports.QuizzProvider = QuizzProvider;