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
		$this.children('span .ui-icon-folder-open').toggle();
	});
	$('.viewGroup').on('dblclick', '.taskName', function(ev){
		var $this=$(this);
		var path = $this.closest('.item').attr('data-itemid').split('.');
		var item=tasks.get(path);
		if(!item || !item.subTasks)
			return;
		var $item = $('#' + makeItemName(path));
		$item.toggleClass('collapsed');
		$this.children('span .ui-icon-folder-open').toggle();
	});
});