/**
 * 
 */
$(function() {
	$('.showExport')
	.button({icons:{primary:'ui-icon-circle-arrow-s'}})
	.click(function(){
		$('.exportDialog').dialog('open');
	});
	
	$('.exportDialog').dialog({
		autoOpen: false,
		modal:true,
	});
	
	$('.exportDialog').on('click', '.textExport', function() {
        var blob = new Blob([JSON.stringify(tasks.dry())], {'type':'application/json'});
		$(this).attr('href', window.URL.createObjectURL(blob));
	});
});