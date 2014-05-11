/**
 * 
 */
$(function(){
	$( document ).tooltip();
	$('.showSettings')
	.button({icons:{primary:'ui-icon-gear'}})
	.click(function(){
		$('.settingsDialog').dialog('open');
	});
	
	$('.settingsDialog').dialog({
		autoOpen: false,
		modal:true,
		width: 600,
	});
});