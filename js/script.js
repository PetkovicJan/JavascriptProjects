// IIFE
(function(global){

function isNumber(token){
	for (var i = 0; i < 10; i++) {
		if(token == i){
			return true;
		}
	}

	// Treat "." as a number too (same logic from parsing perspective).
	if(token == "."){
		return true;
	}

	return false;
}

function isOperator(token){
	var ops = ["+", "-", "*", "%"];
	for (var i = 0; i < ops.length; i++) {
		if(token == ops[i]){
			return true;
		}
	}

	return false;
}

function computeExpression(expression){

	const parser = {
		first: null,
		second: null,
		op: null,
		firstComplete: false
	};

	// Simple parser into first, second operand and the operator in between.
	for (var i = 0; i < expression.length; i++) {
		var token = expression[i];
		if(isNumber(token)){
			if(parser.firstComplete){
				if(parser.second){
					parser.second += token;
				} else {
					parser.second = token;
				}
			} else {
				if(parser.first) {
					parser.first += token;
				} else {
					parser.first = token;
				}
			}
		} else if(isOperator(token)){
			parser.op = token;
			parser.firstComplete = true;
		} else {
			console.log("Unknown token!");
		}

	}

	// Compute the value.
	var first = parser.first;
	var second = parser.second;
	var op = parser.op;
	if(op == "+"){
		return parseFloat(first) + parseFloat(second);
	} else if(op == "-"){
		return parseFloat(first) - parseFloat(second);
	} else if(op == "*"){
		return parseFloat(first) * parseFloat(second);
	} else if(op == "%"){
		return parseFloat(first) / parseFloat(second);
	}
}

// Define all the logic after the content has been loaded.
document.addEventListener("DOMContentLoaded", function(event){

	// Handle numerical keys.
	for (var i = 0; i < 10; i++) {
		var numKey = "n" + i;
		document.getElementById(numKey).addEventListener("click", function(){
			document.getElementById("display").innerHTML += this.innerHTML;
		});
	}

	// Handle operations except equal sign, which computes the value.
	var ops = ["+", "-", "*", "%", "."];
	for (var i = 0; i < ops.length; i++) {
		var opKey = "o" + ops[i];
		document.getElementById(opKey).addEventListener("click", function(){
			document.getElementById("display").innerHTML += this.innerHTML;
		});
	}

	var eqKey = "o=";
	document.getElementById(eqKey).addEventListener("click", function(){
		var displayedValue = document.getElementById("display").innerHTML;
		var computedValue = computeExpression(displayedValue);
		document.getElementById("display").innerHTML = computedValue;
	});

});

})(window);