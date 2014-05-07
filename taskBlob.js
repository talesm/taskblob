/**
 * 
 */
tasks = [];
$(function(){
	$('.viewSection').on('click', '.add', function(){
		var viewSection = $(this).parent();
		var name 		= viewSection.find('.taskName').val();
		var description = viewSection.find('.description').val();
		var duration 	= viewSection.find('.duration').val();
		var spent 		= viewSection.find('.spent').val();
		var parentPath  = viewSection.find('.parent').val();
		var dependStr  	= viewSection.find('.dependencies').val().trim();
		var path = [];
		
		var container;
		if(parentPath === '')
			container = tasks;
		else {
			path = parentPath.split('.');
			var p = getTask(path);
			container = p.subTasks;
		}
		
		var dependenciesRefs = [];
		if(dependStr !== ''){
			dependStr.split(',').forEach(function(value, index){
				var dependecy = value.trim().split('.');
				dependecy.forEach(function(value, index, arr) {
					arr[index] = +value;
				});
				dependenciesRefs[index] = dependecy;
			});
		}
		//Showing
		var chronoGroup;
		if(container === tasks)
			chronoGroup = $('.viewSection > .viewGroup');
		else
			chronoGroup = $('#'+makeTaskName(path));
		//WHATH
		path.push(container.length+1);
		var newTask =  new Task(path, name, description, duration, spent, null, dependenciesRefs);
		container.push(newTask);
		addTaskChrono(chronoGroup, path, newTask);
		var taskCode = path.join('.');
		var newOption = '<option value="' +taskCode+ '">' + taskCode + '. ' + name + "</option>";
		$('.addTask .parent').append(newOption);
	});
	
	$('.textExport').click(function() {
        var blob = new Blob([JSON.stringify(tasks)], {'type':'application/json'});
		$('a.textExport').attr('href', window.URL.createObjectURL(blob));
	});
	
	$( '.viewGroup' ).on( "scroll", function( event ) {
		$( ".viewGroup .taskName").css('left', $(this).scrollLeft());
	});
	
	$('.modal').on('click', '.close', function() {
		$('.modal').html('');
	});
		
});

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

function Task(id, name, description, duration, spent, status, dependencies){
	this.id = id;
	this.name = name;
	this.description = description;
	this.duration = duration;
	this.spent = spent;
	if(!status)
		this.status = 'proposed';
	else
		this.status = status;
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
	var start = 0;
	this.dependencies.forEach(function(path) {
		var task = getTask(path);
		start = Math.max(start, task.end());
	});
	return start;
};

Task.prototype.end = function() {
	return this.start() + Math.max(this.duration, this.spent);
};

