import "./style.css";

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

let bob;
let origin;
let originVelocityLeftX;
let originVelocityRightX;
let angle;


let lastTime;
let requiredElapsed;
let smallChange
const PI = 3.141592653589793
let L;
let g;
let I;
let m;
let R;
let T;
let t


function init() {
  smallChange = 0
  t = 0
  origin = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
 
  requiredElapsed = 1.0 / 60;
  originVelocityLeftX = 0;
  originVelocityRightX = 0;

  angle = PI/4
  
  m = 0.6
  g = 9.81;
  L = 250
  R = 1/2 * L
  I = 1/3 * m * Math.pow(L, 2)
  T = 2 * PI * Math.sqrt(I / (m * g * R))
  bob = { x: 0, y: L };
  resize();
  animate();
}


function animate(now) {
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Line from origin to bob
  context.beginPath();
  context.moveTo(origin.x, origin.y);
  context.lineTo(bob.x, bob.y);
  context.strokeStyle = "blue";
  context.stroke();

  // Center line
  context.beginPath();
  context.moveTo(90, origin.y);
  context.lineTo(context.canvas.width - 75, origin.y);
  context.strokeStyle = "black";
  context.stroke();

  // bob
  context.beginPath();
  context.arc(bob.x, bob.y, 20, 0, 2 * Math.PI);
  context.fillStyle = "red";
  context.fill();
  context.stroke();

  if (!lastTime) {
    lastTime = now;
  }
  let elapsed = now - lastTime;

  if (elapsed > requiredElapsed) {

    if (origin.x - 100 > 0) {
      origin.x += originVelocityLeftX * elapsed;
    }
    if (origin.x + 90 < context.canvas.width) {
      origin.x += originVelocityRightX * elapsed;
    }

    if (originVelocityLeftX < 0) {
      smallChange = 0.1;
    }
    else if (originVelocityRightX > 0) {
      smallChange = 0.1;
    }

    smallChange = 0
    t += 1


    angle = Math.cos((((2 * PI) / T) * t ) + 0.1);
    
    context.font = "30px Arial";
    context.fillText(
      JSON.stringify(Math.floor(angle * (180 / Math.PI))) + "°",
      window.innerWidth / 2,
      50
    );

    //console.log(Math.floor(angle * (180 / Math.PI)));
    
    
    bob.x = L * Math.sin(angle) + origin.x;
    bob.y = L * Math.cos(angle) + origin.y;

    
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
  bob.x = L * Math.sin(angle) + origin.x;
  bob.y = L * Math.cos(angle) + origin.y;
}

window.addEventListener("resize", resize);
document.addEventListener("DOMContentLoaded", init);
