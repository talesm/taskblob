/**
 * @file Project.js An special group.
 */

Project.prototype = Object.create(Group.prototype);
Project.prototype.constructor = Project;

/*******************************************************************************
 * The Project class
 * 
 * @constructor
 * @base Group
 */
function Project(name, descritpion) {
	Group.call(this, [], name, descritpion);
	this.version = [ 1, 1, 0, 0 ];
}

Project.prototype.get = function(path) {
	var container = this;
	for (var i = 0; i < path.length; ++i) {
		var index = path[i]-1;
		if(index >= container.size())
			return null;
		container = container.subTasks[index];
	}
	return container;
};

/**
 * Parses a dried representation into current projects. It erases all previous
 * data.
 * 
 * @param {Object}
 *            dried - The object to wet.
 * @returns {Project}
 * 
 * Observes it does only executes for projects dried by this exact version,
 * otherwise it must pre-processes using a converter.
 */
Project.wet = function(dried) {
	var lVersion = [1, 1, 0, 0];
	if(!dried.version || dried.version.some(function(element, i) {
		return element != lVersion[i];
	}));
	var project = new Project(dried.name, dried.description);
	var tasks = dried.tasks.reduce(function(tasks, driedTask, ind){
		var task = null;
		if(driedTask){
			if(driedTask.subTasks){
				//task = new Group([ind+1], driedTask.name, driedTask.description);
				throw "NOT IMPLEMENTED YET"; //TODO Implement this recursively.
			}
			else
				task = new Task([ind+1], driedTask.name|| 'TRUNCATED', driedTask.description || '', driedTask.duration || 0, driedTask.spent || 0);
			task.dependencies = driedTask.dependencies;
			task.parent = project;
			task.closed = driedTask.closed;
		}
		tasks.push(task);
		return tasks;
	}, []);
	project.subTasks = tasks;
	tasks.forEach(function name(task) {
		if(!task)
			return;
		var dependencies = task.dependencies;
		task.dependencies = [];
		dependencies.forEach(function(path) {
			if(!task.addDependency(project.get(path))){
				throw 'Format Error: Task ['+task.id.join('.')+'] has unreachable dependency ['+path.join('.')+']'; 
			}
		});
	});
	return project;
};

/**
 * Converts the project to a a dry representation, safe to be stored as JSON.
 * 
 * @returns {Object}
 */
Project.prototype.dry = function() {
	/**
	 * @param {Item} item - The item to dry.
	 * @returns {Object}
	 */
	function dry(item) {
		if (!item)// Deleted
			return null;
		var driedItem = {
			name : item.name,
			description : item.description,
			closed : item.closed,
			dependencies : item.dependencies.reduce(function(ids, dependency) {
				ids.push(dependency.id);
				return ids;
			}, [])
		};

		if (item.subTasks) {// Group
			driedItem.subTasks = item.subTasks.reduce(
					function(driedTasks, task) {
						driedTasks.push(dry(task));
						return driedTasks;
					}, []);
		} else {
			driedItem.duration = item.duration;
			driedItem.spent = item.spent;
		}
		return driedItem;
	}

	return {
		version : this.version,
		name : this.name,
		description : this.description,
		tasks : this.subTasks.reduce(function(driedTasks, task) {
			driedTasks.push(dry(task));
			return driedTasks;
		}, [])
	};
};