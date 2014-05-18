/**
 * 
 */
$(function() {
	$('.viewGroup').on('click', '.taskName .delete', function() {
		var $task=$(this).closest('.item');
		var path = makeTaskPath($task.attr('id'));
		var task = tasks.get(path);
		if(window.confirm('Tem certeza que deseja apagar a tarefa #'+task.id.join('.')+'('+task.name+')?')){
			var renewed = task.dependents;
			task.erase();
			renewed.forEach(function(path){
				var dtask = getTask(path);
				editTaskChrono(dtask, $task.parent());
			});
			$task.remove();
		}
	});
});