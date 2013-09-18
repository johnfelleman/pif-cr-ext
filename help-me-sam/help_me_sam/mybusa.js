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

    var pageToken = page_name.replace(/[\. ]/g, '_');

    // insert the DIVs into the DOM
    var fields, contentItems;

    // Get the field data (for now, from a file, someday from MO server)
    $.ajax({
        type: "GET",
        url: chrome.extension.getURL("field_list.json"),
        dataType: "json"
    }).done(function(msg) {
      usdsJsHelper.loadFieldHandlers(pageToken, msg);
    }).fail(function() {
      alert('failed to read JSON field data');
    });

    // Temporary way to get overview text for the pages
    overviews = {
        "SAM_gov":
        "<p>Welcome to the SAM Helper.  This utility will guide you through the process of registering with SAM, so that you can do business with the government.</p><p>To begin, click the 'Create User Account' button in the leftmost box below.</p>",
        "Create_Account":
        "<p>To begin, you must create a user account with SAM.  Start that process by clicing the 'Individual Account' button below on the left.</p>",
        "Personal_Information":
        "<p>The first step in creating your user account is to collect some personal information.  Please go ahead and fill out the screen below.  Make sure to complete the required items marked with a '*'.  The helper will assist you in entering valid information.</p>"
    };

    // Get the content for the help items
    var pageContent;
    $.ajax({
        type: "GET",
        url: chrome.extension.getURL("busa-main.html"),
        dataType: "html"
    }).done( function(data) {
        pageContent = usdsJsHelper.contentForPgItm(data, pageToken);
        var overviewText = '<div class="helper_item overview" title="overview_text">'
            + overviews[pageToken]
            + '</div>';
        $('div#busa-content').html( overviewText);
        $('<div class="helper_item help_info" title="help">\n\
            <dl>\n\
            <dt>Getting Help: Email</dt>\n\
            <dd>\n\
            <a href="mailto:help.with.sam@businessusa.gov">\n\
            help.with.sam@businessusa.gov</a>\n\
            </dd>\n\
            <!-- <dt>see the MO workflow</dt>\n\-->\n\
            <!-- <dd id="button-me"></dd>\n\ -->\n\
            <!-- <dd id="wiz-me"></dd>\n\ -->\n\
            </dl>\n\
            </div>').insertAfter($('div#busa-content'));
        // $('div#busa-content').html( $(pageContent).filter('.helper_item[title="overview_text"]'));
        // $(pageContent).filter('.helper_item[title="help"]').insertAfter($('div#busa-content'));

        $('dd#button-me').html( '<button id="view-workflow" name="show-mo" type="button">View</button>');
        $('dd#button-me').click(function() {
            $(window.open('', 'workflow',
                'location=no, height=600, width=600').document.body).html(sessionStorage.processMap);
        });
        $('dd#wiz-me').
            html( '<button id="launch-wizard" name="launch-wizard" type="button">Take me to the Wizard</button>');
        $('dd#wiz-me').click(function() {
            $(window.open('', 'wizard',
                'location=no, height=600, width=600').document.body).html("I will be your wizard");
        });
    }).fail(function(jqXHR, textStatus) {
        alert('failed to read page content');
    });


    // get some random stuff (this needs to be refactored out of existence
    // req = $.ajax({
        // type: "GET",
        // url: chrome.extension.getURL("busa-main.html"),
        // dataType: "html"
    // }).done(function(msg) {
        // $('div#busa-content').html($(msg).filter("#" + pageToken));
        // $(msg).filter('#help_info').insertAfter($('div#busa-content'));
// 
        // $('dd#button-me').html( '<button id="view-workflow" name="show-mo" type="button">View</button>');
        // $('dd#button-me').click(function() {
            // $(window.open('', 'workflow',
                // 'location=no, height=600, width=600').document.body).html(sessionStorage.processMap);
        // });
        // $('dd#wiz-me').html( '<button id="launch-wizard" name="launch-wizard" type="button">Take me to the Wizard</button>');
        // $('dd#wiz-me').click(function() {
        // $(window.open('', 'wizard',
            // 'location=no, height=600, width=600').document.body).html("I will be your wizard");
        // });
    // }).fail(function(jqXHR, textStatus) {
        // alert('failed to read some random stuff');
    // });

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
	    sessionStorage.usdsJsHelperVisible = 'true';
        }
    });

    // trigger opening animation
    if (sessionStorage.usdsJsHelperVisible !== 'false') {
        sessionStorage.usdsJsHelperVisible = 'true';
    }

    if ( sessionStorage.usdsJsHelperVisible === 'true') {
        $('div#busa-main').slideDown();
    } else {
        $('div#busa-main').slideUp();
    }
});
