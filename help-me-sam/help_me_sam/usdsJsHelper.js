// Copyright (c) 2013

// var $, alert, Storage, localStorage, sessionStorage;

var usdsJsHelper = {

    loadFieldHandlers: function (fields) {
	$.each(fields, function(text, field) {
	    $('input[title="' + field.matchString + '"]').on('mouseenter mouseleave focus focusout',
			{ field: field},function(ev) {
		var digitsOnly, currentField, userEntered, errorOccurred, errorMessage, hoverText, hoverHtmlDiv;
		currentField = ev.data.field;
		switch(ev.type) {
		    case 'mouseenter':
		    if (currentField.required === "true") {
			hoverText = "Example of help on hover:<br>" + currentField.hover + "<br>(required)";
		    } else {
			hoverText = "Example of help on hover:<br>" + currentField.hover + "<br>(optional)";
		    }
		    hoverHtmlDiv = $('<div class="floating-help" id="popup-help">'
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
		    userEntered = this.value;
		    errorOccurred = 'false';
		    errorMessage = "Error:\n";
		    switch (currentField.validator.type) {
			case "alpha-string":
			if (this.value.indexOf(" ") !== -1) {
			    errorMessage += "no spaces allowed\n";
			    errorOccurred = 'true';
			}
			if (userEntered.length > currentField.validator.rules.length) {
			    errorMessage += "maximum length: " + currentField.validator.rules.length;
			    errorOccurred = 'true';
			}
			if (errorOccurred === 'true') {
			    alert(errorMessage);
			    this.focus();
			    this.select();
			}
			break;

			case "us-phone":
			digitsOnly = this.value.replace(/\D/g,"");
			if (digitsOnly.length !== 10) {
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
			alert(errorMessage + this.value + ' is not a valid email address');
		    }
		    break;

		    case "confirm":
		    if (!this.value.match( /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/)) {
			alert(errorMessage + this.value + ' is not a valid email address');
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
    },

    visible: {

	get: function() {
	    return true;
	},
	set: function() {
	    return;
	}
    }

};

// initialize state manager
// if localStorage is in use, continue to use it
// otherwise use sessionStorage

if(typeof Storage !== "undefined") {
    var storage = localStorage.usdsJsHelperState;
    if (!storage) {
	storage = sessionStorage.usdsJsHelperState;
    }
    usdsJsHelper.visible.get = function () {
	if (storage === 'false') {
	    return false;
	}
	return true;
    };
    usdsJsHelper.visible.set = function (value) {
	storage = value;
	return;
    };
}
