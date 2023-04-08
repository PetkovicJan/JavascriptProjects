// IIFE
(function(global){

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    // JS does NOT have any special methods to copy the object, so by convention we create a function clone 
    // to do exactly this. Note that this function is not "reserved" in any sense.
    clone() {
        return new Vector(this.x, this.y);
    }

    // Add another vector to this vector
    add(other) {
        return new Vector(this.x + other.x, this.y + other.y);
    }

    // Subtract another vector from this vector
    subtract(other) {
        return new Vector(this.x - other.x, this.y - other.y);
    }

    // Multiply this vector by a scalar
    multiply(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    }

    // Get the magnitude (length) of this vector squared
    normSquared() {
        return (Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    // Get the magnitude (length) of this vector
    norm() {
        return Math.sqrt(this.normSquared());
    }

    // Normalize this vector (i.e., make it have length 1)
    normalize() {
        const mag = this.norm();
        if (mag === 0) {
            return new Vector(0, 0);
        } else {
            return this.multiply(1 / mag);
        }
    }

    dot(other) {
        return this.x * other.x + this.y * other.y;
    }
}

class Ball {
    constructor(position, velocity, radius) {
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.handlePhysics = true;
    }
}

class Physics {
    constructor(width, height, gravity = 0) {
        this.width = width;
        this.height = height;
        this.gravity = gravity;
    }

    detectCollision(ball1, ball2) {
        const pos1 = ball1.position;
        const pos2 = ball2.position;
        const dist = pos2.subtract(pos1).norm();
        return dist < (ball1.radius + ball2.radius);
    }

    handleCollision(ball1, ball2) {
        // We assume equal mass of balls.
        const v1 = ball1.velocity;
        const v2 = ball2.velocity;

        const posDiff = ball1.position.subtract(ball2.position);
        const velDiff = v1.subtract(v2);

        const factor = posDiff.dot(velDiff) / posDiff.normSquared();

        ball1.velocity = v1.add(posDiff.multiply(-factor));
        ball2.velocity = v2.add(posDiff.multiply(factor));
    }

    updateBall(ball, timeDiff) {

        const dPos = ball.velocity.multiply(timeDiff);
        const newPos = ball.position.add(dPos);

        // Check if any bouncing occured and change the velocity direction if it did.
        let ballBounced = false;
        const velocity = ball.velocity;
        if(this.hasBouncedOfTopWall(newPos) || this.hasBouncedOfBottomWall(newPos)) {
            velocity.y = -velocity.y;
            ballBounced = true;
        }

        if(this.hasBouncedOfLeftWall(newPos) || this.hasBouncedOfRightWall(newPos)) {
            velocity.x = -velocity.x;
            ballBounced = true;
        }

        if(!ballBounced) {
            ball.position = newPos;
        }

        // Increase the velocity due to gravitational pull.
        velocity.y += this.gravity * timeDiff;
    }

    updateBalls(balls, timeDiff) {
        // Filter out those, that need to be handled by physics.
        const physicsBalls = balls.filter(ball => {
            return ball.handlePhysics;
        });

        // Update balls positions.
        physicsBalls.forEach( ball => {
            if(ball.handlePhysics) {
                this.updateBall(ball, timeDiff);
            }
        });

        // Handle ball collisions. Check every pair of balls.
        for (let one = 0; one < physicsBalls.length - 1; one++) {
            for (let other = one + 1; other < physicsBalls.length; other++) {
                const ball1 = physicsBalls[one];
                const ball2 = physicsBalls[other];
                if(this.detectCollision(ball1, ball2)) {
                    this.handleCollision(ball1, ball2);
                }
            }
        }
    }

    hasBouncedOfTopWall(pos) {
        return pos.y < 0;
    }

    hasBouncedOfBottomWall(pos) {
        return pos.y > this.height;
    }

    hasBouncedOfLeftWall(pos) {
        return pos.x < 0;
    }

    hasBouncedOfRightWall(pos) {
        return pos.x > this.width;
    }

    radiallyPushBalls(balls, pushSource) {
        balls.forEach( ball => {
            const posDiff = ball.position.subtract(pushSource);
            const dist = posDiff.norm();
            if(dist < 5 * ball.radius) {
                const radialVec = posDiff.normalize();
                const pushForce = radialVec.multiply(100);
                ball.velocity = ball.velocity.add(pushForce);
            }
        });
    }
}

class GrabHandler {
    #currentClickedBall = null;
    #lastTime = null;

    constructor(canvas, balls) {

        canvas.addEventListener("mousedown", event => {
            this.#handleMouseDown(balls, event);
        });

        canvas.addEventListener("mouseup", event => {
            this.#handleMouseUp(event);
        });

        canvas.addEventListener("mouseout", event => {
            this.#handleMouseUp(event);
        });

        canvas.addEventListener("mousemove", event => {
            this.#handleMouseMove(event);
        });
    }

    #handleMouseDown(balls, event) {
        const mousePos = new Vector(event.offsetX, event.offsetY);
        const clickedBall = balls.find(ball => {
            return ball.position.subtract(mousePos).norm() < 5 * ball.radius;
        });

        if(!clickedBall) {
            return;
        }

        this.#currentClickedBall = clickedBall;
        this.#currentClickedBall.handlePhysics = false;
        this.#currentClickedBall.position = mousePos;
        this.#currentClickedBall.velocity = new Vector(0, 0);
        this.#lastTime = performance.now();
    }

    #handleMouseUp(event) {
        if(!this.#currentClickedBall) {
            return;
        }

        this.#currentClickedBall.handlePhysics = true;
        this.#currentClickedBall = null;
        this.#lastTime = null;
    }

    #handleMouseMove(event) {
        if(!this.#currentClickedBall) {
            return;
        }

        const mousePos = new Vector(event.offsetX, event.offsetY);

        // Compute the current velocity.
        const now = performance.now();
        const timeDiff = (now - this.#lastTime) / 1000;
        const currentVelocity = mousePos.subtract(this.#currentClickedBall.position).multiply(1 / timeDiff);

        // Compute simple "moving" average of velocity to obtain a smooth behavior.
        const weight = 10;
        this.#currentClickedBall.velocity = this.#currentClickedBall.velocity.multiply(weight).add(currentVelocity).multiply(1 / (1 + weight));

        this.#currentClickedBall.position = mousePos;

        this.#lastTime = now;
    }
}

function getRandomNumberInRange(min, max) {
    // Random generates a random number from 0 to 1 with uniform probability.
    return Math.random() * (max - min) + min;
}

function getRandomVec(minX, maxX, minY, maxY) {
    return new Vector(
        getRandomNumberInRange(minX, maxX), 
        getRandomNumberInRange(minY, maxY));
}

function generateBalls(width, height, numBalls) {
    const balls = [];
    for (let id = 0; id < numBalls; id++) {
        const pos = getRandomVec(0, width, 0, height);        
        const vel = getRandomVec(-200, 200, -200, 200);
        balls.push(new Ball(pos, vel, 10));
    }

    return balls;
}

// Define all the logic after the content has been loaded.
document.addEventListener("DOMContentLoaded", function(event){
	const width = 500;
	const height = 500;
    const gravity = 300;
    const numBalls = 7;

    const physics = new Physics(width, height, gravity);

    const canvas = document.getElementById("canvas");
    canvas.width = width;
    canvas.height = height;

    const balls = generateBalls(width, height, numBalls);

    const grabHandler = new GrabHandler(canvas, balls);


    const ctx = canvas.getContext("2d");

    let lastTime;
    function animate(currentTime) {

        if(!lastTime) {
            lastTime = currentTime;
        }

        // Obtain frame time difference in seconds.
        timeDiff = (currentTime - lastTime) / 1000;
        lastTime = currentTime;

        // Update the ball position.
        physics.updateBalls(balls, timeDiff);

        // Clear the canvas.
        ctx.clearRect(0, 0, width, height);
    
        // Draw the balls.
        balls.forEach( ball => {
            const pos = ball.position;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, ball.radius, 0, 2 * Math.PI);
            ctx.fill();
        });
    
        requestAnimationFrame(animate);
    }

    // Start animation loop.
    requestAnimationFrame(animate);
});

})(window);