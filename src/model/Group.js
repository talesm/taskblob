/**
 * @file Group.js
 * @author TalesM
 *
 */
import Item from './Item';

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
 * @param {Boolean} closed
 * @param {Item[]} dependencies
 * @param {Item[]} children
 */
function Group(id, name, description, closed, dependencies, children) {
	Item.call(this, id, null, name, description, dependencies);
	this.subTasks = [];
	this.closed = closed;
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


Group.prototype.isClosed = function() {
	return this.closed || this.subTasks.every(function(kid){
		return kid.isClosed();
	});
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
	var subTasks = this.subTasks;
	var pos=subTasks.indexOf(task);
	if(pos === -1)
		return false;
	task.parent = null;
	subTasks[pos] = null; //Soft delete.

	//Hard delete:
	if(subTasks.length === 1) //To avoid infinite loop bug.
		this.subTasks = [];
	else if(pos === subTasks.length-1){
		var sz = 0;
		do{
			--pos;
			++sz;
		}while(subTasks[pos] == null);
		subTasks.splice(pos+1, sz);
	}
	return true;
};

/**
 * Removes a kid an puts another in its place.
 * @param {Item} kid
 * @param {Item} fosterKid
 *
 * @b Important! It do not reasing ids, you have to do it on your own.
 */
Group.prototype.swap = function(kid, fosterKid){
	var ind = this.subTasks.indexOf(kid);
	if(ind===-1)
		throw Error('Swapping the kid of another person.');
	if(fosterKid.parent)
		throw Error('Foster kid already has a parent.');
	kid.parent = null;
	fosterKid.parent = this;
	this.subTasks[ind] = fosterKid;
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
 * Get the leftover time
 * @returns {Number}
 */
Group.prototype.leftover = function() {
	return this.subTasks.reduce(function(previous, task) {
		return previous+task.leftover();
	}, 0);
};

/**
 * Get time you can't you use but have to wait anyway.
 * It happens when a group have a 'hole' inside: a period of time
 * where no subTask can be active, having some finished before and
 * others starting later.
 * @returns {Number}
 */
Group.prototype.unreachable = function(){
	return this.end() - Item.prototype.end.call(this);
};

Group.prototype.end = function() {
	var betterEnd = Item.prototype.end.call(this);
	var kidsEnd = this.subTasks.reduce(function(larger, task){
		return Math.max(larger, task.end());
	}, 0);
	return Math.max(betterEnd, kidsEnd);
};

Group.prototype.map = function (func) {
	this.subTasks.map(func);
}

export default Group;
