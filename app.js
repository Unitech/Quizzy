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
    res.render('index');
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
    	    title : 'Ok'
    	});
    });
});

app.get('/quizz/new', function(req, res) {
    res.render('quizz_new');
});

app.post('/quizz/new', filters.beforeFilterReformat, function(req, res) {
    quizzProvider.save({
	title : req.param('title'),
	body : req.param('body'),
	choice : req.param('choice'),
	url_id : utils.generateId(5)
    }, function(err, quizz) {
	res.redirect('/quizz');
    });
});

app.get('/view/:quizz_id', function(req, res) {
    quizzProvider.find({url_id : req.params.quizz_id}, function(err, quizz) {
	res.render('view_result_quizz', {
	    quizz_inspect : utils.node.inspect(quizz),
	    quizz : quizz
	});
    });
});

app.get('/:quizz_id', function(req, res) {
	quizzProvider.find({url_id : req.params.quizz_id}, function(err, quizz) {
	    // No difference between real screen and mobile phone ATM (work good atm)
	    if (utils.isMobile(req) == true) {
		res.render('show_quizz', {
		    quizz : quizz,
		    layout : false
		});
	    }
	    else {
		res.render('show_quizz', {
		    quizz : quizz,
		    layout : false
		});
	    }
	});
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
