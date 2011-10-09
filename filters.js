
var utils = require('./utils.js');

exports.beforeFilterReformat = function(req, res, next) {
    var choices = req.param('choice');
    var reformated = [];
    
    if (utils.isArray(choices) != true) {
	var tmp = choices;
	choices = [];
	choices[0] = tmp;
    }

    choices.forEach(function(val, i, array) {
	reformated[i] = {content : val, vote : 0, id : i};
    });
    req.params.choice = reformated;
    next();    
};