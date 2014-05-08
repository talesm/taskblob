/**
 * 
 */
$(function() {
	$('.showExport').click(function(){
		createModal('.exportDialog', {closeButton: true});
	});
	
	$('.textExport').click(function() {
        var blob = new Blob([JSON.stringify(tasks)], {'type':'application/json'});
		$('a.textExport').attr('href', window.URL.createObjectURL(blob));
	});
	
	$('.textExport').click(function() {
        var blob = new Blob([JSON.stringify(tasks)], {'type':'application/json'});
		$('a.textExport').attr('href', window.URL.createObjectURL(blob));
	});
});