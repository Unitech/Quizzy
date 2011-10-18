

// Close socket when leaving the page
window.onunload = function() {
    socket.disconnect();
}

$().ready(function() {    
    // Send the Quizzy's ID
    socket.emit('new', {'url_id' : $('#url_id').val() });
    // Wait for vote belonging to the quizzy
    socket.on('reconnect', function(data) {
	socket.emit('new', {'url_id' : $('#url_id').val() });
    });
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