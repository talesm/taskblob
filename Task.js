/**
 * @file Tasks.js
 * @author TalesM
 * 
 */

//Defining subclass.
Task.prototype = Object.create(Item.prototype);
Task.prototype.constructor = Task;
/**
 * The Task class. Its our main thing here.
 * @constructor
 */
function Task(id, name, description, duration, spent, status, dependencies){
	Item.call(this, id, null, name, description, dependencies);
	this.spent = spent || 0;
	this.duration = duration || 0;
	if(!status)
		this.status = 'proposed';
	else
		this.status = status;
	this.subTasks = null;
}


Task.prototype.spentReg = function() {
	return Math.min(this.duration, this.spent);
};

Task.prototype.remaining = function() {
	if(this.status !== 'closed')
		return this.duration - this.spentReg();
	return 0;
};

Task.prototype.overdue = function() {
	return this.spent - this.spentReg();
};

Task.prototype.leftover = function() {
	if(this.status === 'closed')
		return this.duration - this.spentReg();
	return 0;
};

Task.prototype.start = function() {
	var start = 0;
	this.dependencies.forEach(function(task) {
		start = Math.max(start, task.end());
	});
	return start;
};

Task.prototype.end = function() {
	return this.start() + this.spentReg()+this.remaining()+this.overdue();
};