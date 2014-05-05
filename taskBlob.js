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
		var parentPath  = $(this).siblings('.parent').val();
		var path = [];
		
		var container;
		if(parentPath === '')
			container = tasks;
		else {
			path = parentPath.split('.');
			var p = getTask(path);
			container = p.subTasks;
		}
		
		//Adding; Fix it to find parent-child relationship.
		var newTask =  new Task(name, description, duration, spent);
		container.push(newTask);
		
		//Showing
		var chronoGroup;
		if(container === tasks)
			chronoGroup = $('.viewSection > .viewGroup');
		else
			chronoGroup = $('#'+makeTaskName(path));

		path.push(container.length);
		addTaskChrono(chronoGroup, path, newTask);
		var taskCode = path.join('.');
		var newOption = '<option value="' +taskCode+ '">' + taskCode + '. ' + name + "</option>";
		$('.addTask .parent').append(newOption);
	});
	
});

function getTask(path) {
	var container = tasks[path[0]-1];
	for (var i = 1; i < path.length; i++) {
		var index = path[i]-1;
		container = container.subTasks[index];
	}
	return container;
}

function makeTaskName(path) {
	var str = 'task';
	path.forEach(function(element) {
		str += '_' + element;
	});
	return str;
}

var startPos = 0;
var scale = 2;

function addTaskChrono(viewGroup, path, newTask){
	var viewItem = '<div class="task"'+ 'id="' + makeTaskName(path) +'" >';
	viewItem += '<span class="taskName">'+path.join('.')+ ". "+newTask.name + '</span>';
	viewItem += '<span class="meter start" style = "width:'+(newTask.start()*scale)+'em"></span>';
	viewItem += '<span class="meter spentReg" style = "width:'+(newTask.spentReg()*scale)+'em"></span>';
	viewItem += '<span class="meter remaining" style = "width:'+(newTask.remaining()*scale)+'em"></span>';
	viewItem += '<span class="meter leftover" style = "width:'+(newTask.leftover()*scale)+'em"></span>';
	viewItem += '<span class="meter overdue" style = "width:'+(newTask.overdue()*scale)+'em"></span>';
//	viewItem += '<div class="viewGroup"></div>';
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

