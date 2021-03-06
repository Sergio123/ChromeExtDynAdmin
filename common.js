// Console object name
var EXT_CONSOLE_DIV = "DynAdminExtentionConsole";
var EXT_CONSOLE_DIV_ID = "#" + EXT_CONSOLE_DIV;
var EXT_CONSOLE_STATUS_DIV = 'custom_status_div';
var EXT_CONSOLE_STATUS_DIV_ID = '#' + EXT_CONSOLE_STATUS_DIV;
var BUTTON_STYLE = 'margin:2px;padding:2px;';
var BUTTON_BORDER_RED = 'border: 2px solid red;';
var BUTTON_BORDER_GREEN = 'border: 2px solid green;';

//TODO for now it forks only for boolean properties
function addChangePropertyValueButton(buttonName, propertyName){
	var button = createButton(buttonName, function(){
			var propertyObject = getPropertyValueObject(propertyName);
			var currentValue = $.parseJSON(propertyObject.text());
			$.ajax({
				type: 'POST',
				url: window.location.href,
				data: {'propertyName':propertyName,'newValue':!currentValue,'change':'Change Value'},
				success: function (data) {
					propertyObject.text(!currentValue);
					button.setAttribute('style', getButtonStyleOfBooleanTrigger(!currentValue));
                }
			})
		}
	);
	button.setAttribute('style', getButtonStyleOfBooleanTrigger(getBooleanPropertyValue(propertyName)));
	$(EXT_CONSOLE_DIV_ID).append(button);
}

function getPropertyValueObject(propertyName){
	return getPropertyObject(propertyName).closest('td').next().find('span');
}

function getPropertyObject(propertyName){
    return $('a:contains("' + propertyName + '")').first();
}

function getButtonStyleOfBooleanTrigger(value){
	return BUTTON_STYLE + (value ? BUTTON_BORDER_GREEN : BUTTON_BORDER_RED);
}

function getBooleanPropertyValue(propertyName){
	return $.parseJSON(getPropertyValue(propertyName));
}

function getPropertyValue(propertyName){
	return getPropertyObject(propertyName).closest('td').next().find('span').text();
}


function clearStatusDiv(name){
	$('div #custom_' + name).html('');
}


function addCacheInvalidationButton(className, methodName){
	var className = $('a:contains("' + className + '")');
	if (className.length > 0){
		$(EXT_CONSOLE_DIV_ID).append('<br>');
		$(EXT_CONSOLE_DIV_ID).append('Caches:');
		var invalCacheButName = 'Invalidate';
		var successFunc = function(){
			//console.log('Success');
			var statusDiv = $(EXT_CONSOLE_STATUS_DIV_ID);
			statusDiv.html('OK');
			setTimeout(function (){statusDiv.html('');}, 10000);
		};
		var errorFunc = function(){
			//console.log('Error');
			var statusDiv = $(EXT_CONSOLE_STATUS_DIV_ID);
			statusDiv.html('ERROR');
			setTimeout(function (){statusDiv.html('');}, 10000);
		};
		var startFunction = function(){
			//console.log('Start');
			var statusDiv = $(EXT_CONSOLE_STATUS_DIV_ID);
			statusDiv.html('Pending...');
		}
		addMethodInvocationButton(invalCacheButName, methodName, successFunc, errorFunc, startFunction);
	}
}

function addMethodInvocationButton(buttonName, methodName, successFunc, errorFunc, startFunction){
	var button = createButton(buttonName, function(){
			startFunction();
			$.ajax({
				type: 'POST',
				url: window.location.href,
				data: {'invokeMethod':methodName,'submit':'Invoke Method'},
				success: successFunc,
				error: errorFunc
			})
		}
	);
	button.setAttribute('style', 'margin:2px;');
	$(EXT_CONSOLE_DIV_ID).append(button);
}

function addPropertyRedirectButton(buttonName, propertyName){
   var button = createButton(buttonName, function(){
            window.location.href = window.location.href + '?propertyName=' + propertyName;
   		}
   	);
   	button.setAttribute('style', 'margin:2px;');
   	$(EXT_CONSOLE_DIV_ID).append('<br>');
   	$(EXT_CONSOLE_DIV_ID).append(button);
}