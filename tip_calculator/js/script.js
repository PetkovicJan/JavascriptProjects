// IIFE
(function(global){

// Define all the logic after the content has been loaded.
document.addEventListener("DOMContentLoaded", function(event){

	const billInput = document.getElementById("bill");
	const serviceInput = document.getElementById("service");
	const peopleInput = document.getElementById("people");
	const tipOutput = document.getElementById("tipDisplay");

	document.getElementById("calculateButton").addEventListener("click", function () {

		const billAmount = billInput.value;
		const servicePercent = serviceInput.value;
		const numPeople = peopleInput.value;

		const totalTip = billAmount * servicePercent;
		const eachTip = totalTip / numPeople;

		const spaces = "\u00A0".repeat(10);
		const outputString = "Total: " + totalTip + "€" + spaces + "Each: " + eachTip + "€";
		tipOutput.innerHTML = outputString;
	});
});

})(window);