/**
 * 
 */
$(function() {
	$('.modal').on('click', '.close', closeDialog);
	$('.modal').on('focusout', closeDialog);
	$('.modal').on('click', closeDialog);

	$('.modal').on('click', 'section', function(event) {
		event.stopPropagation();
	});
});

function createModal(elementName, options) {
	if(!options){
		options = {};
	}
	var modal = $('.modal');
	modal.html('');
	modal.html($(elementName).clone());
	modal.find(':not(:disabled)').focus();
	
	for(var option in options){
		switch (option) {
		case 'closeButton':
			modal.find('header').append('<button class="close">Fechar</button>');
			break;
		default:
			break;
		}
	}
}

function closeDialog() {
	$('.modal').html('');
}