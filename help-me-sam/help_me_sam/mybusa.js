// requires usdsJsHelper.js

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

    var div_id = page_name.replace(/[\. ]/g, '-');

    // insert the DIVs into the DOM
    var fields;
    var qer = $.ajax({
        type: "GET",
        url: chrome.extension.getURL("field_list.json"),
        dataType: "json"
    });
    qer.done(function(msg) {
      usdsJsHelper.loadFieldHandlers(div_id, msg);
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
	    sessionStorage.usdsJsHelperVisible = 'false';
        } else {
            $('div#busa-main').slideDown();
            $(this).text("Minimize the SAM Helper");
	    sessionStorage.usdsJsHelper.Visible = 'true';
        }
    });

    // trigger opening animation
    if (sessionStorage.usdsJsHelperVisible !== 'false') {
	sessionStorage.usdsJsHelperVisible = 'true';
    }

    if ( sessionStorage.usdsJsHelperVisible === 'true') {
	$('div#busa-main').slideDown();
	// $(this).text("Minimize the SAM Helper");
    } else {
	$('div#busa-main').slideUp();
	// $(this).text("View the SAM Helper");
    }
});
