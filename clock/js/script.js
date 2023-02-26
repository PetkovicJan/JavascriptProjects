// IIFE
(function(global){

class Point2D {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

function getHandAngle(time, max) {
	// Angle is the proportional part of 2 * PI, offseted by - PI / 2,
	// where the time has the value of 0.
	return 2 * Math.PI * (time / max) - Math.PI / 2.;
}

function addVectorToPoint(initialPoint, vecRadius, vecAngle) {
	const finalX = initialPoint.x + vecRadius * Math.cos(vecAngle);
	const finalY = initialPoint.y + vecRadius * Math.sin(vecAngle);
	return new Point2D(finalX, finalY);
}

function drawHand(context, center, shortRadius, longRadius, time, max) {
	const handAngle = getHandAngle(time, max);
	const longEnd = addVectorToPoint(center, longRadius, handAngle);
	const shortEnd = addVectorToPoint(center, shortRadius, handAngle + Math.PI);
	context.beginPath();
	context.moveTo(shortEnd.x, shortEnd.y);
	context.lineTo(longEnd.x, longEnd.y);
	context.stroke();
}

function drawClockAtCurrentTime(canvas) {
	// Canvas should be a square, meaning that "width = height".
	const size = canvas.width;
	const a = size / 2;

	// Center point and radius.
	const center = new Point2D(a, a);
	const outerRadius = 1.00 * a;
	const innerRadius = 0.90 * a;

	// First, clear the canvas.
	const context = canvas.getContext("2d");
	context.clearRect(0, 0, size, size);

	// Draw the outer circle of the clock.
	context.beginPath();
	context.arc(center.x, center.y, outerRadius, 0, 2 * Math.PI);
	context.fill();

	context.save();
	context.fillStyle = "white";
	context.beginPath();
	context.arc(center.x, center.y, innerRadius, 0, 2 * Math.PI);
	context.fill();
	context.restore();

	// Draw the stripes.
	context.save();
	for (var i = 0; i <= 60; ++i) {
		let stripeWidth = 2;
		let startRadius = 0.93 * innerRadius;
		if(i % 5 == 0) {
			stripeWidth = 3;
			startRadius = 0.90 * innerRadius;
		}

		const endRadius = 0.97 * innerRadius;

		const stripeAngle = getHandAngle(i, 60);
		const start = addVectorToPoint(center, startRadius, stripeAngle);
		const end = addVectorToPoint(center, endRadius, stripeAngle);
		context.lineWidth = stripeWidth;
		context.beginPath();
		context.moveTo(start.x, start.y);
		context.lineTo(end.x, end.y);
		context.stroke();
	}
	context.restore();

	// Draw the numbers.
	const numberRadius = 0.78 * innerRadius;
	context.save();
	context.font = "bold 40px sans-serif";
	context.textAlign = "center";
	context.textBaseline = "middle";
	for (var i = 1; i <= 12; ++i) {
		const hourAngle = getHandAngle(i, 12);
		const hourPos = addVectorToPoint(center, numberRadius, hourAngle);
		context.fillText(i, hourPos.x, hourPos.y);
	}
	context.restore();

	// Obtain time.
	const currentTime = new Date();
	const hours = currentTime.getHours();
	const minutes = currentTime.getMinutes();
	const seconds = currentTime.getSeconds();

	// Draw hands.
	context.save();
	context.lineCap = "round";
	context.lineWidth = 8;

	const shortHandRadius = 0.15 * innerRadius;

	const hourHandRadius = 0.5 * innerRadius;
	drawHand(context, center, shortHandRadius, hourHandRadius, hours + minutes / 60, 12);

	const minuteHandRadius = 0.8 * innerRadius;
	drawHand(context, center, shortHandRadius, minuteHandRadius, minutes, 60);

	context.lineWidth = 4;
	context.strokeStyle = "red";
	const secondHandRadius = 0.8 * innerRadius;
	drawHand(context, center, shortHandRadius, secondHandRadius, seconds, 60);

	context.restore();

	// Draw the circle in the middle of the clock.
	context.save();

	const smallCircleRadius = 0.03 * innerRadius;
	context.beginPath();
	context.arc(center.x, center.y, smallCircleRadius, 0, 2 * Math.PI);
	context.fill();

	context.lineWidth = 2;
	context.strokeStyle = "red";
	context.beginPath();
	context.arc(center.x, center.y, smallCircleRadius, 0, 2 * Math.PI);
	context.stroke();

	context.restore();
}

// Define all the logic after the content has been loaded.
document.addEventListener("DOMContentLoaded", function(event){
	const clockCanvas = document.getElementById("clockCanvas");

	// Set the clock dimensions.
	const clockSize = 500;
	clockCanvas.width = clockSize;
	clockCanvas.height = clockSize;

	// Interval period is given in milliseconds.
	setInterval(drawClockAtCurrentTime, 1000, clockCanvas);
});

})(window);