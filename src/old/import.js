/**
 * 
 */
$(function() {
	$('.showImport').button({
		icons : {
			primary : 'ui-icon-circle-arrow-n'
		}
	}).click(function() {
		$('.importDialog').dialog('open');
	});

	$('.importDialog').dialog({
		autoOpen : false,
		modal : true,
	});

	$('.importDialog').on('click', '.textImport', function() {
		$('.importDialog .importFile').click();
	});

	$('.importDialog').on('change', '.importFile', function() {
		var selectedFile = $(this).get(0).files[0];
		console.log('Importing: ' + selectedFile.name);
		var reader = new FileReader();
		reader.onload = function(e) {
			var tasksJSON = text2driedTasks(e.target.result);
			tasks = Project.wet(tasksJSON);
			refreshView();
			$('.importDialog').dialog('close');
		};
		reader.readAsText(selectedFile);
	});
});

/**
 * Converts text to dried objects
 * @param {String} text
 * @returns {Object|null}
 */
function text2driedTasks(text) {
	var currentFormat = [ 1, 1, 0, 0 ];
	var driedTasks = JSON.parse(text);
	if (!driedTasks)
		throw Error("UnknownFileFormat");// TODO Handle it
	// Verifying if version is obsolete
	if (Array.isArray(driedTasks)) {
		if (confirm("O arquivo parece estar em um formato obsoleto (V1.0.0.0), deseja tentar uma conversão?")) {
			var obsoleteFormat = driedTasks;
			obsoleteFormat.forEach(function(element) {
				// The following would drive the current
				// version's loader to confusion whether
				// it is a group or task. Groups were
				// not implemented in version 1.0, but
				// were there as a stub. So is safet to
				// remove them all.
				if (element.subTasks)
					delete element.subTasks;
			});
			return {
				version : [ 1, 1, 0, 0 ],
				name : "ProjetoRecuperado",
				description : "Projeto recuperado da versão 1.0.0.0 para 1.1.0.0",
				tasks : obsoleteFormat
			};
		}
		return null;
	} else if (!driedTasks.version || !Array.isArray(driedTasks.version)
			|| driedTasks.version.length < 4) {// Format is compliant?
		throw Error("FileVersionNotDetected");// TODO Handle it
	} else if (driedTasks.version.slice(0, 3).some(function(element, index) {
		return element > currentFormat[index];
	}))
		throw Error("FileFormatNewer"); // TODO Handle it.
	else if (driedTasks.version[3] > currentFormat[3]) {// Patches may be
		// compatible, so ask
		if (!confirm("O arquivo parece estar em formato compatível, porém mais novo que o que utilizamos. Deseja continuar mesmo assim?"))
			return null;
	}
	return driedTasks;
}