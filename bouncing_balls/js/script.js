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
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    updateBall(ball, timeDiff) {
        const dPos = ball.velocity.clone();
        dPos.mul(timeDiff);
        
        const newPos = ball.position.clone();
        newPos.add(dPos);

        ball.position = newPos;
        
        // Check if any bouncing occured.
        const velocity = ball.velocity;
        if(this.hasBouncedOfTopWall(newPos) || this.hasBouncedOfBottomWall(newPos)) {
            velocity.y = -velocity.y;
        }

        if(this.hasBouncedOfLeftWall(newPos) || this.hasBouncedOfRightWall(newPos)) {
            velocity.x = -velocity.x;
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
}

// Define all the logic after the content has been loaded.
document.addEventListener("DOMContentLoaded", function(event){
	const width = 500;
	const height = 500;

    const physics = new Physics(width, height);

    const canvas = document.getElementById("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    const ball = new Ball(new Vector(250, 250), new Vector(30, 100), 5);

    let lastTime;
    function animate(currentTime) {

        if(!lastTime) {
            lastTime = currentTime;
        }

        // Obtain frame time difference in seconds.
        timeDiff = (currentTime - lastTime) / 1000;
        lastTime = currentTime;

        // Update the ball position.
        physics.updateBall(ball, timeDiff);

        // Clear the canvas.
        ctx.clearRect(0, 0, width, height);
    
        // Draw the ball.
        const pos = ball.position;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, ball.radius, 0, 2 * Math.PI);
        ctx.fill();
    
        requestAnimationFrame(animate);
    }

    // Start animation loop.
    requestAnimationFrame(animate);
});

})(window);