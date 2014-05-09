/**
 * 
 */
$(function() {
	$('.modal').on('click', '.close', closeModal);
	$('.modal').on('click', closeModal);
	$('.modal').on('focusout', function(ev) {
		if($('.modal:focus').size() <= 0 && $(':focus').size() > 0)
			closeModal();
	});

	$('.modal').on('click', 'section', function(event) {
		event.stopPropagation();
	});
	
	document.onkeypress = function(ev) {
		if(ev.keyCode == 0x1B)
			closeModal();
	};
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

function closeModal() {
	$('.modal').html('');
}