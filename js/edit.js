/**
 * 
 */

$(function() {
	var $editTask = $('.editTask');
	// Add new task
	$('.add').on('click', function() {
		$editTask.find('#taskPath').val((tasks.size() + 1));
		$editTask.find('#closed').parent().css('display', 'none');
		$editTask.dialog('option', 'title', 'Adicionar Nova Tarefa');
		$editTask.dialog("open");
	});
	$('.addButton').button({icons : {primary : 'ui-icon-circle-plus'}});

	var $viewSection = $('.viewSection');
	// Edit
	$viewSection.on('click', '.taskName .edit', function() {
		var sid = $(this).parent().parent().attr('id').substr(5).replace('_', '.');
		var task = tasks.get(id2path(sid));
		$editTask.find('#taskPath').val(sid);
		$editTask.find('#taskName').val(task.name);
		$editTask.find('#description').val(task.description);
		$editTask.find('#duration').val(task.duration);
		$editTask.find('#spent').val(task.spent);
		$editTask.find('#closed').prop('checked', task.closed);
		$editTask.find('#closed').attr('disabled', false);
		$editTask.find('#dependencies').val(linearizeDep(task.dependencies));
		$editTask.find('#dependsMe').val(linearizeDep(task.dependents));
		$editTask.dialog('option', 'title', 'Editar Tarefa');
		$editTask.dialog("open");
	});

	function linearizeDep(dep) {
		return dep.map(function(dp) {
			return dp.id.join('.');
		}).join(', ');
	}

	$('.editTask').dialog(
			{
				width : 500,
				autoOpen : false,
				modal : true,
				buttons : {
					'Salvar' : function() {
						$this = $(this);
						var id = id2path($this.find('#taskPath').val());
						var name = $this.find('#taskName').val();
						var description = $this.find('#description').val();
						var duration = +$this.find('#duration').val();
						var spent = +$this.find('#spent').val();
						var closed = $this.find('#closed').is(':checked');
						var dependStr = $this.find('#dependencies').val();
						var dependencies = [];
						dependStr.split(',').forEach(function(value, index) {
							if (value === '')
								return;
							dependencies.push(tasks.get(id2path(value)));
						});
						if (id.length > 1)
							throw 'Unsupported';
						var $viewGroup = $(".viewGroup");
						if (id[0] > tasks.size()) { // Adding
							var task = new Task([ tasks.size() + 1 ], name,
									description, duration, spent, null,
									dependencies);
							tasks.addKid(task);
							addTaskChrono($viewGroup, task);
						} else { // Editing
							var task = tasks.get(id);
							task.name = name;
							task.description = description;
							task.duration = duration;
							task.spent = spent;
							task.closed = closed;
							// Erasing:
							// 1.Put on trash all current dependencies
							var trash = task.dependencies.slice();
							// 2.Remove from trash the ones who are re-added.
							dependencies.forEach(function(dependency) {
								var j = trash.indexOf(dependency);
								if (j != -1)
									trash.splice(j, 1);
							});
							// 3.Remove the others
							trash.forEach(function(dependency) {
								task.removeDependency(dependency);
							});
							// Adding
							dependencies.forEach(function(dependency) {
								if (dependency)
									task.addDependency(dependency);
							});

							// Show again
							editTaskChrono($viewGroup, task);
							task.dependents.forEach(function(dependent) {
								editTaskChrono($viewGroup, dependent);
							});
						}
						$this.dialog("close");
					},
					'Cancelar' : function() {
						$(this).dialog("close");
					}
				},
				close : function() {
					$editTask.find('#closed').parent().css('display', '');
					$editTask.find('#duration').parent().css('display', '');
					$editTask.find('#spent').parent().css('display', '');
					$('.editTask form').each(function() {
						this.reset();
					});
				}
			});
});