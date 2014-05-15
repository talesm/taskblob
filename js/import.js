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
			//console.log(e.target.result);
			tasks = JSON.parse(e.target.result, function(k, v) {
				if(v.id !== undefined){
					return $.extend(new Task(), v);
				}
				return v;
			});
			$viewGroup = $('.viewGroup'); 
			$viewGroup.children('.task').detach();
			tasks.forEach(function(value) {
				addTaskChrono($viewGroup, value);
			});
			$('.importDialog').dialog('close');
		};
		reader.readAsText(selectedFile);
	});
});