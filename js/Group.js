/**
 * @file Group.js
 * @author TalesM
 * 
 */

//Defining subclass.
Group.prototype = Object.create(Item.prototype);
Group.prototype.constructor = Group;
/**
 * The group class
 * @constructor
 * @base Item
 * @param {Array} id
 * @param {String} name
 * @param {String} description
 * @param {Item[]} dependencies
 * @param {Item[]} children
 */
function Group(id, name, description, dependencies, children) {
	Item.call(this, id, null, name, description, dependencies);
	this.subTasks = [];
	if(children){
		children.forEach(function(kid) {
			if(kid.parent || kid.hasDependency(this) || this.hasDependency(kid))
				return;//continue
			kid.parent = this;
			this.subTasks.push(kid);
		}, this);
	}
}

Group.prototype.hasDependent = function(task){
	return Item.prototype.hasDependent.call(this, task) || (this.parent && this.parent.hasDependent(task));
};

/**
 * Add a kid to group.
 * @param {Item} task - The item to add.
 * @return {Boolean} whether it was successful.
 */
Group.prototype.addKid = function(task){
	if(!task || task.parent || task.hasDependency(this) || task.hasDependency(task))
		return false;
	task.parent = this;
	this.subTasks.push(task);
	return true;
};

/**
 * Remove a kid from group.
 * @param {Item} item.
 * @return {Boolean} whether it was successful.
 */
Group.prototype.removeKid = function(task){
	var pos=this.subTasks.indexOf(task);
	if(pos === -1)
		return false;
	this.subTasks.splice(pos, 1);
	task.parent = null;
	return true;
};

/**
 * Get the number of children
 * @returns {Number}
 */
Group.prototype.size = function(){
	return this.subTasks.length;
};

/**
 * Get the regular spent time (not overdue).
 * @returns {Number}
 */
Group.prototype.spentReg = function() {
	return this.subTasks.reduce(function(previous, task) {
		return previous+task.spentReg();
	}, 0);
};

/**
 * Get the remaining time.
 * @returns {Number}
 */
Group.prototype.remaining = function() {
	return this.subTasks.reduce(function(previous, task) {
		return previous+task.remaining();
	}, 0);
};

/**
 * Get the overdue time.
 * @returns {Number}
 */
Group.prototype.overdue = function() {
	return this.subTasks.reduce(function(previous, task) {
		return previous+task.overdue();
	}, 0);
};

/**
 * Get the lefover time
 * @returns {Number}
 */
Group.prototype.leftover = function() {
	return this.subTasks.leftover(function(previous, task) {
		return previous+task.overdue();
	}, 0);
};