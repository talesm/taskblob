/**
 * 
 */
$(function() {
	var $playTask=$('.playTask');
	$playTask.dialog({
		width: 600,
		autoOpen : false,
		modal : true,
		buttons: {
			'Fechar': function() {
				$playTask.dialog('close');
			}
		}
	});
	
	$('.viewGroup').on('click', '.task .play', function() {
		var sid = $(this).parent().parent().attr('id').substr(5).replace('_', '.');
		viewTask(sid);
	});
	
	$('.viewGroup').on('dblclick', '.task .taskName', function() {
		var sid = $(this).parent().attr('id').substr(5).replace('_', '.');
		viewTask(sid);
	});
	function viewTask(sid){
		var task = tasks.get(id2path(sid));
		$playTask.find('#playPath').val(sid);
		$playTask.find('#playName').val(task.name);
		$playTask.find('#playDescription').val(task.description);
		$playTask.find('#playStatus').val(task.closed?'Fechada': 'Aberta');
		$playTask.find('#playRemaining').val(task.remaining());
		$playTask.dialog("open");
	}
});

