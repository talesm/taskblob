/**
 * 
 */
$(function() {
	var $playTask=$('.playTask');
	$playTask.dialog({
		width: 500,
		autoOpen : false,
		modal : true,
		buttons: {
			'Fechar': function() {
				$playTask.dialog('close');
			}
		}
	});
	
	$('.popMenu').on('click', '.play', function() {
		var path = $(this).closest('.popMenu').attr('data-itemid').split('.');
		var task = tasks.get(path );
		$playTask.find('#playPath').val(path.join('.'));
		$playTask.find('#playName').val(task.name);
		$playTask.find('#playDescription').val(task.description);
		var status;
		if(task.isClosed())
			status = "Fechada";
		else if(task.overdue() > 0)
			status = "Atrasada";
		else if(task.spentReg() > 0)
			status = "Iniciada";
		else if(task.isReady())
			status = "Pronta";
		else
			status = "Aguardando";
		$playTask.find('#playStatus').val(status);
		$playTask.find('#playRemaining').val(task.remaining());
		$playTask.dialog("open");
	});
	
	$('.viewGroup').on('click', '.play', function() {
		var path = makeItemPath($(this).closest('.item').attr('id'));
		var task = tasks.get(path );
		$playTask.find('#playPath').val(path.join('.'));
		$playTask.find('#playName').val(task.name);
		$playTask.find('#playDescription').val(task.description);
		var status;
		if(task.isClosed())
			status = "Fechada";
		else if(task.overdue() > 0)
			status = "Atrasada";
		else if(task.spentReg() > 0)
			status = "Iniciada";
		else if(task.isReady())
			status = "Pronta";
		else
			status = "Aguardando";
		$playTask.find('#playStatus').val(status);
		$playTask.find('#playRemaining').val(task.remaining());
		$playTask.dialog("open");
	});
	
});

