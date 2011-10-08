/**
 * Quizzy configuration
 */

// TO USE package.json : npm install -d

var express = require('express');

module.exports = function(app) {
    app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.session({ secret: 'your secret here' }));
	app.use(express.compiler({ src: __dirname + '/public', enable: ['sass'] }));
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
    });
    
    app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
    });
    
    app.configure('production', function(){
	app.use(express.errorHandler()); 
    });
}
