var socket = io.connect('<%= url_site %>:3001');

// Close socket when leaving the page
window.onunload = function() {
    socket.disconnect();
}

$().ready(function() {    
    // Send the Quizzy's ID
    socket.emit('new', {'url_id' : $('#url_id').val() });
    // Wait for vote belonging to the quizzy
    socket.on('newvote', function(data) {
	if (data.success == true) {
	    var tmp = $('#choice-' + data.vote_id);
	    tmp.text(data.vote_nb);
	}
	else {
	    alert('Error');
	}
    });
});