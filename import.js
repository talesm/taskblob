/**
 * 
 */
$(function() {
	$('.showImport')
	.button({icons:{primary:'ui-icon-arrowthick-1-n'}})
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
			console.log(e.target.result);
			$('.importDialog').dialog('close');
//			alert('Arquivo Importado com sucesso');
		};
		reader.readAsText(selectedFile);
	});
});