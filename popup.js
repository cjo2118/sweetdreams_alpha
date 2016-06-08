console.log("loaded popup");


// document.getElementById('save-button').onclick = function(){
// 	console.log("I clicked the save button");
// }


 window.onload = function () {
 	chrome.storage.sync.get('myFilter', function(e){
			var filter = e.myFilter; 

			for (var i in filter) {
				filter[i] = '<button class="cloud-elements">' + filter[i] + '</button>';
			}

			filter = filter.join("");

			//adds buttons to filter-cloud div in html 
			document.getElementById('filter-cloud').innerHTML = filter;
			
			console.log("filter elements: " + filter);

			var cloud = document.getElementsByClassName('cloud-elements');
			console.log("Cloud elements are: " + cloud);

			for (var f = 0; f< cloud.length; f++) {
				console.log("looping" + cloud[f].innerHTML + "at " + f);
				//adding onclick to each element 
				cloud[f].onclick = function () { 
					console.log("removing " + this.innerHTML); 
					remove(this.innerHTML); 
				}
			}

		
		});
	document.getElementById("save-button").onclick = function(){
		console.log("added click function");
		var value = document.getElementById('new-filter').value;
		value = value.trim();
		console.log("value saved is " + value);
		if(value !== ''){

		chrome.storage.sync.get('myFilter', function(e){
			var filter = e.myFilter; //when filter is stored as an array, remove the brackets and parse e.myFilter instead
			console.log("FROM STORAGE:", filter);
			if(filter === null || !Array.isArray(filter)){
				filter = [];
			}
			filter.push(value); console.log("array filter:", filter);
/**
			var filterCloud = [];

			for (var i in filter) {
				filterCloud.push('<button class="cloud-elements">' + filter[i] + '</button>');
			}


			document.getElementById('filter-cloud').innerHTML = filterCloud.join("");
**/
			chrome.storage.sync.set({'myFilter': filter}, function(){
				alert("Success!");
				chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				  chrome.tabs.sendMessage(tabs[0].id, {greeting: "new filter saved"}, function(response) {
				    console.log(response.farewell);

				  });
				});
		});
		

		});
		}
	}
}


function remove(str) { //takes str as the string to be removed from storage
//get stored array and make a new array without str and then set stored array to new array

chrome.storage.sync.get('myFilter', function(e){
	var filter = e.myFilter; 
	var i = filter.indexOf(str);
	if(i != -1) {
		filter.splice(i, 1);
	}
	chrome.storage.sync.set({'myFilter': filter}, function(){
		
	});

});

}