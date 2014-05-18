/**
 * 
 */
$(function() {
	$('.viewGroup').on('click', '.taskName .delete', function() {
		var $task=$(this).closest('.item');
		var path = makeItemPath($task.attr('id'));
		var task = tasks.get(path);
		if(window.confirm('Tem certeza que deseja apagar a tarefa #'+task.id.join('.')+'('+task.name+')?')){
			var renewed = task.dependents.concat(task.parent?[task.parent]:[]);
			task.erase();
			$task.remove();
			refreshItems(renewed);
		}
	});
});