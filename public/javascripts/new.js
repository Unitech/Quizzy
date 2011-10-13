
var numb = 2;

$().ready(function() {
    $('#add-choice').click(function() {
	if (numb == 5) {
	    
	}
	else {
	    var elem = $('<label for="body">Choice n°' + 
			 numb + 
			 '</label><input type="text" id="ch" name="choice"/> <br/>');
	    elem.hide();
	    $('#choices').append(elem);
	    elem.fadeIn();
	    numb++;
	    if (numb == 5) {
		$('#add-choice').fadeOut();
	    }
	}
    });

});