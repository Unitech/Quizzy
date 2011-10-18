/**
 * Module dependencies.
 */

var express = require('express');

//console.log();

/**** Includes ****/
var app = module.exports = express.createServer();
require('./configuration.js')(app);

var url_site, url_socket;
console.log('Quizzy launched in %s', app.settings.env);
if (app.settings.env == 'production') {
    url_site = process.env.URL_QUIZZY;
    url_socket = process.env.URL_QUIZZY_SOCKET;
}
else {
    url_site = 'http://localhost:3000';
    url_socket = 'http://localhost:3001';
}

var quizzProvider = new (require('./models/quizz.js').QuizzProvider)('localhost', 27017, url_site);

var utils = require('./utils.js');
var filters = require('./filters.js');

/**** Global variables ****/
var clients = [];

function debug_clients(clients) {
    for (var i = 0; i < clients.length; i++) {
	console.log('Client present = ' + clients[i].url_id);
    }
}

/***** Results IO ******/
var io = require('socket.io').listen(3001);

io.sockets.on('connection', function (socket) {
    socket.on('new', function (data) {
	var tmp = {'url_id' : data.url_id, 
		   'socket' : socket};
	clients.push(tmp);	
    });
    socket.on('disconnect', function () {
	console.log('Client n ' + socket.id + ' disconnected');
	for (var i = 0; i < clients.length; i++) {
	    console.log('1 = ' + clients[i].socket.id
			+ ' 2 = ' + socket.id);
	    if (clients[i].socket.id == socket.id) {
		console.log('Before');
		debug_clients(clients);
		
		//clients.pop(clients[i]);
		clients.splice(clients[i], 1);
		console.log('After');
		debug_clients(clients);
		break;
	    }
	}
    });
});


// Routes
app.get('/', function(req, res){
    //console.log(utils.node.inspect(app));
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
	url_id : utils.generateId(5),
	id_prot : req.param('id_prot')
    }, function(err, quizz) {
	// Success
	res.redirect('/a/' + quizz.url_id);
    });
});


/***** Quizz controller ******/

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
	    url_socket : url_socket,
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
    var quizz_id = req.param('quizz_id');
    var choice_id = req.param('choice_id');

    console.log('New vote on quizz ' + quizz_id);

    debug_clients(clients);    

    quizzProvider.incrementVoteNbById(quizz_id, choice_id, function(err, quizz) {	
	if (err == null) {
	    for (var i = 0; i < clients.length; i++) {
		if (clients[i].url_id == quizz_id) {
		    var dt = {
			'vote_id' : choice_id,
			'vote_nb' : quizz.choice[choice_id].vote,
			'success' : true
		    };
		    clients[i].socket.emit('newvote', dt);		    
		}
	    }
	}
	else {

	    res.send({'success':false});
	}
	res.send({'success':true});
    });
});


// 404
// app.get('*', function(req, res) {
//     res.send('404 Not found');
// });

app.listen(3000);
//console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
