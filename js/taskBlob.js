/**
 * {Project} tasks - The current tasks
 */
tasks = new Project('DefaultProject', 'root');

// Main function
$(function() {
	$('.mainNav').buttonset();
	$(document).tooltip();

	// Scroll effect
	$('.viewGroup').on('scroll', function(event) {
		var $viewGroup = $('.viewGroup');
		var scrollLeft = $(this).scrollLeft();
		$viewGroup.find('.taskName').css('left', scrollLeft);
		$viewGroup.find('.add').css('left', scrollLeft);
	}).on('contextmenu', '.item', function(ev) {
		ev.preventDefault();
		ev.stopImmediatePropagation();
		var item = tasks.get($(this).attr('data-itemid').split('.') );
		if (item.subTasks)
			openGroupMenu(item, ev.pageX, ev.pageY);
		else {
			openTaskMenu(item, ev.pageX, ev.pageY);
		}
	}).on('click', '.options', function(ev) {
		var item = tasks.get($(this).closest('.item').attr('data-itemid').split('.') );
		if (item.subTasks)
			openGroupMenu(item, ev.pageX, ev.pageY);
		else {
			openTaskMenu(item, ev.pageX, ev.pageY);
		}
	});

	$('.popMenu').menu().hide().on('focusout', function() {
		$(this).hide('fast');
	});//options
	
});

/**
 * 
 * @param {Task}
 *            task
 * @param {Number}
 *            x
 * @param {Number}
 *            y
 */
function openTaskMenu(task, x, y) {
	var $taskMenu=$('#taskMenu');
	$taskMenu.attr('data-itemid', task.id.join('.'));
	$taskMenu.show('fast').focus().css('left', x).css('top', y);
}

/**
 * 
 * @param {Group}
 *            group
 * @param {Number}
 *            x
 * @param {Number}
 *            y
 */
function openGroupMenu(group, x, y) {
	var $taskGroup=$('#groupMenu');
	$taskGroup.attr('data-itemid', group.id.join('.'));
	$taskGroup.show('fast').focus().css('left', x).css('top', y);
}

/**
 * Converts an id expression in a path.
 * 
 * @param {String}
 *            val
 * @returns { Array }
 */
function id2path(val) {
	return val.split('.');
}

/**
 * Converts a path in a task name.
 * 
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

function makeItemPath(name) {
	return name.substr(5).split('_');
}

/**
 * Rebuilds the entire view with current tasks.
 */
function refreshView() {
	$viewGroup = $('.viewGroup');
	$viewGroup.children('.item').remove();
	tasks.subTasks.forEach(function addItem(item) {
		if (item) {
			if (item.subTasks) {
				addGroupChrono(item);
				item.subTasks.forEach(addItem);
			} else
				addTaskChrono(item);
		}
	});
}

/**
 * @param {Item[]}
 *            dirt - the items to refresh.
 */
function refreshItems(items) {
	var parents = {}; // Need only to be redrawn
	while (items.length) {
		var dirtItem = items.pop();
		items = dirtItem.dependents.concat(items);
		if (dirtItem.subTasks) {
			items = dirtItem.subTasks.concat(items);
			editGroupChrono(dirtItem);
		} else
			editTaskChrono(dirtItem);
		if (dirtItem.parent && dirtItem.parent !== tasks) {
			var p = dirtItem.parent;
			do {
				parents[p.id] = p;
				items = p.dependents.concat(items);
				p = p.parent;
			} while (p !== tasks);
		}
	}
	for ( var prt in parents) {
		editGroupChrono(parents[prt]);
	}
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
 * 
 * @param {Task}
 *            task
 */
function addTaskChrono(task) {
	var $target = (task.parent === tasks) ? $('.viewGroup') : $('.viewGroup #'
			+ makeItemName(task.parent.id));
	var viewItem = '<div class="item" ' + 'id="' + makeItemName(task.id)
			+ '" data-itemid="' + task.id.join('.') + '" >';
	viewItem += generateItemView(task, generateItemOptions());
	viewItem += '</div>';
	$target.append(viewItem);
}

/**
 * Refresh the task on schedule
 * 
 * @param {Task}
 *            task
 */
function editTaskChrono(task) {
	var $element = $('.viewGroup #' + makeItemName(task.id));
	updateItemView(task, $element);
}

/**
 * Private
 * 
 * @returns {String}
 */
function generateItemOptions(extra) {
	var optionItem = '<span class="itemButtons">';
	optionItem += '<span class="play ui-icon ui-icon-play" title="Visualizar"></span>';
	optionItem += '<span class="edit ui-icon ui-icon-pencil" title="Editar"></span>';
	if(extra)
		optionItem += extra;
	optionItem += '<span class="options ui-icon ui-icon-triangle-1-s" title="Mais opções"></span>';
	optionItem += '</span>';
	return optionItem;
}

/**
 * Show a new group on schedule;
 * 
 * @param parent
 * @param {Group}
 *            task
 */
function addGroupChrono(group) {
	var $target = (group.parent === tasks) ? $('.viewGroup') : $('.viewGroup #'
			+ makeItemName(group.parent.id));
	var viewItem = '<div class="item collapsed" ' + 'id="' + makeItemName(group.id)
			+ '" data-itemid="' + group.id.join('.') + '" >';
	var collapseButton = '<span class="collapse ui-icon ui-icon-folder-open" title="Encolher"></span>';
	collapseButton    += '<span class="collapse ui-icon ui-icon-folder-collapsed" title="Expandir"></span>';
	viewItem += generateItemView(group, generateItemOptions(collapseButton));
	viewItem += '</div>';
	$target.append(viewItem);
}

/**
 * Refresh the task on schedule
 * 
 * @param {Group}
 *            group
 */
function editGroupChrono(group) {
	var $element = $('.viewGroup #' + makeItemName(group.id));
	updateItemView(group, $element);
}

/**
 * Private
 * 
 * @param task
 * @returns {String}
 */
function generateItemView(task, options) {
	var path = task.id;
	var name = task.name;
	var viewItem = '<span class="taskName" title="' + name + '">';
	viewItem += options;
	viewItem += '<span class="name">' + path.join('.') + ". " + name
			+ '</span></span>';
	var start = task.start();
	var spentReg = task.spentReg();
	var remaining = task.remaining();
	var leftover = task.leftover();
	var overdue = task.overdue();
	var unreachable = task.unreachable();
	viewItem += '<span class="meter start" style = "width:' + (start * scale)
			+ 'em"></span>';
	viewItem += '<span class="meter spentReg" style = "width:'
			+ (spentReg * scale) + 'em"></span>';
	viewItem += '<span class="meter remaining" style = "width:'
			+ (remaining * scale) + 'em"></span>';
	viewItem += '<span class="meter leftover" style = "width:'
			+ (leftover * scale) + 'em"></span>';
	viewItem += '<span class="meter overdue" style = "width:'
			+ (overdue * scale) + 'em"></span>';
	viewItem += '<span class="meter unreachable" style = "width:'
			+ (unreachable * scale) + 'em"></span>';
	adjustRuler(task.end() + task.leftover());
	return viewItem;
}

/**
 * Private
 * 
 * @param {Item}
 *            task
 * @returns {String}
 */
function updateItemView(task, $taskContainer) {
	var start = task.start();
	var spentReg = task.spentReg();
	var remaining = task.remaining();
	var leftover = task.leftover();
	var overdue = task.overdue();
	var unreachable = task.unreachable();
	$taskContainer.children('.start').css('width', (start * scale) + 'em');
	$taskContainer.children('.spentReg')
			.css('width', (spentReg * scale) + 'em');
	$taskContainer.children('.remaining').css('width',
			(remaining * scale) + 'em');
	$taskContainer.children('.leftover')
			.css('width', (leftover * scale) + 'em');
	$taskContainer.children('.overdue').css('width', (overdue * scale) + 'em');
	$taskContainer.children('.unreachable').css('width',
			(unreachable * scale) + 'em');
	adjustRuler(task.end() + task.leftover());
	var $itemName = $taskContainer.children('.taskName');
	$itemName.attr('title', task.name);
	var newName = task.id.join('.') + '. ' + task.name;
	$itemName.children('.name').text(newName);
}

/**
 * The current position of the ruler. Should be private, please do not change.
 */
var currentEnd = 15;

/**
 * Adjust the ruler.
 * 
 * @param end
 */
function adjustRuler(end) {
	if (end > currentEnd) {
		var incr = Math.ceil((end - currentEnd) / 5);
		var $timeLabel = $('.timeLabel');
		for (var i = 1; i <= incr; ++i) {
			$timeLabel.append('<span>' + (currentEnd + i * 5) + 'h</span>');
		}
		currentEnd += (incr * 5);
	}
}
