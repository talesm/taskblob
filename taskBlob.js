/**
 * 
 */
tasks = [];
$(function(){
	$('.viewSection').on('click', '.add', function(){
		var name 		= $(this).siblings('.taskName').val();
		var description = $(this).siblings('.description').val();
		var duration 	= $(this).siblings('.duration').val();
		var spent 		= $(this).siblings('.spent').val();
		
		//Adding; Fix it to find parent-child relationship.
		var newTask =  new Task(name, description, duration, spent);
		tasks.push(newTask);
		var newId = tasks.length;
		
		//Showing
		var chronoGroup = $('.viewGroup');
		addTaskChrono(chronoGroup, newId, newTask);
	});
	
});

function makeTaskName(path) {
	var str = 'task';
	path.forEach(function(element) {
		str += '_' + element;
	});
	return str;
}

var startPos = 0;
var scale = 2;

function addTaskChrono(viewGroup, newId, newTask){
	var viewItem = '<div class="task"'+ 'id="' + makeTaskName([newId]) +'" >';
	viewItem += '<span class="taskName">'+newId+ ". "+newTask.name + '</span>';
	viewItem += '<span class="meter start" style = "width:'+(newTask.start()*scale)+'em"></span>';
	viewItem += '<span class="meter spentReg" style = "width:'+(newTask.spentReg()*scale)+'em"></span>';
	viewItem += '<span class="meter remaining" style = "width:'+(newTask.remaining()*scale)+'em"></span>';
	viewItem += '<span class="meter leftover" style = "width:'+(newTask.leftover()*scale)+'em"></span>';
	viewItem += '<span class="meter overdue" style = "width:'+(newTask.overdue()*scale)+'em"></span>';
	viewItem += '</div>';
	viewGroup.append(viewItem);
}

function Task(name, description, duration, spent, status, dependencies){
	this.name = name;
	this.description = description;
	this.duration = duration;
	this.spent = spent;
	if(typeof status === 'undefined')
		this.status = 'proposed';
	else
		this.status = status;
	if(typeof dependencies === 'array')
		this.dependencies = dependencies;
	else 
		this.dependencies = [];
	this.dependendsMe = [];
	this.subTasks = [];
}

Task.prototype.spentReg = function() {
	return Math.min(this.duration, this.spent);
};

Task.prototype.remaining = function() {
	return this.duration - this.spentReg();
};

Task.prototype.overdue = function() {
	return this.spent - this.spentReg();
};

Task.prototype.leftover = function() {
	return  0;
};

Task.prototype.start = function() {
	return 0;
};

Task.prototype.end = function() {
	return Math.max(this.duration, this.spent);
};

