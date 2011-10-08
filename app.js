/**
 * Module dependencies.
 */

var express = require('express');
// util = require('util');

var quizzProvider = new (require('./models/quizz.js').QuizzProvider)('localhost', 27017);

var app = module.exports = express.createServer();

require('./configuration.js')(app);

var utils = new (require('./utils.js').Utils)();

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

function before_filter_reformat(req, res, next) {
    var choices = req.param('choice');
    var reformated = [];
    
    if (utils.isArray(choices) != true) {
	var tmp = choices;
	choices = [];
	choices[0] = tmp;
    }
    choices.forEach(function(val, i, array) {
	reformated[i] = {content : val, vote : 0};
    });
    req.params.choice = reformated;
    next();
}

app.post('/quizz/new', before_filter_reformat, function(req, res) {
    quizzProvider.save({
	title : req.param('title'),
	body : req.param('body'),
	choice : req.param('choice'),
	url_id : utils.generateId(5)
    }, function(err, quizz) {
	res.redirect('/quizz');
    });
});

// app.get('/:quizz_id', function(req, res) {
//     console.log(req.params.quizz_name);
//     res.render(
// });

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
