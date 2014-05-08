/**
 * 
 */
$(function() {
	$('.showImport').click(function(){
		createModal('.importDialog', {closeButton: true});
	});
	$('.modal').on('click', '.textImport', function () {
		var selectedFile = $('.importFile').get(0).files[0];
		var reader = new FileReader();
		alert(selectedFile.name);
		alert(reader.readAsText(selectedFile));
	});
});