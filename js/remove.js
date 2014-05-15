/**
 * 
 */
$(function() {
	$('.viewGroup').on('click', '.task .delete', function() {
		var $task=$(this).parent().parent();//TODO change to .closest()
		var path = makeTaskPath($task.attr('id'));
		var task = tasks.get(path);
		if(window.confirm('Tem certeza que deseja apagar a tarefa #'+task.id.join('.')+'('+task.name+')?')){
			var renewed = task.dependents;
			task.erase();
			renewed.forEach(function(path){
				var dtask = getTask(path);
				editTaskChrono($task.parent(), dtask);
			});
			$task.remove();
		}
	});
});