// USDS helper library namespace
var usdsJsHelper = usdsJsHelper || {};

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

$(document).ready(function() {

    // define the main DIVs
    var sam_div = $('#UIPortalApplication');
    var busa_main_div = $('<div class="busa" id="busa-main"><div id="busa-content"></div></div>');
    var busa_toggle_div =
	$('<div class="busa"><p><a href="#" id="busa-toggle">Minimize the SAM Helper</a></p></div>');
    var floating_help_div =
	$('<div class="floating-help-box" id="display-hover-text"></div>');
    busa_main_div.insertBefore(sam_div);
    busa_toggle_div.insertAfter(busa_main_div);
    floating_help_div.insertAfter(busa_toggle_div);

    if (sessionStorage.getItem("visible") == null) {
    	sessionStorage.setItem("visible", 'true');
    }

    // contextual page info
    var page_name = $("div.page_heading").text();
    if (!page_name) {
        page_name = 'SAM.gov';
        $('div#busa-main').hide();
    }

    console.log("Page Name: " + page_name);
    var div_id = page_name.replace(/ /g, '-');
    div_id = div_id.replace(/\./g, '-');
    console.log("DIV ID: " + div_id);

    // insert the DIVs into the DOM
    var fields;
    var qer = $.ajax({
        type: "GET",
        url: chrome.extension.getURL("field_list.json"),
        dataType: "json"
    });
    qer.done(function(msg) {
      usdsJsHelper.loadFieldHandlers(msg);
    });
    var req = $.ajax({
        type: "GET",
        url: chrome.extension.getURL("busa-main.html"),
        dataType: "html"
    });
    req.done(function(msg) {
        $('div#busa-content').html($(msg).filter("#" + div_id));
        $(msg).filter('#busa-customer-svc').insertAfter($('div#busa-content'));
	$('dd#button-me').html( '<button id="view-workflow" name="show-mo" type="button">View</button>');
	$('dd#button-me').click(function() {
	$(window.open('', 'workflow',
	    'location=no, height=600, width=600').document.body).html(sessionStorage.processMap);
	});
    });
    req.fail(function(jqXHR, textStatus) {
        console.log("Request failed: " + textStatus);
    });

    // read the JSON workflow data
    sessionStorage.processMap = '{}';
    $.getJSON('http://mo.tynsax.com/api/operations/sam-system-of-award-management-registration-process/map',
    		function(data) {
	sessionStorage.processMap = JSON.stringify(data);
    });

    // define toggle/click/slide behavior
    $('#busa-toggle').click(function() {
        if ( $('div#busa-main').is(":visible") ) {
            $('div#busa-main').slideUp();
            $(this).text("View assistance for " + page_name);
	    sessionStorage.setItem("visible", 'false');
        } else {
            $('div#busa-main').slideDown();
            $(this).text("Minimize the SAM Helper");
	    sessionStorage.setItem("visible", 'true');
        }
    });

    // trigger opening animation
    if (sessionStorage.getItem("visible") != 'false') {
	// $('div#busa-main').slideDown();
	// $(this).text("Minimize the SAM Helper");
    }
});
