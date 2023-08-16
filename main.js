import "./style.css";

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

let ball;
let ballMass;
let origin;
let originVelocityLeftX;
let originVelocityRightX;
let angle;
let angleVelocity;
let angleAcceleration;
let len;
let lastTime;
let requiredElapsed;
let gravity;
let smallChange

function init() {
  smallChange = 0.0
  angle = (Math.PI / 2) * 2;
  gravity = 0.1;
  ballMass = 0.2;
  angleVelocity = 0.0;
  angleAcceleration = 0;
  requiredElapsed = 1.0 / 60;
  len = 250;
  ball = { x: 0, y: len };
  originVelocityLeftX = 0;
  originVelocityRightX = 0;

  origin = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  resize();
  animate();
}

function animate(now) {
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Line from origin to ball
  context.beginPath();
  context.moveTo(origin.x, origin.y);
  context.lineTo(ball.x, ball.y);
  context.strokeStyle = "blue";
  context.stroke();

  // Center line
  context.beginPath();
  context.moveTo(90, origin.y);
  context.lineTo(context.canvas.width - 75, origin.y);
  context.strokeStyle = "black";
  context.stroke();

  // Ball
  context.beginPath();
  context.arc(ball.x, ball.y, 20, 0, 2 * Math.PI);
  context.fillStyle = "red";
  context.fill();
  context.stroke();

  if (!lastTime) {
    lastTime = now;
  }
  let elapsed = now - lastTime;

  if (elapsed > requiredElapsed) {
    if (angle >= 6.283185307179586 || angle <= -6.283185307179586) {
      angle = 0;
    }
    if (origin.x - 100 > 0) {
      origin.x += originVelocityLeftX * elapsed;
    }
    if (origin.x + 90 < context.canvas.width) {
      origin.x += originVelocityRightX * elapsed;
    }

    let force = gravity * Math.sin(angle) * ballMass;
    if (angle === 3.141592653589793 && force === 2.4492935982947068e-18) {
      if (Math.random() > 0) {
        angle += 0.1;
      } else {
        angle -= 0.1;
      }
    }

    angleAcceleration = (-1 * force) / len;
    if (originVelocityLeftX < 0) {
      console.log("left");
      smallChange = -0.1;
    }
    if (originVelocityRightX > 0) {
      console.log("right");
      smallChange = 0.1;
    }
    angle += smallChange
    smallChange = 0.0
    angleVelocity += angleAcceleration * elapsed;
    angle += angleVelocity;

    context.font = "30px Arial";
    context.fillText(
      JSON.stringify(Math.floor(angle * (180 / Math.PI))) + "°",
      window.innerWidth / 2,
      50
    );

    //console.log(Math.floor(angle * (180 / Math.PI)));
    
    
    ball.x = len * Math.sin(angle) + origin.x;
    ball.y = len * Math.cos(angle) + origin.y;

    angleVelocity *= 0.99;
    lastTime = now;
  }
  requestAnimationFrame(animate);
}

let startX = 0;

window.addEventListener("touchstart", (event) => {
  startX = event.touches[0].clientX;
});

window.addEventListener("touchmove", (event) => {
  const currentX = event.touches[0].clientX;
  const deltaX = currentX - startX;

  if (deltaX > 0) {
    // Sliding to the right
    originVelocityRightX = 1;
  } else if (deltaX < 0) {
    // Sliding to the left
    originVelocityLeftX = -1;
  }
  startX = currentX;
});

window.addEventListener("touchend", (event) => {
  originVelocityRightX = 0;
  originVelocityLeftX = 0;
});

window.addEventListener("keydown", (event) => {
  if (event.code === "ArrowLeft") {
    originVelocityLeftX = -1;
  } else if (event.code === "ArrowRight") {
    originVelocityRightX = 1;
  }
});

window.addEventListener("keyup", (event) => {
  if (event.code === "ArrowLeft") {
    originVelocityLeftX = 0;
  } else if (event.code === "ArrowRight") {
    originVelocityRightX = 0;
  }
});

// Resize canvas
function resize() {
  context.canvas.width = window.innerWidth;
  context.canvas.height = window.innerHeight;
  origin.x = canvas.width / 2;
  origin.y = canvas.height / 2;
  ball.x = len * Math.sin(angle) + origin.x;
  ball.y = len * Math.cos(angle) + origin.y;
}

window.addEventListener("resize", resize);
document.addEventListener("DOMContentLoaded", init);
