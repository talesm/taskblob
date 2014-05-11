/**
 * 
 */
$(function() {
	$('.viewGroup').on('click', '.task .delete', function() {
		var $task=$(this).parent().parent();
		var path = makeTaskPath($task.attr('id'));
		var task = getTask(path);
		if(window.confirm('Tem certeza que deseja apagar a tarefa #'+task.id.join('.')+'('+task.name+')?')){
			var renewed = task.dependsMe;
			task.erase();
			renewed.forEach(function(path){
				var dtask = getTask(path);
				editTaskChrono($task.parent(), dtask);
			});
			$task.detach();
		}
	});
});