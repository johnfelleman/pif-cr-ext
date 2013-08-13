$(document).ready(function() {
    // define the main DIVs
    var sam_div = $('#UIPortalApplication');
    var busa_main_div = $('<div class="busa" id="busa-main"><div id="busa-content"></div></div>');
    var busa_toggle_div = $('<div class="busa"><p><a href="#" id="busa-toggle">Close</a></p></div>');

    //console.log(chrome.extension.getURL("busa-main.html"));
    //$('div#busa-content').load($.open(chrome.extension.getURL("busa-main.html")));
    busa_main_div.hide();
    busa_main_div.insertBefore(sam_div);
    busa_toggle_div.insertAfter(busa_main_div);

    // contextual page info
    var page_name = $("div.page_heading").text();
    if (!page_name) {
        page_name = 'SAM.gov';
    } else {
        busa_main_div.show();
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
    //         alert("Oh noes!! The call to modus-operandi failed!");
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
        if ( busa_main_div.is(":visible") ) {
            busa_main_div.slideUp();
            
            $(this).text("Get Help for " + page_name);
        } else {
            busa_main_div.slideDown();
            $(this).text("Close");
        }
    });

    // trigger opening animation
    busa_main_div.slideDown();
});
