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
	const ops = ["+", "-", "*", "/", "(", ")", "^"];
	for (var i = 0; i < ops.length; i++) {
		if(token == ops[i]){
			return true;
		}
	}

	return false;
}

// Tokenize the string expression and return the array of tokens - objects with the 2 following properties: type and value.
function tokenize(expression) {
	const tokens = new Array();

	var currentNum = "";
	var isNumInProgress = false;
	for (var i = 0; i < expression.length; i++) {

		const char = expression[i];
		if (char === " ") {
			continue;
		}

		if (isNumber(char)){
			currentNum += char;
			isNumInProgress = true;
		} else {
			// First check if the number parsing was in progress - if it is, store it.
			if (isNumInProgress){
				tokens.push({ type: "num", value: parseFloat(currentNum) });
				currentNum = "";
				isNumInProgress = false;
			}

			if (isOperator(char)){
				tokens.push({ type: "op", value: char});
			} else {
				console.log("Unknown token!");
			}
		}
	}

	// Last check in case that the number parsing was in progress.
	if (isNumInProgress){
		tokens.push({ type: "num", value: parseFloat(currentNum) });
	}

	return tokens;
}

function evaluateBinaryOperation(first, second, op) {
	if (op === '+') {
		return first + second;
	} else if (op === '-') {
		return first - second;
	} else if(op === '*') {
		return first * second;
	} else if (op === '/') {
		return first / second;
	} else if (op === '^') {
		return first ** second;
	} else {
		console.log("Unknown token!");
		return undefined;
	}
}

function getOperatorPrecedenceValue(op) {
	if((op === '+') || (op === '-')) {
		return 0;
	} else if ((op === '*') || (op === '/')) {
		return 1;
	} else if (op === '^') {
		return 2;
	} else {
		console.log("Unknown operator!");
	}
}

function firstOperatorHasPrecedenceOverSecond(first, second) {
	const firstPrecedenceVal = getOperatorPrecedenceValue(first);
	const secondPrecedenceVal = getOperatorPrecedenceValue(second);
	return firstPrecedenceVal > secondPrecedenceVal;
}

function evaluateComputationTree(computationTree) {
	const first = computationTree.first;
	const second = computationTree.second;
	const operator = computationTree.operator;

	let firstNum;
	if(typeof(first) === "number") {
		firstNum = first;
	} else {
		firstNum = evaluateComputationTree(first);
	}

	let secondNum;
	if(typeof(second) === "number") {
		secondNum = second;
	} else {
		secondNum = evaluateComputationTree(second);
	}

	return evaluateBinaryOperation(firstNum, secondNum, operator);
}

// Build a computation tree, where each node contains first and second operand and the binary operation.
function buildComputationTree(tokens) {
	let lastNode = {};

	// Initialize the first node. Just add 0 to create a full binary expression.
	const {type: firstType, value: firstValue} = tokens[0];
	lastNode.first = 0;
	lastNode.second = firstValue;
	lastNode.operator = '+'; 
	lastNode.parentNode = null;

	// Build computational tree by taking operator and operand in pairs. Start with index 1, since we used
	// the 0-th one for initialization.
	for (var i = 1; i < tokens.length; i += 2) {
		const { type: opType, value: opValue } = tokens[i];
		const { type: numType, value: numValue } = tokens[i + 1];
		if(opType !== "op" || numType !== "num") {
			console.log("The token pair does not consist of an operator and a number!");
		}

		// Compare the operators.
		if(firstOperatorHasPrecedenceOverSecond(opValue, lastNode.operator)) {
			// New operator has precedence over the last. The second operand of the last node becomes the first
			// operand of the new node, while the result of the new expression becomes the second operand 
			// of the last. "Bubble down" the new node.
			const newNode = {};
			newNode.first = lastNode.second;
			newNode.second = numValue;
			newNode.operator = opValue;
			newNode.parentNode = lastNode;

			// Update the second operand of the last node.
			lastNode.second = newNode;

			// Finally, reset the last node.
			lastNode = newNode;
		} else {
			// Last operator has precedence over the new. "Bubble up" the new node, until the new operator has
			// precedence (or we reach the tree root).
			let currentNode = lastNode;
			while(true) {
				const parentNode = currentNode.parentNode;
				if(parentNode === null) {
					break;
				} else if(firstOperatorHasPrecedenceOverSecond(opValue, parentNode.operator)) {
					break;
				} else {
					currentNode = parentNode;
				}
			}

			// Obtain parent reference. The new node goes between the current node and its parent node.
			let parentNode = currentNode.parentNode;

			// Check whether the current node is a left or right child of its parent (comparing object references).
			let isLeftChild = false;
			if(parentNode !== null) {
				isLeftChild = (parentNode.first === currentNode);
			}

			// Create a new node and insert it between the current node and its parent.
			const newNode = {};
			newNode.first = currentNode;
			newNode.second = numValue;
			newNode.operator = opValue;
			newNode.parentNode = parentNode;

			// Current node's parent is now new node.
			currentNode.parentNode = newNode;

			// Parent's operand is now the new node.
			if(parentNode !== null) {
				if(isLeftChild) {
					parentNode.first = newNode;
				} else {
					parentNode.second = newNode;
				}
			}

			// Finally, reset the last node.
			lastNode = newNode;
		}
	}

	// Root of the computation tree.
	let rootNode = lastNode;
	while(rootNode.parentNode !== null) {
		rootNode = rootNode.parentNode;
	}

	return rootNode;
}

function evaluateExpressionFromTokens(tokens) {
	const computationTree = buildComputationTree(tokens);
	return evaluateComputationTree(computationTree);
}

function evaluateExpression(expression){

	console.log(expression);
	tokens = tokenize(expression);
	console.log(tokens);

	return evaluateExpressionFromTokens(tokens);
}

// Define all the logic after the content has been loaded.
document.addEventListener("DOMContentLoaded", function(event){

	// On numeric key pressed, add the number to the display.
	for (var i = 0; i < 10; i++) {
		var numKey = "n" + i;
		document.getElementById(numKey).addEventListener("click", function(){
			document.getElementById("display").innerHTML += this.innerHTML;
		});
	}

	// On operator key pressed, add the operator to the display.
	var ops = ["+", "-", "*", "/", "(", ")", "^", "."];
	for (var i = 0; i < ops.length; i++) {
		var opKey = "o" + ops[i];
		document.getElementById(opKey).addEventListener("click", function(){
			document.getElementById("display").innerHTML += this.innerHTML;
		});
	}

	// On equal button pressed, compute the expression and display the result.
	var eqKey = "o=";
	document.getElementById(eqKey).addEventListener("click", function(){
		var displayedValue = document.getElementById("display").innerHTML;
		var computedValue = evaluateExpression(displayedValue);
		document.getElementById("display").innerHTML = computedValue;
	});

	// On clear button pressed, clear the display.
	var clearKey = "oc";
	document.getElementById(clearKey).addEventListener("click", function(){
		document.getElementById("display").innerHTML = "";
	});
});

})(window);