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
				editor.unload();
			}
		}
	});
	// Configuring the description editor
	var editor = new EpicEditor({
		container : 'playFormattedDescription',
		textarea : 'playDescription',
		basePath: 'ext',
		localStorageName: 'playDescription',
		button: false
	});
	
	//Button and context
	$('.viewGroup, .popMenu').on('click', '.play', function() {
		var path = $(this).closest('.item, .popMenu').attr('data-itemid').split('.');
		openView(path);
	});
	
	function openView(path) {
		var task = tasks.get(path );
		$playTask.find('#playPath').val(path.join('.'));
		$playTask.find('#playName').val(task.name);
		$playTask.find('#playDescription').val(task.description);//TODO Editable...
		
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
		editor.load().preview();
	}
	
});

