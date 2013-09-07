// Create a USDS helper library namespace

var usdsJsHelper = {};

// This will be cool someday when I am smarter
// (function(context) { 
    // var id = 0;

    // context.next = function() {
	// return id++;    
    // };
      
    // context.reset = function() {
	// id = 0;     
    // }
// })(usdsJsHelper);  

// window.console && console.log(
// usdsJsHelper.next(),
// usdsJsHelper.next(),
// usdsJsHelper.reset(),
// usdsJsHelper.next()
// ) //0, 1, undefined, 0

usdsJsHelper.loadFieldHandlers = function(fields) {
    for (var index = 0; index < fields.length; index++) {
	$('input[title="' + fields[index].matchString + '"]').mouseenter(
		    { field: fields[index]},function(ev) {
	    var field = ev.data.field;

	   
	    if (field.required == "true") {
		var hoverText = "Example of help on hover:<br>" + field.hover + "<br>(required)";
	    } else {
		var hoverText = "Example of help on hover:<br>" + field.hover + "<br>(optional)";
	    }
	    topValue = '"' + ev.pageY + 'px"';
	    leftValue = '"' + (ev.pageX + 100) + 'px"';
	    // $('div.floating-help-box').css( {
			    // "visibility": "visible",
			    // "z-index": "1000",
			    // "top": "300px",
			    // "left": "300px"
			    // });
	    // $('div.floating-help-box').html(hoverText);
	    // $('p.field-hover').html(hoverText);

	    var hoverHtmlDiv = $('<div class="floating-help" id="popup-help">'
		    // + 'style="visibility:visible; top:' + ev.pageY
		    // + '; left:' + (ev.pageX + 100) + '; position:fixed">'
		    + hoverText + '</div>');
	    hoverHtmlDiv.insertAfter(this);
	});

	$('input[title="' + fields[index].matchString + '"]').mouseleave(
		    { field: fields[index]},function(ev) {
	    var field = ev.data.field;
	    $('#popup-help').remove();
	    // $('div.floating-help-box').css( { "visibility": "visible", });
	    // $('p.field-hover').html("hide me");
	});

	$('input[title="' + fields[index].matchString + '"]').focus(
		    { field: fields[index]},function(ev) {
	    var field = ev.data.field;
	    $('p.field-focus').html('info for active field:<br>' + field.focus);
	});

	// Do validation when leaving field
	$('input[title="' + fields[index].matchString + '"]').focusout(
		    { field: fields[index]},function(ev) {
	    var field = ev.data.field;
	    var userEntered = this.value;
	    var errorOccurred = 'false';
	    var errorMessage = "Error:\n";
	    switch (field.validator.type) {
		case "alpha-string":
		if (this.value.indexOf(" ") != -1) {
		    errorMessage += "no spaces allowed\n";
		    errorOccurred = 'true';
		}
		if (userEntered.length > field.validator.rules.length) {
		    errorMessage += "maximum length: " + field.validator.rules.length;
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
	});

    }
}

$(document).ready(function() {

    // define the main DIVs
    var sam_div = $('#UIPortalApplication');
    var busa_main_div = $('<div class="busa" id="busa-main"><div id="busa-content"></div></div>');
    var busa_toggle_div =
	$('<div class="busa"><p><a href="#" id="busa-toggle">Minimize the SAM Helper</a></p></div>');
    var floating_help_div =
	$('<div class="floating-help-box" id="display-hover-text" style="z-index:20000">hat</div>');
    busa_main_div.insertBefore(sam_div);
    busa_toggle_div.insertAfter(busa_main_div);
    floating_help_div.insertAfter(busa_toggle_div);

    if (sessionStorage.getItem("visible") == null) {
    	sessionStorage.setItem("visible", 'true');
    }

    // use the background page to get the JSON
    var fields;
    chrome.runtime.sendMessage({command: "get-json-from-url", url: "field_list.json"}, function(response) {
      usdsJsHelper.loadFieldHandlers(response.result);
      });

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
    var req = $.ajax({
        type: "GET",
        url: chrome.extension.getURL("busa-main.html"),
        dataType: "html"
    });
    req.done(function(msg) {
        $('div#busa-content').html($(msg).filter("#" + div_id));
        $(msg).filter('#busa-customer-svc').insertAfter($('div#busa-content'));
    });
    req.fail(function(jqXHR, textStatus) {
        console.log("Request failed: " + textStatus);
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

    // read the JSON workflow data
    $.getJSON('http://mo.tynsax.com/api/operations/sam-system-of-award-management-registration-process/map',
    		function(data) {
	sessionStorage.setItem("processMap",data);
    });
    // trigger opening animation
    if (sessionStorage.getItem("visible") != 'false') {
	// $('div#busa-main').slideDown();
	// $(this).text("Minimize the SAM Helper");
    }
});
