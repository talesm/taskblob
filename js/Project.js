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
 ******************************************************************************/
function Project(name, descritpion) {
	Group.call(this, [], name, descritpion);
	this.version = [ 1, 1, 0, 0 ];
}

/**
 * @param {Array} path
 * @returns {Item}
 */
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
	project.subTasks = wetter(project, dried.tasks);
	project.subTasks.forEach(resolveDependencies);
	return project;
	/**
	 * @param {Group} parent
	 * @param {Array} items
	 * @returns {Array} 
	 */
	function wetter(parent, items){
		return items.reduce(function(tasks, driedTask, ind){
			var item = null;
			if (driedTask) {
				if (driedTask.subTasks) {
					item = new Group(parent.id.concat([ ind + 1 ]),
							driedTask.name || 'TRUNCATED', driedTask.description || '',
							driedTask.closed);
					item.subTasks = wetter(item, driedTask.subTasks);
				} else{
					item = new Task(parent.id.concat([ ind + 1 ]),
							driedTask.name || 'TRUNCATED',
							driedTask.description || '',
							driedTask.duration || 0, driedTask.spent || 0,
							driedTask.closed);
				}
				item.parent = parent;
				item.dependencies = driedTask.dependencies;
			}
			tasks.push(item);
			return tasks;
		}, []);
	}
	/**
	 * @param {Item} item - the item.
	 */
	function resolveDependencies(item) {
		if(!item)
			return;
		var dependencies = item.dependencies;
		item.dependencies = [];
		dependencies.forEach(function(path) {
			if(!item.addDependency(project.get(path))){
				throw Error('Format Error: Task ['+item.id.join('.')+'] has unreachable dependency ['+path.join('.')+']'); 
			}
		});
		if(item.subTasks)
			item.subTasks.forEach(resolveDependencies);
	}
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