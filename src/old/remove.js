/**
 * 
 */
$(function() {
	$('.popMenu').on('click', '.delete', function() {
		var path = $(this).closest('.popMenu').attr('data-itemid').split('.');
		var $task=$('#' + makeItemName(path));
		var task = tasks.get(path);
		if(window.confirm('Tem certeza que deseja apagar a tarefa #'+task.id.join('.')+'('+task.name+')?')){
			var renewed = task.dependents.concat(task.parent?[task.parent]:[]);
			task.erase();
			$task.remove();
			refreshItems(renewed);
		}
	});
});