/**
 * 
 */
$(function() {
	$('.viewGroup, .popMenu').on('click', '.collapse', function(ev){
		ev.preventDefault();
		var $this=$(this);
		var path = $this.closest('.item, .popMenu').attr('data-itemid').split('.');
		var $item = $('#' + makeItemName(path));
		$item.toggleClass('collapsed');
		$this.closest('.popMenu').hide('fast');
//		$this.closest('.itemButtons').children().toggle('collapsed')
		$this.children('span .ui-icon-folder-open').toggle();
	});
});