// IIFE
(function(global){

// Define all the logic after the content has been loaded.
document.addEventListener("DOMContentLoaded", function(event){

	const quoteElement = document.getElementById("quote");
	const authorElement = document.getElementById("author");

	const onGenerate = ({ quote, author }) => {
		quoteElement.innerHTML = '\"' + quote + '\"';
		authorElement.innerHTML = author;
	};

	document.getElementById("generateButton").addEventListener("click", function(){
		generateRandomQuote(onGenerate);
	});

	// Initialize the page with a quote right after loading.
	generateRandomQuote(onGenerate);
});

function generateRandomQuote(onGenerate) {
	const url = "https://api.breakingbadquotes.xyz/v1/quotes";
	fetch(url)
	.then(quote => quote.json())
	.then(result => {
		// Turns out that the result is an array of quotes -> we only use the first one.
		onGenerate(result[0]);
	});
}

})(window);