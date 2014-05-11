/**
 * 
 */
$(function(){
	startCookieStorage();
	$( document ).tooltip();
	var settings = {
			localStorage :{
				available : !!window.localStorage,
				wait: (window.localStorage)?2000:0,
				saver: 0,
			},

			cookieStorage :{
				available : !window.localStorage,//TODO Do some real checking here
				wait: (window.localStorage)?0:5000,
				saver: 0,
			},
	};
	
	$('.showSettings')
	.button({icons:{primary:'ui-icon-gear'}})
	.click(function(){
		var $localStorage=$('#localStorageWait');
		$localStorage.attr('disabled', !settings.localStorage.available);
		$localStorage.val(settings.localStorage.wait);
		
		var $cookieStorage=$('#cookieStorageWait');
		$cookieStorage.attr('disabled', !settings.cookieStorage.available);
		$cookieStorage.val(settings.cookieStorage.wait);
		
		$('.settingsDialog').dialog('open');
	});
	
	$('.settingsDialog').dialog({
		autoOpen: false,
		modal:true,
		width: 600,
	});
	
	generateSaver(window.localStorage, settings.localStorage);
	generateSaver(window.cookieStorage, settings.cookieStorage);
	
	if(settings.localStorage.available){
		loadFromStorage(window.localStorage);
	} else if(settings.cookieStorage.available){
		loadFromStorage(window.cookieStorage);
	}
	
});

function loadFromStorage(storage) {
	if(storage.hasOwnProperty('tasksRepository')){
		tasks = JSON.parse(storage.getItem('tasksRepository'), function(k, v) {
			if(v.id !== undefined){
				return $.extend(new Task(), v);
			}
			return v;
		});
		$viewGroup = $('.viewGroup'); 
		$viewGroup.children('.task').detach();
		tasks.forEach(function(value) {
			addTaskChrono($viewGroup, value);
		});
	}
}

function generateSaver(storage, storageSettings) {
	if(storageSettings.saver)
		window.clearTimeout(storageSettings.saver);
	if(!storageSettings.available || !storageSettings.wait){
		storageSettings.saver = 0;
		return;
	}
	var ms = storageSettings.wait;
	window.setTimeout(function timeFunction() {
		console.log('Saving');
		storage.setItem('tasksRepository', JSON.stringify(tasks));
		window.setTimeout(timeFunction, ms);
	}, ms);
}

function startCookieStorage() {
	window.cookieStorage = {
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
	window.cookieStorage.length = (document.cookie.match(/\=/g) || window.localStorage).length;
}