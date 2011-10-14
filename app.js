/**
 * Module dependencies.
 */

var express = require('express');
// util = require('util');

var quizzProvider = new (require('./models/quizz.js').QuizzProvider)('localhost', 27017);

var app = module.exports = express.createServer();

require('./configuration.js')(app);

var utils = require('./utils.js');
var filters = require('./filters.js');

// Routes
app.get('/', function(req, res){
    res.render('index', {
	title : 'Easy quizzing'
    });
});

app.get('/quizz/delete/:id', function(req, res) {
    quizzProvider.remove(req.params.id, function(err, quizz) {
	res.redirect('/quizz');
    });
});

app.get('/quizz', function(req, res) {
    quizzProvider.findAll(function(err, quizz) {
    	res.render('quizz_list', {
    	    allQuizz : quizz,
    	    title : 'List'
    	});
    });
});

app.get('/quizz/new', function(req, res) {
    res.render('quizz_new', {
	title : 'New'
    });
});

app.post('/quizz/new', filters.beforeFilterReformat, function(req, res) {
    quizzProvider.save({
	title : req.param('title'),
	body : req.param('body'),
	choice : req.param('choice'),
	url_id : utils.generateId(5)
	//id_prot : req.param('id_prot')
    }, function(err, quizz) {
	// Success
	res.redirect('/a/' + quizz.url_id);
    });
});

app.get('/a/:quizz_id', function(req, res) {
    quizzProvider.find({url_id : req.params.quizz_id}, function(err, quizz) {
	res.render('quizz_views/admin_quizz', {
	    quizz : quizz,
	    title : 'View results for ' + quizz.title
	});
    });
});

app.get('/r/:quizz_id', function(req, res) {
    quizzProvider.find({url_id : req.params.quizz_id}, function(err, quizz) {
	res.render('quizz_views/result_quizz', {
	    quizz : quizz,
	    title : 'View results for ' + quizz.title
	});
    });
});

app.get('/c/:quizz_id', function(req, res) {
    quizzProvider.find({url_id : req.params.quizz_id}, function(err, quizz) {
	res.render('quizz_views/client_quizz', {
	    quizz : quizz,
	    layout : false
	});
    });
});

/***** Public part *****/
app.post('/ajx/quiz', function(req, res) {
    quizzProvider.updateWithId(req.param('quizz_id'), req.param('choice_id'), function(err, quizz) {	
    	res.send({'success':true});
    });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
