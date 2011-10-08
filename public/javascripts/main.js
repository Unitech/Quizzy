
function auto_select_menu() {
    $('#menu li').each(function(){
	if ($(this).children().attr('href') == window.location.pathname)
	    $(this).addClass('selected');
    });
}

$().ready(function() {
    auto_select_menu();
});