
$().ready(function() {
    $('#add-choice').click(function() {
	$('#choices').append('<label for="body">Choix</label><input type="text" id="ch" name="choice"/>  <br/>');
    });
});