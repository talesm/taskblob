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

	$('.importDialog').on(
					'change',
					'.importFile',
					function() {
						var selectedFile = $(this).get(0).files[0];
						console.log('Importing: ' + selectedFile.name);
						var reader = new FileReader();
						reader.onload = function(e) {
							var tasksJSON = JSON.parse(e.target.result);
							if (Array.isArray(tasksJSON)) {
								if (confirm("O arquivo parece estar em um formato obsoleto (V1.0.0.0), deseja tentar uma conversão?")) {
									var obsoleteFormat = tasksJSON;
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
									tasksJSON = {
										version : [ 1, 1, 0, 0 ],
										name : "ProjetoRecuperado",
										description : "Projeto recuperado da versão 1.0.0.0 para 1.1.0.0",
										tasks : obsoleteFormat
									};
								} else
									return;
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