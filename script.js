var Node = {}
var filter;
Node.ELEMENT_NODE = 1;
Node.DOCUMENT_NODE = 9;
Node.DOCUMENT_FRAGMENT_NODE = 11;
Node.TEXT_NODE = 3;



 window.onload = function() {

	console.log("loaded script.js");
	walkWithFilter();
	var tweets = document.getElementsByClassName("js-tweet-text-container");
	$(".js-tweet-text-container").parent().parent().append($('<div class="sweet-message">Hidden by Sweet Dreams. </div>'));
	$(".sweet-message").css("font-family", "'Crafty Girls', cursive");
	$(".sweet-message").hide();
	
 }



chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "new filter saved") {
    	walkWithFilter();
    	return true;
       sendResponse({farewell: "goodbye"});
  	}
  	return false;
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

// window.onload = function() {
// 	document.getElementById("save-button").onclick = function(){
// 	var value = document.getElementById('new-filter').value;

// 		chrome.storage.sync.set({'myFilter': value}, function(){
// 			alert("Success!");
// 			walkWithFilter();
// 		});

// 		chrome.storage.sync.get('myFilter', function(e){
// 			var word = e.myFilter;
// 			console.log(word);
// 			if(word !== null){
// 				walk(document.body, word);
// 			}
// 		}); 
// 	}

// 	walkWithFilter();
// }


// Enter things that you'd like to replace


// var MATCH = $('#new-filter').val(); 

//walk(document.body);


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


function walk(node) {
	
    var child, next;
console.log("value of filter in walk "+ filter);
    switch (node.nodeType) {
        case Node.ELEMENT_NODE:  // Element
        case Node.DOCUMENT_NODE:  // Document
        case Node.DOCUMENT_FRAGMENT_NODE: // Document fragment
            child = node.firstChild;
            while (child) {
                next = child.nextSibling;
             //  walk(child);
             //  console.log("children, child:", child, "next:",  next);
                child = next;
            }
            break;

        case Node.TEXT_NODE: // Text node
           hide(node);
            break;
    }
}


function bad_walk(node, filter) {
	// Function from here for replacing text: http://is.gd/mwZp7E
	console.log("value of filter in walk "+ filter + " node: " + node);
	var child, next;
	if(node !== null && filter !== undefined) {

		switch (node.nodeType) {
			case Node.ELEMENT_NODE:  // Element
			case Node.DOCUMENT_NODE:  // Document
			case Node.DOCUMENT_FRAGMENT_NODE: // Document fragment
				child = node.firstChild;
				
			
			while (child) {
				next = child.nextSibling;
				walk(child, filter);
				child = next;
			}

			break;

			case Node.TEXT_NODE: // Text node
			hide(node, filter);
			break;
	}
	}//if statement
}


// function replaceText(textNode) {
// 	var v = textNode.nodeValue;

// 	// Go through and match/replace all the strings we've given it, using RegExp.
// 	for (var i = 0; i < MATCH.length; i++) {
		

// 		v = v.replace(new RegExp('\\b' + MATCH[i] + '\\b', 'g'), REPLACE[i]);
// 	}

// 	textNode.nodeValue = v;
// }

// function hide(textNode) {
// 	var element = document.createElement(textNode.tagName);
// 	var content = element.innerHTML;
// 	alert(content);
// 	var cName = 'filter'
// 	var badWord = textNode.nodeValue;
// 	var replaceWord = "";
// 	textNode.nodeValue.className = cName;

// 	//Go through and match/replace strings equal to MATCH
// 	for (var i=0; i< MATCH.length; i++) {
// 		// badWord.className("filter");
// 		replaceWord = document.getElementsByClassName(cName).innerHTML;
// 		replaceWord = replaceWord.replace(new RegExp('\\b' + MATCH[i] + '\\b', 'g'), REPLACE[i]);
// 	}
// 	textNode = replaceWord;
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