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
		var path = (tasks.size() + 1);
		$editTask.find('#taskPath').val(path);
		$editTask.find('#taskName').val('Tarefa' + path);
		$editTask.find('#type').val('task');
		$editTask.find('#closed').parent().css('display', 'none');
		$editTask.dialog('option', 'title', 'Adicionar Nova Tarefa');
		$editTask.dialog("open");
	});

	// Add new group
	$('.addGroup').on('click', function() {
		var path = (tasks.size() + 1);
		$editTask.find('#taskPath').val(path);
		$editTask.find('#taskName').val('Grupo' + path);
		$editTask.find('#type').val('group');
		$editTask.find('#closed').parent().css('display', 'none');
		$editTask.find('#duration').parent().css('display', 'none');
		$editTask.find('#spent').parent().css('display', 'none');
		$editTask.dialog('option', 'title', 'Adicionar Novo Grupo');
		$editTask.dialog("open");
	});
	
	//Add new subTask
	$viewSection.on('click', '.taskName .addSubTask', function() {
		var group = tasks
				.get(makeItemPath($(this).closest('.item').attr('id')));
		var path = group.id.join('.') + '.' + (group.subTasks.length + 1);
		$editTask.find('#taskPath').val(path);
		$editTask.find('#taskName').val('Tarefa' + path);
		$editTask.find('#type').val('task');
		$editTask.find('#closed').parent().css('display', 'none');
		$editTask.dialog('option', 'title', 'Adicionar Nova Tarefa');
		$editTask.dialog("open");
	});
	
	//Add new subGroup
	$viewSection.on('click', '.taskName .addSubGroup', function(){
		var group = tasks
		.get(makeItemPath($(this).closest('.item').attr('id')));
		var path = group.id.join('.') + '.' + (group.subTasks.length + 1);
		$editTask.find('#taskPath').val(path);
		$editTask.find('#taskName').val('Grupo' + path);
		$editTask.find('#type').val('group');
		$editTask.find('#closed').parent().css('display', 'none');
		$editTask.find('#duration').parent().css('display', 'none');
		$editTask.find('#spent').parent().css('display', 'none');
		$editTask.dialog('option', 'title', 'Adicionar Novo Grupo');
		$editTask.dialog("open");
	});

	// Edit a task
	$viewSection.on('click', '.taskName .edit', function() {
		var path = makeItemPath( $(this).closest('.item').attr('id'));
		var item = tasks.get(path);
		$editTask.find('#taskPath').val(path.join('.'));
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

	function linearizeDep(dep) {
		return dep.map(function(dp) {
			return dp.id.join('.');
		}).join(', ');
	}
	
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
		var parent = tasks.get(id.slice(0, id.length-1));
		if (id[id.length-1] > parent.size()) { // Adding
			addItem(type, parent, name, description, dependencies, duration, spent);
		} else { // Editing
			setItem(type, id, name, description, dependencies, duration, spent, closed);
		}
		$this.dialog("close");
	}
	
	/**
	 * @param {String} type
	 * @param {Group} parent
	 * @param {String} name
	 * @param {String} description
	 * @param {Item[]} dependencies
	 * @param {Number} duration
	 * @param {Number} spent 
	 */
	function addItem(type, parent, name, description, dependencies, duration, spent){
		if (type === 'task') {
			var newTask = new Task(parent.id.concat([ parent.size() + 1 ]), name, description,
					duration, spent, false, dependencies);
			parent.addKid(newTask);
			addTaskChrono(newTask);
			
		} else if (type === 'group') {
			var newGroup = new Group([ parent.size() + 1 ], name,
					description, false, dependencies);
			parent.addKid(newGroup);
			addGroupChrono(newGroup);
		} else
			throw Error("Unknown item type");
		refreshItems([parent]);
	}
	
	/**
	 * @param {String} type
	 * @param {Array} id
	 * @param {String} name
	 * @param {String} description
	 * @param {Item[]} dependencies
	 * @param {Number} duration
	 * @param {Number} spent 
	 */
	function setItem(type, id, name, description, dependencies, duration, spent, closed){
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
		refreshItems([item]);
	}
});