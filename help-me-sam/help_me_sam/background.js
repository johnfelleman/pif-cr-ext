// Copyright (c) 2013

// Handle a command from a user page
// request object properties:
//	"command" : "get-json-from-url" | "signs-of-life"	(maybe more later?)
//	"url": <url-name>	(relative to extension root OR absolute)

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch (request.command) {
	case 'get-json-from-url':
	$.getJSON(request.url,  function(data) {
	    sendResponse({result: data});
	});
	break;

	case 'signs-of-life':
	sendResponse({status: "nominal"});
	break;

	default:
	break;
	}
    return true;
    });

// Called when the url of a tab changes.
// Checks to see if we are on sam.gov
// and shows page action if we are

checkForValidUrl = function(tabId, changeInfo, tab) {
    var samurl = "https://www.sam.gov/portal/";
    var samurllength = samurl.length;
    var taburl = tab.url.substr(0,samurl.length);
    if (taburl == samurl) {
      // ... show the page action. 
      chrome.pageAction.show(tabId);
    }
};  
	  
// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);
