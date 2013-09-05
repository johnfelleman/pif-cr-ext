// In HTML5, use session storage to set/get the open/minimized state of the helper
// If not HTML5, always return minimized (this could be improved with a SESSION cookie)
    
$(document).ready(function() {

    // define the main DIVs
    if (sessionStorage.getItem("visible") == null) {
    	sessionStorage.setItem("visible", 'true');
    }
    var sam_div = $('#UIPortalApplication');
    var busa_main_div = $('<div class="busa" id="busa-main"><div id="busa-content"></div></div>');
    var busa_toggle_div =
	$('<div class="busa"><p><a href="#" id="busa-toggle">Minimize the SAM Helper</a></p></div>');
    var floating_help_div =
	$('<div class="floating-help-box" id="display-hover-text" style="z-index:20000">hat</div>');
    busa_main_div.insertBefore(sam_div);
    busa_toggle_div.insertAfter(busa_main_div);
    floating_help_div.insertAfter(busa_toggle_div);

    // The code below should read some info from a local JSON file and build the field handlers
    // ...but it doesn't...at least not yet

    // $.getJSON('field_list.json', function(data) {
    	// alert('got some JSON');
	// items = data.list;
	// $.each(items, function(key, val) {
	    // alert('key: ' + key + ' value: ' + value);
	      // });
	// });

    // So we do this instead
    // Each of these objects should have come from JSON
    // Object properties:
    //		"matchString" : <string>	<=> value of 'title' attribute in page
    //		"required" : "true"|"false"	<=> indicates whether this field is required
    //		"valid"	: <string>		<=> free text describing valid input (will become schema)
    //		"hover" : <string>		<=> text to display when mouse hovers over field
    //		"focused" : <string>		<=> text to display when the field has focus
    //		"unfocused" : <string>		<=> text to display when focus is lost (will be validation)

    title = {
	matchString: "Title",
	required: "false",
	valid: "Any pull-down value",
	hover: "Your address title",
	focus: "Choose a value",
	unfocused: "Oops, your title is invalid"
    };
    first_name = {
	matchString: "First Name",
	required: "true",
	hover: "you are on First Name!",
	valid: "No spaces",
	focus: "Enter your name",
	unfocused: "don't you know your own name?"
    };
    middle_initial = {
	matchString: "Middle Initial",
	required: "false",
	valid: "one letter only, no punctuation",
	hover: "your middle initial, please",
	focus: "enter your initial",
	unfocused: "one letter only please"
    };
    last_name = {
	matchString: "Last Name",
	required: "true",
	valid: "No spaces or punctuation",
	hover: "Your legal last name",
	focus: "please enter your family name",
	unfocused: "Oops, your name is invalid"
    };
    suffix = {
	matchString: "Suffix",
	required: "false",
	valid: "any characters",
	hover: "Do you use a suffix after your name",
	focus: "go ahead enter it now",
	unfocused: "look okay to me"
    };
    email_address = {
	matchString: "Email Address",
	required: "true",
	valid: "must be a legal email address",
	hover: "this is your contact email address",
	focus: "please enter your email address",
	unfocused: "this is not a valid email"
    };
    
    var fields = [ title, first_name, middle_initial, last_name, suffix, email_address ];

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

	$('input[title="' + fields[index].matchString + '"]').focusout(
		    { field: fields[index]},function(ev) {
	    var field = ev.data.field;
	    $('p.field-focus').html("");
	});

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

    // pull API data from modus-operandi
    // $.getJSON('http://mo.tynsax.com/api/registrations/1/full_map')
    //     .done(function(json) {
    //         //page_name = json['name'].toString();
    //         //$('div#busa-content').append(page_name);
    //     })
    //     .fail(function(jqxhr, textStatus, error) {
    //     });

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
