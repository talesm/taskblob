/**
 * 
 */
$(function() {
	$('.showImport')
	.button({icons:{primary:'ui-icon-circle-arrow-n'}})
	.click(function(){
		$('.importDialog').dialog('open');
	});
	
	$('.importDialog').dialog({
		autoOpen: false,
		modal:true,
	});
	
	$('.importDialog').on('click', '.textImport', function () {
		$('.importDialog .importFile').click();
	});
	
	$('.importDialog').on('change', '.importFile', function () {
		var selectedFile = $(this).get(0).files[0];
		console.log('Importing: ' + selectedFile.name);
		var reader = new FileReader();
		reader.onload = function(e) {
			var tasksJSON = JSON.parse(e.target.result);
			if(Array.isArray(tasks)){
				throw "Importing version 1.0 is not supported";
			}
			tasks = Project.wet(tasksJSON);
			$viewGroup = $('.viewGroup'); 
			$viewGroup.children('.task').remove();
			tasks.subTasks.forEach(function(value) {
				addTaskChrono($viewGroup, value);
			});
			$('.importDialog').dialog('close');
		};
		reader.readAsText(selectedFile);
	});
});