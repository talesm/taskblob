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


