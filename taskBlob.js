/**
 * 
 */
tasks = [];
$(function(){
	$('.mainNav').buttonset();
	$( document ).tooltip();

	//Scroll effect
	$( '.viewGroup' ).on( 'scroll', function( event ) {
		var $viewGroup=$( '.viewGroup');
		var scrollLeft=$(this).scrollLeft();
		$viewGroup.find('.taskName').css('left', scrollLeft);
		$viewGroup.find('.add').css('left', scrollLeft);
	});
});

/**
 * Converts an id expression in a path.
 * @param val
 * @returns [Number] 
 */
function id2path(val){
	return JSON.parse('[' + val.replace('.', ',') + ']');
}

/**
 * Returns the task for given path.
 * @param path
 * @returns {Task}
 */
function getTask(path) {
	var index = path[0]-1;
	if(index >= tasks.length)
		return null;
	var container = tasks[path[0]-1];
	for (var i = 1; i < path.length; i++) {
		index = path[i]-1;
		if(index >= container.subTaskslength)
			return null;
		container = container.subTasks[index];
	}
	return container;
}

/**
 * Converts a path in a task name.
 * @param path
 * @returns {String}
 */
function makeTaskName(path) {
	var str = 'task';
	path.forEach(function(element) {
		str += '_' + element;
	});
	return str;
}

function makeTaskPath(name){
	return name.substr(5).split('_');
}

/**
 * The offset of representation 
 */
var offset = 0;
/**
 * The scale of representation
 */
var scale = 2;

/**
 * Show a new task on schedule;
 * @param viewGroup
 * @param task
 */
function addTaskChrono(viewGroup, task){
	var viewItem = '<div class="task" '+ 'id="' + makeTaskName(task.id) +'" >';
	viewItem += generateTaskView(task);
	viewItem += '</div>';
	viewGroup.append(viewItem);
}

/**
 * Refresh the tas on schedule
 * @param viewGroup
 * @param task
 */
function editTaskChrono(viewGroup, task){
	var $element = viewGroup.find('#' + makeTaskName(task.id));
	var viewItem = generateTaskView(task);
	$element.html(viewItem);
}

/**
 * Private
 * @param task
 * @returns {String}
 */
function generateOptions(){
	var optionItem = '';
	optionItem 	  += '<span class="delete ui-icon ui-icon-trash"></span>';
	optionItem 	  += '<span class="edit ui-icon ui-icon-pencil"></span>';
	optionItem 	  += '<span class="add ui-icon ui-icon-plus"></span>';
	optionItem 	  += '<span class="play ui-icon ui-icon-play"></span>';
	return optionItem;
}

/**
 * Private
 * @param task
 * @returns {String}
 */
function generateTaskView(task) {
	var path = task.id;
	var viewItem = '<span class="taskName">'+generateOptions()+path.join('.')+ ". "+task.name + '</span>';
	viewItem += '<span class="meter start" style = "width:'+(task.start()*scale)+'em"></span>';
	viewItem += '<span class="meter spentReg" style = "width:'+(task.spentReg()*scale)+'em"></span>';
	viewItem += '<span class="meter remaining" style = "width:'+(task.remaining()*scale)+'em"></span>';
	viewItem += '<span class="meter leftover" style = "width:'+(task.leftover()*scale)+'em"></span>';
	viewItem += '<span class="meter overdue" style = "width:'+(task.overdue()*scale)+'em"></span>';
	adjustRuler(task.end());
	return viewItem;
}

/**
 * The current position of the ruler.
 * Should be private, please do not change.
 */
currentEnd = 15;

/**
 * Adjust the ruler.
 * @param end
 */
function adjustRuler(end){
	if(end > currentEnd){
		var incr = Math.ceil((end - currentEnd)/5);
		var $timeLabel = $('.timeLabel');
		for(var i = 1; i <= incr; ++i){
			$timeLabel.append('<span>' + (currentEnd + i*5) + 'h</span>');
		}
		currentEnd += (incr*5);
	}
}

/**
 * Compare two indices
 * @param index1
 * @param index2
 * @returns {Boolean}
 */
function compareIndices(index1, index2){
	if(index1.length !== index2.length)
		return false;
	var i, l=index1.length;
	for(i=0; i < l; ++i)
		if(index1[i] !== index2[i])
			return false;
	return true;
}

/**
 * The Item class
 * @constructor
 */
function Item(id, name, description, dependencies){
	this.id = id;
	this.name = name;
	this.description = description;
	if(!dependencies)
		this.dependencies = [];
	else 
		this.dependencies = dependencies;
	this.dependsMe = [];
	this.dependencies.forEach(function(value, index, deps) {
		var otherTask = getTask(value);
		if(otherTask != null)
			otherTask.dependsMe.push(id);
		else
			deps.splice(index, 1);
	});
}


/**
 * Returns whether this task depends to the given one.
 * @param {Array}taskid
 * @returns {Boolean}
 */
Item.prototype.hasDependency = function(taskid){
	var dependencies = this.dependencies;
	var i, l = dependencies.length;
	for(i = 0; i < l; ++i){
		if(compareIndices(dependencies[i], taskid))
			return true;
	}
	if(this.id.length > 1){
		var parent = getTask(this.id.slice(0, this.id.length-1));
		return parent.hasDependency(taskid);
	}
	return false;
};

/**
 * Returns whether the given task depends from this one.
 * @param {Array}taskid
 * @returns {Boolean}
 */
Item.prototype.hasDependent = function(taskid){
	var dependsMe = this.dependsMe;
	var i, l = dependsMe.length;
	for(i = 0; i < l; ++i){
		if(compareIndices(dependsMe[i], taskid))
			return true;
	}
	var subTasks = this.subTasks;
	if(subTasks.length){
		var i, l = subTasks.length;
		for(i = 0; i < l; i++){
			if(subTasks[i].hasDependent(taskid))
				return true;
		}
	}
	return false;
};

/**
 * Add a new dependency
 * @param {Item} task
 * @returns {Boolean}
 */
Item.prototype.addDependency = function(task){
	if(this.hasDependency(task.id) || this.hasDependent(task.id))
		return false;
	this.dependencies.push(task.id);
	task.dependsMe.push(this.id);
	return true;
};

/**
 * Remove a dependency
 * @param {Array} taskid
 * @returns {Boolean}
 */
Item.prototype.removeDependency = function(task){
	var dependencies = this.dependencies;
	var i, l = dependencies.length;
	var thisid = this.id;
	for(i = 0; i < l; ++i){
		if(compareIndices(dependencies[i], task.id)){
			dependencies.splice(i, 1);
			var dependsMe = task.dependsMe;
			var j, m = dependsMe.length;
			for(j = 0; j < m; ++j){
				if(compareIndices(dependsMe[j], thisid)){
					dependsMe.splice(j, 1);
				}
			}
			return true;
		}
	}
	return false;
};

/**
 * The Task class. Its our main thing here.
 * @constructor
 */
Task.prototype = Object.create(Item.prototype);
Task.prototype.constructor = Task;
function Task(id, name, description, duration, spent, status, dependencies){
	Item.call(this, id, name, description, dependencies);
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
	this.dependencies.forEach(function(path) {
		var task = getTask(path);
		start = Math.max(start, task.end());
	});
	return start;
};

Task.prototype.end = function() {
	return this.start() + this.spentReg()+this.remaining()+this.overdue();
};



Task.prototype.erase = function() {
	if(this.id.length > 1)
		throw 'Not supported yet!';
	if(this.subTasks && this.subTasks.length)
		throw 'Can not delete a parent';
	var id = this.id;
	//Eliminate dependencies:
	this.dependencies.forEach(function(value, key) {
		var dependTo = getTask(value).dependsMe;
		var i, l = dependTo.length;
		for(i=0; i < l; ++i){
			if(compareIndices(id, dependTo[i])){
				dependTo.splice(i, 1);
				break;
			}
		}
	});
	this.dependsMe.forEach(function(value, key) {
		var dependTo = getTask(value).dependencies;
		var i, l = dependTo.length;
		for(i=0; i < l; ++i){
			if(compareIndices(id, dependTo[i])){
				dependTo.splice(i, 1);
				break;
			}
		}
	});
	//Removing
	delete tasks[id[0]-1];
	//Cleaning
	var l = tasks.length -1;
	for(var i = l; i >= 0; --i){
		if(tasks[i]){
			var deadCount = l - i;
			if(deadCount)
				tasks.splice(i+1, deadCount);
			break;
		}
	}
};