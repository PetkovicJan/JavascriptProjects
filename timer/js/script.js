// IIFE
(function(global){

// Represents a simple timer, that supports starting and stopping the time, as well as resetting it.
class Timer {

  #lastStartTime = 0;
  #isRunning;
  #accumulatedTime = 0;

  start() {
    if(this.#isRunning){
      return;
    }

    // Register the starting time.
    this.#lastStartTime = new Date();
    this.#isRunning = true;
  }

  stop() {
    if(!this.#isRunning) return;

    this.#accumulatedTime += this.#timeSinceLastStart();
    this.#isRunning = false;
  }

  reset() {
    this.#lastStartTime = 0;
    this.#isRunning = false;
    this.#accumulatedTime = 0;
  }

  #timeSinceLastStart() {
    const now = new Date();
    return now - this.#lastStartTime;
  }

  get time() {
    return this.#accumulatedTime + (this.#isRunning ? this.#timeSinceLastStart() : 0);
  }

  get isRunning() {
    return this.#isRunning;
  }
}

// Define all the logic after the content has been loaded.
document.addEventListener("DOMContentLoaded", function(event){

  const frontElement = document.getElementById("divFront");
  const stopwatchElement = document.getElementById("divStopwatch");

  // Initialize the element's visibility.
  makeVisible(frontElement, true);
  makeVisible(stopwatchElement, false);

  document.getElementById("buttonStopwatch").addEventListener("click", function () {
    makeVisible(frontElement, false);
    makeVisible(stopwatchElement, true);
  });

  const timer = new Timer();
  const stopwatchDisplay = document.getElementById("stopwatchDisplay");
  const intervalID = setInterval(() => {
    displayTime(stopwatchDisplay, timer.time);
  }, 100);

  const startStopElement = document.getElementById("stopwatchStartStop");
  startStopElement.addEventListener("click", function () {
    if(timer.isRunning) {
      this.innerHTML = "Start";
      timer.stop();
    } else {
      this.innerHTML = "Stop";
      timer.start();
    }
  });

  document.getElementById("stopwatchClear").addEventListener("click", function () {
    if(timer.isRunning) {
      startStopElement.innerHTML = "Start";
      timer.stop();
    }

    timer.reset();
  });

});

function makeVisible(element, visible) {
  const visibleValue = (visible ? "block" : "none");
  element.style.display = visibleValue;
}

function displayTime(element, time_ms) {
  const allSeconds = time_ms / 1000;
  const minutes = Math.floor(allSeconds / 60);
  const remainingSeconds = Math.floor(allSeconds - 60 * minutes);
  const displayString = minutes + " : " + remainingSeconds;
  element.innerHTML = displayString;
}

})(window);