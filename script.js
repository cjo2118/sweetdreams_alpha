var Node = {}
var filter;
Node.ELEMENT_NODE = 1;
Node.DOCUMENT_NODE = 9;
Node.DOCUMENT_FRAGMENT_NODE = 11;
Node.TEXT_NODE = 3;

//adding facebook -- not done yet
var url = window.location.href; 
var twitter;
var facebook;

if(url.indexOf("twitter.com")!= -1){
	twitter = true;
}
else if(url.indexOf("facebook.com") != -1){
	facebook = true;
}

 window.onload = function() {

	console.log("loaded script.js");
	walkWithFilter();
	if(twitter === true){
		var tweets = document.getElementsByClassName("js-tweet-text-container");
	}
	else if (facebook === true){
		var tweets = document.getElementsByClassName("_3ccb");

	}
	$(".js-tweet-text-container").parent().parent().append($('<div class="sweet-message">Hidden by Sweet Dreams. xoxo </div>'));
	$(".sweet-message").css("font-family", "'Crafty Girls', cursive");
	$(".sweet-message").hide();

 }



chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
        	walkWithFilter();		


    console.log("received message from popup: "+request.greeting);

    sendResponse({farewell: "I'm good, thank you popup!"});
});


function walkWithFilter(){
	chrome.storage.sync.get('myFilter', function(e){
			filter = e.myFilter; //when filter is stored as an array, remove the brackets and parse e.myFilter instead
			console.log(filter);
			if(filter !== null){
				new_walk(document.body);
			}
		});

	
}

/* get clicked element from context menu not working yet */
var clickedEl = null;

document.addEventListener("mousedown", function(event){
    //right click
    if(event.button == 2) { 
        clickedEl = event.target;
    }
}, true);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request == "getClickedEl") {
        sendResponse({value: clickedEl.value});
    }
});

/* Walk through the DOM and change css of posts with filtered words */
function new_walk(node) {
	var tweets = document.getElementsByClassName("js-tweet-text-container");
	for (var tweet in tweets) {
		new_hide(tweets[tweet]); //check innerText
	}
	$(".filter").hide();
	$(".filter").parent().css("background-color", "black");
	$(".filter").parent().css("color", "white");

	$(".js-tweet-text-container").each(function (obj) {
		if ($(this).parent().hasClass("filter")) { console.log("showing a message"); $(this).parent().parent().find(".sweet-message").show(); }
		else {console.log("hiding a message"); $(this).parent().parent().find(".sweet-message").hide();  }
	});

}


/* add class 'filter' to posts with banned words */
function new_hide(tweet) {
    var text = tweet.innerText;
    if (text !== undefined) {
    console.log("text of tweet:", text);

    for (var i=0; i < filter.length; i++) {
        if(-1 != text.toLowerCase().indexOf(filter[i].toLowerCase())) { //if filtered term is found in the 
        	// nodeValue = document.getElementsByClassName('filter').nodeValue;
            // nodeValue = nodeValue.replace(new RegExp(MATCH[i], 'g'), REPLACE[i]);
            tweet.parentNode.classList.add('filter');
           console.log("hiding the above tweet");
        }
    }
}
    
}


// function walk(node) {
	
//     var child, next;
// console.log("value of filter in walk "+ filter);
//     switch (node.nodeType) {
//         case Node.ELEMENT_NODE:  // Element
//         case Node.DOCUMENT_NODE:  // Document
//         case Node.DOCUMENT_FRAGMENT_NODE: // Document fragment
//             child = node.firstChild;
//             while (child) {
//                 next = child.nextSibling;
//              //  walk(child);
//              //  console.log("children, child:", child, "next:",  next);
//                 child = next;
//             }
//             break;

//         case Node.TEXT_NODE: // Text node
//            hide(node);
//             break;
//     }
// }


function hide(textNode) {
    var nodeValue = textNode.nodeValue;

    for (var i=0; i < filter.length; i++) {
        if(-1 != nodeValue.indexOf(filter[i])) {
        	// nodeValue = document.getElementsByClassName('filter').nodeValue;
            // nodeValue = nodeValue.replace(new RegExp(MATCH[i], 'g'), REPLACE[i]);
            textNode.parentNode.classList.add('filter');

            //how to change the element by class name! (test)
            var x = document.getElementsByClassName('filter');
			var i;
			for (i = 0; i < x.length; i++) {
				console.log("parent length loop");
	    		x[i].style.backgroundColor = "red";
	    		 $('.filter').parent().parent().parent().parent().addClass("parent-filter");
	    		 // $('.parent-filter').css("background-color", "blue");

	    		 //completely removes parents
	    		 	$('.parent-filter').hide();
	    		 	$('.parent-filter').css("background-color", "black");

				}
			 $('.filter').parent().css("background-color", "red");

        }
    }
    textNode.nodeValue = nodeValue;
}

/* This didn't work - try livequery instead*/
// document.getElementsByClassName(".new-tweets-bar").addEventListener("click", function(){
// 	walkWithFilter();
// 	console.log("new tweets bar!");
// });
		
	