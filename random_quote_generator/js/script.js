// IIFE
(function(global){

// Define all the logic after the content has been loaded.
document.addEventListener("DOMContentLoaded", function(event){

	document.getElementById("generateButton").addEventListener("click", function(){

		const onGenerate = (result) => {
			document.getElementById("quoteDiv").innerHTML = result.quote + " " + result.author;
		};

		generateRandomQuote(onGenerate);
	});
});

function generateRandomQuote(onGenerate) {
	const url = "https://api.breakingbadquotes.xyz/v1/quotes";
	fetch(url)
	.then(quote => quote.json())
	.then(result => {
		onGenerate(result[0]);
	});
}

})(window);