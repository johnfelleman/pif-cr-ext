// Copyright (c) 2013

// Called when the url of a tab changes.
// Checks to see if we are on sam.gov
// and shows page action if we are

function checkForValidUrl(tabId, changeInfo, tab) {
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
