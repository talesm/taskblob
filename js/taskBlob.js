
/**
 * {Project} tasks - The current tasks
 */
tasks = new Project('DefaultProject', 'root');

// Main function
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
 * @param {String} val
 * @returns { Number[] } 
 */
function id2path(val){
	return JSON.parse('[' + val.replace('.', ',') + ']');
}

/**
 * Converts a path in a task name.
 * @param path
 * @returns {String}
 */
function makeItemName(path) {
	var str = 'item';
	path.forEach(function(element) {
		str += '_' + element;
	});
	return str;
}
var makeTaskName = makeItemName;// I do not trust the refactor that much.

function makeTaskPath(name){
	return name.substr(5).split('_');
}

/**
 * Rebuilds the entire view with current tasks.
 */
function refreshView() {
	$viewGroup = $('.viewGroup');
	$viewGroup.children('.item').remove();
	tasks.subTasks.forEach(function(item) {
		if(item){
			if(item.subTasks)
				addGroupChrono($viewGroup, item);
			else
				addTaskChrono($viewGroup, item);
		}
	});
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
 * @param {Task} task
 */
function addTaskChrono(viewGroup, task){
	var viewItem = '<div class="item" '+ 'id="' + makeItemName(task.id) +'" >';
	viewItem += generateItemView(task, generateTaskOptions());
	viewItem += '</div>';
	viewGroup.append(viewItem);
}

/**
 * Refresh the task on schedule
 * @param viewGroup
 * @param {Task} task
 */
function editTaskChrono(viewGroup, task){
	var $element = viewGroup.find('#' + makeItemName(task.id));
	var viewItem = generateItemView(task, generateTaskOptions());
	$element.html(viewItem);
}

/**
 * Private
 * @returns {String}
 */
function generateTaskOptions(){
	var optionItem = '';
	optionItem 	  += '<span class="delete ui-icon ui-icon-trash" title="Deletar"></span>';
	optionItem 	  += '<span class="edit ui-icon ui-icon-pencil" title="Editar"></span>';
	optionItem 	  += '<span class="split ui-icon ui-icon-arrowthickstop-1-s" title="Dividir em subTarefas"></span>';
	optionItem 	  += '<span class="play ui-icon ui-icon-play" title="Visualizar"></span>';
	return optionItem;
}

/**
 * Show a new group on schedule;
 * @param viewGroup
 * @param {Group} task
 */
function addGroupChrono(viewGroup, group) {
	var viewItem = '<div class="item" '+ 'id="' + makeItemName(group.id) +'" >';
	viewItem += generateItemView(group, generateGroupOptions());
	viewItem += '</div>';
	viewGroup.append(viewItem);
}

/**
 * Refresh the task on schedule
 * @param viewGroup
 * @param {Groups} group
 */
function editGroupChrono(viewGroup, group){
	var $element = viewGroup.find('#' + makeItemName(group.id));
	var viewItem = generateItemView(group, generateGroupOptions());
	$element.html(viewItem);
}

/**
 * Private
 * @returns {String}
 */
function generateGroupOptions(){
	var optionItem = '';
	optionItem 	  += '<span class="delete ui-icon ui-icon-trash" title="Deletar"></span>';
	optionItem 	  += '<span class="edit ui-icon ui-icon-pencil" title="Editar"></span>';
	optionItem 	  += '<span class="addSubGroup ui-icon ui-icon-folder-open" title="Adicionar Sub-grupo"></span>';
	optionItem 	  += '<span class="addSubTask ui-icon ui-icon-document" title="Adicionar Sub-tarefa"></span>';
	return optionItem;
}

/**
 * Private
 * @param task
 * @returns {String}
 */
function generateItemView(task, options) {
	var path = task.id;
	var name = task.name;
	var viewItem = '<span class="taskName" title="' + name + '">'
			+ options + path.join('.') + ". " + name + '</span>';
	var start=task.start();
	var spentReg=task.spentReg();
	var remaining=task.remaining();
	var leftover=task.leftover();
	var overdue=task.overdue();
	viewItem += '<span class="meter start" style = "width:'+(start*scale)+'em"></span>';
	viewItem += '<span class="meter spentReg" style = "width:'+(spentReg*scale)+'em"></span>';
	viewItem += '<span class="meter remaining" style = "width:'+(remaining*scale)+'em"></span>';
	viewItem += '<span class="meter leftover" style = "width:'+(leftover*scale)+'em"></span>';
	viewItem += '<span class="meter overdue" style = "width:'+(overdue*scale)+'em"></span>';
	adjustRuler(task.end());
	return viewItem;
}

/**
 * The current position of the ruler.
 * Should be private, please do not change.
 */
var currentEnd = 15;

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
