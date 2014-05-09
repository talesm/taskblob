/**
 * 
 */
$(function() {
	$('.showExport').click(function(){
		createModal('.exportDialog', {closeButton: true});
	});
	
	$('.modal').on('click', '.textExport', function() {
        var blob = new Blob([JSON.stringify(tasks)], {'type':'application/json'});
		$('a.textExport').attr('href', window.URL.createObjectURL(blob));
	});
});