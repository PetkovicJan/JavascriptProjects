// IIFE
(function(global){

function generateRandomColor() {
	const letters = '0123456789ABCDEF';

	var color = '#';
    for (var i = 0; i < 6; i++) {
    	color += letters[Math.floor(Math.random() * 16)];
	}

    return color;
}

// Define all the logic after the content has been loaded.
document.addEventListener("DOMContentLoaded", function(event){

	document.getElementById("changeColorButton").addEventListener("click", function(){
		const newColor = generateRandomColor();

		document.body.style.backgroundColor = newColor;

		document.getElementById("hexColorDisplay").innerHTML = newColor;

	});
});

})(window);