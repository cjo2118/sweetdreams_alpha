//  window.onload = function() {
//  	//CONTEXT MENU this should go somewhere else, but we'll need to resolve onload conflict
//  	alert("Background script loaded");
// 	chrome.contextMenus.create({
// 		id: "custom-context-a",
// 		title: "Hide Tweet",
// 		contexts: ["launcher", "all"],
// 	}, function(){
// 		console.log(chrome.runtime.lastError);
// 	});

// 	chrome.contextMenus.onClicked.addListener(contextClicked.bind(this));
// };

// function contextClicked(e){
// 	console.log(e.menuItemId);
// }

/*listen for message from popup, send message to content script */
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a background script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "hello from popup") {
        alert("message passed to background script");
        console.log("message passed to background script");
        
         /* send message to content script */
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                  chrome.tabs.sendMessage(tabs[0].id, {greeting: "popup sent message"}, function(response) {
                    console.log(response.farewell);

                  });
                });
         return true;
       sendResponse({farewell: "goodbye"});
    }
    return false;
  });



/* Create a context-menu */
chrome.contextMenus.create({
    id: "myContextMenu",   // <-- mandatory with event-pages
    title: "Hide Tweet",
    contexts: ["page"]
});

/* Register a listener for the `onClicked` event */
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (tab) {
        
        
        /* Inject the code into the current tab */
        chrome.tabs.executeScript(tab.id, { code: code });
    }
});

//background
function mycallback(info, tab) {
    chrome.tabs.sendMessage(tab.id, "getClickedEl", function(clickedEl) {
        elt.value = clickedEl.value;
    });
}
