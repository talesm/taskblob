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
 */
Project.prototype.wet = function(text) {
	throw "Stub";
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