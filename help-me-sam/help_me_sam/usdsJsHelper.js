// Copyright (c) 2013

var usdsJsHelper = usdsJsHelper || {};

// state manager
usdsJsHelper.helperStateString = sessionStorage.state;
if (!usdsJsHelper.helperStateString) {
    usdsJsHelper.helperStateString = localStorage.state;
}

// Called when the url of a tab changes.
// Checks to see if we are on sam.gov
// and shows page action if we are

usdsJsHelper.checkForValidUrl = function(tabId, changeInfo, tab) {
    var samurl = "https://www.sam.gov/portal/";
    var samurllength = samurl.length;
    var taburl = tab.url.substr(0,samurl.length);
    if (taburl == samurl) {
      // ... show the page action. 
      chrome.pageAction.show(tabId);
    }
};  

usdsJsHelper.loadFieldHandlers = function (fields) {
    $.each(fields, function(index, field) {
	$('input[title="' + field.matchString + '"]').on('mouseenter mouseleave focus focusout',
		    { field: field},function(ev) {
	    var currentField = ev.data.field;
	    switch(ev.type) {
		case 'mouseenter':
		if (currentField.required == "true") {
		    var hoverText = "Example of help on hover:<br>" + currentField.hover + "<br>(required)";
		} else {
		    var hoverText = "Example of help on hover:<br>" + currentField.hover + "<br>(optional)";
		}
		var hoverHtmlDiv = $('<div class="floating-help" id="popup-help">'
			+ hoverText + '</div>');
		hoverHtmlDiv.insertAfter(this);
		break;

		case 'mouseleave':
		$('#popup-help').remove();
		break;

		case 'focus':
		$('p.field-focus').html('info for active field:<br>' + currentField.focus);
		break;

		case 'focusout':
		var userEntered = this.value;
		var errorOccurred = 'false';
		var errorMessage = "Error:\n";
		switch (currentField.validator.type) {
		    case "alpha-string":
		    if (this.value.indexOf(" ") != -1) {
			errorMessage += "no spaces allowed\n";
			errorOccurred = 'true';
		    }
		    if (userEntered.length > currentField.validator.rules.length) {
			errorMessage += "maximum length: " + currentField.validator.rules.length;
			errorOccurred = 'true';
		    }
		    if (errorOccurred == 'true') {
			alert(errorMessage);
			this.focus();
			this.select();
		    }
		    break;

		    case "us-phone":
		    var digitsOnly = this.value.replace(/\D/g,"");
		    if (digitsOnly.length != 10) {
			alert(errorMessage + "Telephone numbers must have 10 digits");
			this.focus();
			this.select();
		    } else {
		    this.value = '(' + digitsOnly.substr(0,3) + ')'
			   +  digitsOnly.substr(3,3) + '-' + digitsOnly.substr(6,4);
		}
		break;

		case "email":
		if (!this.value.match( /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/)) {
		    alert(errorMessagej + this.value + ' is not a valid email address');
		}
		break;

		case "confirm":
		if (!this.value.match( /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/)) {
		    alert(errorMessagej + this.value + ' is not a valid email address');
		}
		break;

		default:
		break;
	    }
		break;

		default:
		break;
	    }
	});
    });
}
