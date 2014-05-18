/**
 * @file Item.js
 * @author TalesM
 * 
 * Defines the item class
 */

/**
 * The Item class
 * 
 * @constructor
 * @param {Array}
 *            id - the path.
 * @param {Item|null}
 *            [parent] - the parent
 * @param {String}
 *            [name] - the name
 * @param {String}
 *            [description] - the description
 * @param {Item[]}
 *            [dependencies] - an array of dependencies
 */
function Item(id, parent, name, description, dependencies) {
	this.id = id;
	this.parent = parent || null;
	this.name = name || '';
	this.description = description || '';
	this.dependencies = [];
	this.dependents = [];
	this.closed = false;
	if (dependencies) {
		dependencies.forEach(function(other) {
			if (other && other instanceof Item
					&& this.dependencies.indexOf(other) === -1) {
				this.dependencies.push(other);
				other.dependents.push(this);
			}
		}, this);
	}
}

/**
 * Returns whether this task depends to the given one.
 * 
 * @param {Item}
 *            task - The item to search
 * @returns {Boolean}
 */
Item.prototype.hasDependency = function(task) {
	var pos = this.dependencies.indexOf(task);
	return (pos != -1) || (!!this.parent && this.parent.hasDependency(task))
			|| (this.dependencies.some(function(dependency) {
				return dependency.hasDependency(task);
			}));
};

/**
 * Returns whether the given task depends from this one.
 * 
 * @param {Item}
 *            task - The item to search
 * @returns {Boolean}
 */
Item.prototype.hasDependent = function(task) {
	var pos = this.dependents.indexOf(task);
	return (pos != -1) || (this.dependents.some(function(dependent) {
		return dependent.hasDependent(task);
	}));
};

/**
 * Add a new dependency
 * 
 * @param {Item}
 *            task
 * @returns {Boolean}
 */
Item.prototype.addDependency = function(task) {
	if (this.hasDependency(task) || this.hasDependent(task))
		return false;
	this.dependencies.push(task);
	task.dependents.push(this);
	return true;
};

/**
 * Remove a dependency
 * 
 * @param {Item}
 *            task
 * @returns {Boolean}
 */
Item.prototype.removeDependency = function(task) {
	var pos = this.dependencies.indexOf(task);
	if (pos == -1)
		return false;
	this.dependencies.splice(pos, 1);
	var opos = task.dependents.indexOf(this);
	if (opos == -1)
		return false;
	task.dependents.splice(opos, 1);
	return true;
};

/**
 * Return whether this or all this' children are closed.
 * 
 * @returns {Boolean}
 */
Item.prototype.isClosed = function() {
	return this.closed;
};

/**
 * Return whether this or all this' children are closed.
 * 
 * @returns {Boolean}
 */
Item.prototype.isReady = function() {
	if (this.isClosed())
		return true;
	if (this.dependencies.length > 0
			&& this.dependencies.every(function check(item) {
				return item.isReady();
			})) {
		return true;
	}
	return this.parent && this.parent.isReady();
};

/**
 * Erase the item
 */
Item.prototype.erase = function() {
	// Eliminate dependencies:
	this.dependencies.forEach(function(dependency) {
		var pos = dependency.dependents.indexOf(this);
		if (pos != -1)
			dependency.dependents.splice(pos, 1);
	}, this);
	this.dependents.forEach(function(dependent) {
		var pos = dependent.dependencies.indexOf(this);
		if (pos != -1)
			dependent.dependencies.splice(pos, 1);
	}, this);
	if (this.parent)
		this.parent.removeKid(this);
};

/**
 * Get the absolute start position
 * 
 * @returns {Number}
 */
Item.prototype.start = function() {
	var start = (this.parent && this.parent.start()) || 0;
	this.dependencies.forEach(function(task) {
		start = Math.max(start, task.end());
	});
	return start;
};

/**
 * Get the absolute end position.
 * 
 * @returns
 */
Item.prototype.end = function() {
	return this.start() + this.spentReg() + this.remaining() + this.overdue();
};