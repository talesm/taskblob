/**
 * @file Tasks.js
 * @author TalesM
 *
 */
import Item from './Item';

//Defining subclass.
Task.prototype = Object.create(Item.prototype);
Task.prototype.constructor = Task;
/**
 * The Task class. Its our main thing here.
 * @constructor
 * @base Item
 */
function Task(id, name, description, duration, spent, closed, dependencies){
	Item.call(this, id, null, name, description, dependencies);
	this.spent = spent || 0;
	this.duration = duration || 0;
	this.closed = !!closed;//Force boolean
	this.subTasks = null;
}

/**
 * Get the regular spent time (not overdue).
 * @returns {Number}
 */
Task.prototype.spentReg = function() {
	return Math.min(this.duration, this.spent);
};

/**
 * Get the remaining time.
 * @returns {Number}
 */
Task.prototype.remaining = function() {
	if(!this.isClosed())
		return this.duration - this.spentReg();
	return 0;
};

/**
 * Get the overdue time.
 * @returns {Number}
 */
Task.prototype.overdue = function() {
	return this.spent - this.spentReg();
};

/**
 * Get the lefover time
 * @returns {Number}
 */
Task.prototype.leftover = function() {
	if(this.isClosed())
		return this.duration - this.spentReg();
	return 0;
};


/**
 * Get time you can't you use. Always zero for tasks
 * @returns {Number}
 */
Task.prototype.unreachable = function(){
	return 0;
};

export default Task;
