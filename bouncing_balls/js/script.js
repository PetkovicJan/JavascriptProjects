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

    add(vec) {
        this.x += vec.x;
        this.y += vec.y;
    }

    mul(val) {
        this.x *= val;
        this.y *= val;
    }
}

class Ball {
    constructor(position, velocity, radius) {
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
    }

    update(timeDiff) {
        const shift = this.velocity.clone();
        shift.mul(timeDiff);
        this.position.add(shift);
    }
}

class Physics {
    constructor(width, height, gravity = 0) {
        this.width = width;
        this.height = height;
        this.gravity = gravity;
    }

    updateBalls(balls, timeDiff) {
        balls.forEach( ball => {
            this.updateBall(ball, timeDiff);
        });
    }

    updateBall(ball, timeDiff) {

        const dPos = ball.velocity.clone();
        dPos.mul(timeDiff);
        
        const newPos = ball.position.clone();
        newPos.add(dPos);

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
    const numBalls = 15;

    const physics = new Physics(width, height, gravity);

    const canvas = document.getElementById("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    const balls = generateBalls(width, height, numBalls);

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