/**
 * 
 */
tasks = [];
$(function(){
	//Cool effect
	$( '.viewGroup' ).on( 'scroll', function( event ) {
		$( '.viewGroup .taskName').css('left', $(this).scrollLeft());
	});
	
	//Add new task
	$( '.viewSection .add').on('click', function() {
		createModal($('.editTask'), {closeButton:true});
		$('.modal header > h1').html('Adicionar Tarefa');
		$('.modal .taskPath').val('0');
	});
	
	//Quick edit task.
	
	//Edit
	$( '.viewSection').on('click', '.task', function() {
		createModal($('.editTask'), {closeButton:true});
		var sid = $(this).attr('id').substr(5);
		$('.modal header > h1').html('Editar Tarefa [' + sid.replace('_', '.') + ']');
		$('.modal .taskPath').val(sid.split('_'));
	});
	
	$( '.modal').on('click', '.save', function() {
		var modal = $('.modal');
		var path = modal.find('.taskPath').val().split('.');
		var ord = path[path.length-1];
		var name 		= modal.find('.taskName').val();
		var description = modal.find('.description').val();
		var duration 	=+modal.find('.duration').val();
		var spent 		=+modal.find('.spent').val();
		var status 		= modal.find('.status').val();
		var dependStr  	= modal.find('.dependencies').val().trim();
		var dependencies = [];
		if(dependStr !== ''){
			dependStr.split(',').forEach(function(value, index){
				var dependecy = value.trim().split('.');
				dependecy.forEach(function(value, index, arr) {
					arr[index] = +value;
				});
				dependencies[index] = dependecy;
			});
		}
		if(ord === '0'){//Adicionando
			if(path.length > 1)
				throw "Not supported yet";
			var task = new Task([tasks.length+1], name, description, duration, spent, status, dependencies);
			tasks.push(task);
			addTaskChrono($(".viewGroup"), task);
			closeModal();
		} else {
			var task = getTask(path);
			task.name = name;
			task.description = description;
			task.duration = duration;
			task.spent = spent;
			task.status = status;
			//TODO: Check for circular dependecies
			task.dependencies = dependencies;
			editTaskChrono($(".viewGroup"), task);
		}
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

function addTaskChrono(viewGroup, newTask){
	var path = newTask.id;
	var viewItem = '<div class="task"'+ 'id="' + makeTaskName(path) +'" >';
	viewItem += '<span class="taskName">'+path.join('.')+ ". "+newTask.name + '</span>';
	viewItem += '<span class="meter start" style = "width:'+(newTask.start()*scale)+'em"></span>';
	viewItem += '<span class="meter spentReg" style = "width:'+(newTask.spentReg()*scale)+'em"></span>';
	viewItem += '<span class="meter remaining" style = "width:'+(newTask.remaining()*scale)+'em"></span>';
	viewItem += '<span class="meter leftover" style = "width:'+(newTask.leftover()*scale)+'em"></span>';
	viewItem += '<span class="meter overdue" style = "width:'+(newTask.overdue()*scale)+'em"></span>';
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
