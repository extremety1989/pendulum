import "./style.css";

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");


let originVelocityLeftX = 0;
let originVelocityRightX = 0;


let angularVelocity = 0;
let lastTime = 0;

const PI = 3.141592653589793
let angle = PI / 2;

const Length = 250
const gravity = 9.81
let damping = 0.98; 

const bobRadius = 20
const Mass = 1; // Adjust the mass as needed
const momentOfInertia = (Mass * bobRadius * bobRadius) / 12;
const origin = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
const bob = { x: 0, y: Length * Math.cos(angle) + origin.y };

function animate(timestamp) {
  const dt = (timestamp - lastTime) / 1000;
  lastTime = timestamp;
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
  origin.x += (originVelocityRightX + originVelocityLeftX) * dt;
  const angularAcceleration = -(gravity / Length) * Math.sin(angle) 
                              / momentOfInertia;

  angularVelocity += angularAcceleration * dt;
  angularVelocity *= damping; 
  angle += angularVelocity * dt;
 
  context.font = "30px Arial";
  context.fillText(
    JSON.stringify(Math.floor(angle * (180 / Math.PI))) + "°",
    window.innerWidth / 2,
    50
  );

  bob.x = Length * Math.sin(angle) + origin.x;
  bob.y = Length * Math.cos(angle) + origin.y;
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
    originVelocityRightX = 1000;
  } else if (deltaX < 0) {
    // Sliding to the left
    originVelocityLeftX -= 1000;
  }
  startX = currentX;
});

window.addEventListener("touchend", (event) => {
  originVelocityRightX = 0;
  originVelocityLeftX = 0;
});

window.addEventListener("keydown", (event) => {
  if (event.code === "ArrowLeft") {
    originVelocityLeftX = -1000;
  } else if (event.code === "ArrowRight") {
    originVelocityRightX = 1000;
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
  bob.x = Length * Math.sin(angle) + origin.x;
  bob.y = Length * Math.cos(angle) + origin.y;
}

window.addEventListener("resize", resize);
resize();
requestAnimationFrame(animate);