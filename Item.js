/**
 * @file Item.js
 * @author TalesM
 * 
 * Defines the item class
 */

/**
 * The Item class
 * @constructor
 * @param {Array} id - the path.
 * @param {Item|null} [parent] - the parent
 * @param {String} [name] - the name
 * @param {String} [description] - the description
 * @param {Item[]} [dependencies] - an array of dependencies 
 */
function Item(id, parent, name, description, dependencies){
	this.id = id;
	this.parent = parent || null;
	this.name = name || '';
	this.description = description || '';
	this.dependencies = [];
	this.dependents = [];
	if(dependencies){
		dependencies.forEach(function(other) {
			if(other && other instanceof Item && this.dependencies.indexOf(other) === -1){
				this.dependencies.push(other);
				other.dependents.push(this);
			}
		}, this);
	}
}

/**
 * Returns whether this task depends to the given one.
 * @param {Item} task - The item to search
 * @returns {Boolean}
 */
Item.prototype.hasDependency = function(task){
	var pos = this.dependencies.indexOf(task);
	return (pos != -1) || (!!this.parent && this.parent.hasDependency(task)); 
};

/**
 * Returns whether the given task depends from this one.
 * @param {Item} task - The item to search
 * @returns {Boolean}
 */
Item.prototype.hasDependent = function(task){
	return this.dependents.indexOf(task) != -1;
};

/**
 * Add a new dependency
 * @param {Item} task
 * @returns {Boolean}
 */
Item.prototype.addDependency = function(task){
	if(this.hasDependency(task) || this.hasDependent(task))
		return false;
	this.dependencies.push(task);
	task.dependents.push(this);
	return true;
};

/**
 * Remove a dependency
 * @param {Item} task
 * @returns {Boolean}
 */
Item.prototype.removeDependency = function(task){
	var pos = this.dependencies.indexOf(task);
	if(pos == -1)
		return false;
	this.dependencies.splice(pos, 1);
	var opos = task.dependents.indexOf(this);
	if(opos == -1)
		return false;
	task.dependents.splice(opos, 1);
	return true;
};

Item.prototype.erase = function() {
	//Eliminate dependencies:
	this.dependencies.forEach(function(dependency) {
		var pos = dependency.dependent.indexOf(this);
		if(pos != -1)
			dependency.dependent.splice(pos, 1);
	}, this);
	this.dependents.forEach(function(dependent) {
		var pos = dependent.dependency.indexOf(this);
		if(pos != -1)
			dependent.dependency.splice(pos, 1);
	}, this);
	this.parent.removeKid(this);
};