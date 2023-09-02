import "./style.css";
// Constants
const g = 9.81; // Acceleration due to gravity (m/s^2)
const cartMass = 1.0; // Mass of the cart (kg)
const pendulumMass = 0.1; // Mass of the pendulum (kg)
const pendulumLength = 1.0; // Length of the pendulum (m)

// State variables
let x = 0; // Cart position (m)
let xDot = 0; // Cart velocity (m/s)
let theta = Math.PI / 4; // Pendulum angle (radians)
let thetaDot = 0; // Pendulum angular velocity (rad/s)

// Control parameters (LQR)
const K = [-10, -20]; // LQR control gains

// Simulation parameters
const dt = 0.01; // Time step (s)
const canvas = document.createElement("canvas");
canvas.width = document.getElementById("app").width
canvas.height = document.getElementById("app").height
document.getElementById("app").appendChild(canvas)
const context = canvas.getContext("2d");

// Function to update the system state without control
function updateState() {
    // Update state using the equations of motion
    const totalMass = cartMass + pendulumMass;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);
    const temp = (pendulumMass * pendulumLength * thetaDot * thetaDot * sinTheta) / totalMass;
    const thetaAccel = (g * sinTheta - cosTheta * temp) / (pendulumLength * (4.0 / 3.0 - pendulumMass * cosTheta * cosTheta / totalMass));
    const xAccel = temp - pendulumMass * pendulumLength * thetaAccel * cosTheta / totalMass;
  
    xDot += xAccel * dt;
    x += xDot * dt;
    thetaDot += thetaAccel * dt;
    theta += thetaDot * dt;
  }
  
  // Function to draw the pendulum and cart on the canvas
  function drawPendulumCart() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  
    // Draw cart
    context.fillStyle = "red";
    context.fillRect(x * 100 + canvas.width / 2 - 20, canvas.height / 2 - 10, 40, 20);
  
    // Draw pendulum
    const pendulumX = x * 100 + canvas.width / 2;
    const pendulumY = canvas.height / 2;
    const pendulumX2 = pendulumX + pendulumLength * 100 * Math.sin(theta);
    const pendulumY2 = pendulumY + pendulumLength * 100 * Math.cos(theta);
    context.beginPath();
    context.moveTo(pendulumX, pendulumY);
    context.lineTo(pendulumX2, pendulumY2);
    context.strokeStyle = "blue";
    context.lineWidth = 4;
    context.stroke();
  }
  
  // Main simulation loop
  function animate() {
    updateState();
    drawPendulumCart();
    requestAnimationFrame(animate);
  }
  
  // Start the simulation
  animate();