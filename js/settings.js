/**
 * 
 */
$(function(){
	//Checking if has localStorage, otherwise it loads a polyfill.
	if(!window.localStorage)
		startCookieStorage();
	
	//Creating settings
	var settings = {
		localStorage :{
			available : !!window.localStorage,
			wait: (window.localStorage)?500:0,
			saver: 0,
		},
	};
	
	//Creating settings dialog
	var $settingsDialog=$('.settingsDialog');
	$settingsDialog.dialog({
		autoOpen: false,
		modal:true,
		width: 600,
		close: function() {
			$(this).find().css('display', '');
			$(this).find('#localStorageWait').attr('disabled', false);
		},
		buttons: {
			'Ok': function(){
				applyChanges.call(this);
				$(this).dialog('close');
			},
			'Aplicar': applyChanges,
			'Cancelar': function()
			{
				$(this).dialog('close');
			},
		}
	});
	
	//Creating settings button
	$('.showSettings')
	.button({icons:{primary:'ui-icon-gear'}})
	.click(function(){
		var $localStorage=$('#localStorageWait');
		$localStorage.parent().css('display', settings.localStorage.available?'':'none');
		$localStorage.val(settings.localStorage.wait || 500);
		$localStorage.attr('disabled', !settings.localStorage.wait);
		$('#localStorageActive').prop('checked', !!settings.localStorage.wait);
		
		$settingsDialog.dialog('open');
	});
	
	//Effect of disabling the 'time to wait' field.
	$settingsDialog.on('change', '#localStorageActive', function() {
		$settingsDialog.find('#localStorageWait').attr('disabled', !$(this).prop('checked'));
	});
	
	//Loading settings
	if(settings.localStorage.available){
		loadFromStorage(window.localStorage, settings);
	}
	
	//Setup of the saver.
	generateSaver(window.localStorage, settings.localStorage, settings);
	
	//Apply dialog changes.
	function applyChanges(){
		var $this = $(this);
		if(settings.localStorage.available){
			settings.localStorage.wait = $this.find('#localStorageActive').prop('checked') && (+$this.find('#localStorageWait').val());
			generateSaver(window.localStorage, settings.localStorage, settings);
		}
	}
});

/**
 * Load a project from storage. 
 */
function loadFromStorage(storage, settings) { 
	//Loading the tasks
	if(storage.hasOwnProperty('tasksRepository')){
		try{
			var tasksJSON = text2driedTasks(storage.getItem('tasksRepository'));
			tasks = Project.wet(tasksJSON);
			refreshView();
		}
		catch (error) {
			console.log(error); 
			alert('Armazenamento local em formato desconhecido, truncado ou não tratado. Desabilitando salvamento automático por segurança');
			storage.wait = 0;
		}
	}
	//Loading the settings
	if(storage.hasOwnProperty('taskBlobSettings')){
		try{
			var jsonSettings = JSON.parse(storage.getItem('taskBlobSettings'));
			//Must read manually to avoid cache attacks. 
			if(jsonSettings.localStorage){
				settings.localStorage.wait = +jsonSettings.localStorage.wait;//TODO truncate the value.
			}
		}
		catch (error) {
			console.log('Can not load settings, using default');
			console.log(error);
		}
	}
	else 
		console.log('Can not find settings, using default');
	return settings;
}

/**
 * Setup the saver function.
 */
function generateSaver(storage, storageSettings, settings) {
	//Persisting the settings itself
	storage.setItem('taskBlobSettings', JSON.stringify(settings));
	
	//Deleting the old saver.
	if(storageSettings.saver)
		window.clearTimeout(storageSettings.saver);
	
	//If wait zero, disable saving altogether.
	if(!storageSettings.available || !(+storageSettings.wait)){
		storageSettings.saver = 0;
		return;
	}
	//Otherwise sets a time out.
	var ms = +storageSettings.wait;
	storageSettings.saver = window.setTimeout(function timeFunction() {
		console.log('Saving');
		storage.setItem('tasksRepository', JSON.stringify(tasks.dry()));
		storageSettings.saver = window.setTimeout(timeFunction, ms);
	}, ms);
}

function startCookieStorage() {
	console.log('localStorage not found. Trying cookies.');
	window.localStorage = {
		getItem : function(sKey) {
			if (!sKey || !this.hasOwnProperty(sKey)) {
				return null;
			}
			return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)"
					+ escape(sKey).replace(/[\-\.\+\*]/g, "\\$&")
					+ "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
		},
		key : function(nKeyId) {
			return unescape(document.cookie.replace(/\s*\=(?:.(?!;))*$/, "")
					.split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)[nKeyId]);
		},
		setItem : function(sKey, sValue) {
			if (!sKey) {
				return;
			}
			document.cookie = escape(sKey) + "=" + escape(sValue)
					+ "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
			this.length = document.cookie.match(/\=/g).length;
		},
		length : 0,
		removeItem : function(sKey) {
			if (!sKey || !this.hasOwnProperty(sKey)) {
				return;
			}
			document.cookie = escape(sKey)
					+ "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
			this.length--;
		},
		hasOwnProperty : function(sKey) {
			return (new RegExp("(?:^|;\\s*)"
					+ escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\="))
					.test(document.cookie);
		}
	};
	window.localStorage.length = (document.cookie.match(/\=/g) || window.localStorage).length;
}