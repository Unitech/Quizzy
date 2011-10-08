
Utils = function(){};

Utils.prototype.generateId = function(elements) {
    elements |= 5;
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < elements; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

Utils.prototype.isArray = function(obj) {
    if (obj.constructor.toString().indexOf("Array") == -1)
	return false;
    else
	return true;
}

exports.Utils = Utils;