/**
 * 
 */
$(function() {
	$('.showImport').click(function(){
		createModal('.importDialog', {closeButton: true});
	});
	$('.modal').on('click', '.textImport', function () {
		var selectedFile = $('.importFile').get(0).files[0];
		alert(selectedFile.name);
		var reader = new FileReader();
		reader.onload = function(e) {
			alert(e.target.result);
		};
		reader.readAsText(selectedFile);
	});
});