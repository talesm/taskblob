/**
 * 
 */

$(function() {
	$('.addButton').button({
		icons : {
			primary : 'ui-icon-circle-plus'
		}
	});
	var $editTask = $('.editTask');
	var $viewSection = $('.viewSection');

	// Add new task
	$('.add').on('click', function() {
		$editTask.find('#taskPath').val((tasks.size() + 1));
		$editTask.find('#type').val('task');
		$editTask.find('#closed').parent().css('display', 'none');
		$editTask.dialog('option', 'title', 'Adicionar Nova Tarefa');
		$editTask.dialog("open");
	});

	// Add new group
	$('.addGroup').on('click', function() {
		$editTask.find('#taskPath').val((tasks.size() + 1));
		$editTask.find('#type').val('group');
		$editTask.find('#closed').parent().css('display', 'none');
		$editTask.find('#duration').parent().css('display', 'none');
		$editTask.find('#spent').parent().css('display', 'none');
		$editTask.dialog('option', 'title', 'Adicionar Novo Grupo');
		$editTask.dialog("open");
	});

	// Edit a task
	$viewSection.on('click', '.taskName .edit', function() {
		var sid = $(this).closest('.item').attr('id').substr(5).replace('_',
				'.');
		var item = tasks.get(id2path(sid));
		$editTask.find('#taskPath').val(sid);
		$editTask.find('#taskName').val(item.name);
		$editTask.find('#description').val(item.description);
		if(item.subTasks){
			$editTask.find('#type').val('group');
			$editTask.find('#duration').parent().css('display', 'none');
			$editTask.find('#spent').parent().css('display', 'none');
		}else {
			$editTask.find('#type').val('task');
			$editTask.find('#duration').val(item.duration);
			$editTask.find('#spent').val(item.spent);
		}
		$editTask.find('#closed').prop('checked', item.closed);
		$editTask.find('#dependencies').val(linearizeDep(item.dependencies));
		$editTask.find('#dependsMe').val(linearizeDep(item.dependents));
		$editTask.dialog('option', 'title', 'Editar Tarefa');
		$editTask.dialog("open");
	});

	function linearizeDep(dep) {
		return dep.map(function(dp) {
			return dp.id.join('.');
		}).join(', ');
	}

	$('.editTask').dialog({
		width : 500,
		autoOpen : false,
		modal : true,
		buttons : {
			'Salvar' : saveTask,
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
	function saveTask() {
		$this = $(this);
		var id = id2path($this.find('#taskPath').val());
		var type = $this.find('#type').val();
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
			throw Error('Unsupported');
		var $viewGroup = $(".viewGroup");
		if (id[0] > tasks.size()) { // Adding
			if (type === 'task') {
				var newTask = new Task([ tasks.size() + 1 ], name, description,
						duration, spent, false, dependencies);
				tasks.addKid(newTask);
				addTaskChrono($viewGroup, newTask);
			} else if (type === 'group') {
				var newGroup = new Group([ tasks.size() + 1 ], name,
						description, false, dependencies);
				tasks.addKid(newGroup);
				addGroupChrono($viewGroup, newGroup);
			} else
				throw Error("Unknown item type");
		} else { // Editing
			var item = tasks.get(id);
			item.name = name;
			item.description = description;
			if (type === 'task') {
				item.duration = duration;
				item.spent = spent;
			}
			item.closed = closed;
			// Erasing:
			// 1.Put on trash all current dependencies
			var trash = item.dependencies.slice();
			// 2.Remove from trash the ones who are re-added.
			dependencies.forEach(function(dependency) {
				var j = trash.indexOf(dependency);
				if (j != -1)
					trash.splice(j, 1);
			});
			// 3.Remove the others
			trash.forEach(function(dependency) {
				item.removeDependency(dependency);
			});
			// Adding
			dependencies.forEach(function(dependency) {
				if (dependency)
					item.addDependency(dependency);
			});

			// Show again
			var dirt = [item];//Need to be entirely re-evaluated
			var parents = {}; //Need only to be redrawn
			while(dirt.length){
				var dirtItem = dirt.pop();
				dirt = dirtItem.dependents.concat(dirt);
				if(dirtItem.subTasks){
					dirt = dirtItem.subTasks.concat(dirt);
					editGroupChrono($viewGroup, dirtItem);
				} else 
					editTaskChrono($viewGroup, dirtItem);
				if(dirtItem.parent && dirtItem.parent !== tasks){
					parents[dirtItem.parent] = false;
				}
			}
			var parentList = Object.keys(parents);
			while(parentList.length){
				var group = parentList.pop();
				if(group.parent && group.parent!==tasks && !parents[group.parent]){
					parentList = [group.parent].concat(parentList);
				}
				editGroupChrono($viewGroup, group);
				parents[group] = true;
			}
		}
		$this.dialog("close");
	}
});