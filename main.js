import "./style.css";


const canvas = document.createElement("canvas");
document.getElementById("app").appendChild(canvas)
const context = canvas.getContext("2d");


const Length = 250;
const gravity = 9.8;

const cart = { x: canvas.width / 2, y: canvas.height / 2 };

let cartVelocityLeftX = 0;
let cartVelocityRightX = 0;

let angularVelocity = 0;
let lastTime = 0;

let angle = Math.PI / 2;
let angularAcceleration = -(gravity / Length) * Math.sin(angle)
const bob = { x: 0, y: Length * Math.cos(angle) + cart.y };

let solve = false
const randomValue = (minValue, maxValue) => { return Math.random() * (maxValue - minValue) + minValue }

let prevAngle = 0

let pGain = 2.2
let dGain = 2.4
let error = 0 

function animate(timestamp) {
    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Center line
    context.beginPath();
    context.lineWidth = 1;
    context.moveTo(90, cart.y);
    context.lineTo(canvas.width - 75, cart.y);
    context.strokeStyle = "black";
    context.stroke();

    // Draw cart
    context.beginPath();
    context.lineWidth = 1;
    context.rect(cart.x, cart.y - 20, 80, 40);
    context.fillStyle = "red";
    context.fill();
    context.strokeStyle = "black";
    context.stroke();


    // Line from cart to bob
    context.beginPath();
    context.lineWidth = 10;
    context.moveTo(cart.x + 40, cart.y);
    context.lineTo(bob.x, bob.y);
    context.strokeStyle = "blue";
    context.stroke();



    // Draw bob
    context.beginPath();
    context.lineWidth = 1;
    context.arc(bob.x, bob.y, 20, 0, 2 * Math.PI);
    context.fillStyle = "red";
    context.fill();
    context.strokeStyle = "black";
    context.stroke();

    // Handle cart velocity
    let dx = (cartVelocityRightX + cartVelocityLeftX) * dt;
    let newX = cart.x + dx
    if(newX >= 80 && newX <= canvas.width - 151){
        cart.x += dx
    }
 

    // Calculate angular acceleration
    angularAcceleration = -(gravity / Length) * Math.sin(angle)
    if(newX >= 80 && newX <= canvas.width - 151){
        angularAcceleration += dx * 0.05
    }

    // Update angular velocity and angle
    angularVelocity += angularAcceleration
    
    dx *= 0.99
    angularVelocity *= 0.99;

    angle += angularVelocity * dt;


    error = (3.141592653589793 - angle ) + (638.5 - cart.x);
   
    if(solve){
  
        let angleV = (angle - prevAngle);
        prevAngle = angle;
  
        let fx = pGain * error - dGain * -angleV;
        console.log(fx);
        // console.log(fx);
        cart.x += fx;
    }

    // Update bob position

    bob.x = Length * Math.sin(angle) + cart.x + 40;
    bob.y = Length * Math.cos(angle) + cart.y;

    requestAnimationFrame(animate);
}

// Event listeners
window.addEventListener("keydown", (event) => {

    if(event.code === "l" || event.code === "L" || event.code === "KeyL"){
        ai()
    }


    if (event.code === "ArrowLeft") {
        cartVelocityLeftX = -400;
    } else if (event.code === "ArrowRight") {
        cartVelocityRightX = 400;
    }
});

window.addEventListener("keyup", (event) => {
    if (event.code === "ArrowLeft") {
        cartVelocityLeftX = 0;
    } else if (event.code === "ArrowRight") {
        cartVelocityRightX = 0;
    }
});

// Resize canvas
function resize() {
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;
    cart.x = canvas.width / 2;
    cart.y = canvas.height / 2;
    bob.x = Length * Math.sin(angle) + cart.x;
    bob.y = Length * Math.cos(angle) + cart.y;
}

window.addEventListener("resize", resize);

// Initialize
resize();
requestAnimationFrame(animate);



function ai() {
    if(!solve){
      solve = true
    }else{
      solve = false
    }
  }