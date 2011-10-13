
function auto_select_menu() {
    $('#menu li').each(function(){
	if ($(this).children().attr('href') == window.location.pathname)
	    $(this).addClass('selected');
    });
}

$().ready(function() {
    auto_select_menu();
});

function gup(name)
{
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( window.location.href );
    if( results == null )
	return undefined;
  else
      return results[1];
}