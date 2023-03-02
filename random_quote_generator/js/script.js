// IIFE
(function(global){

// Define all the logic after the content has been loaded.
document.addEventListener("DOMContentLoaded", function(event){

	document.getElementById("generateButton").addEventListener("click", function(){

		const quote = generateRandomQuote();
		document.getElementById("quoteDiv").innerHTML = quote;
	});
});

function generateRandomQuote() {
	return "Hello World!";
}

})(window);