import "./style.css";


const canvas = document.createElement("canvas");
document.getElementById("app").appendChild(canvas)
const context = canvas.getContext("2d");


const Length = 250;
const gravity = 99;

const cartMass = 1.0
const poleMass = 11.0
const totalMass = cartMass + poleMass


let friction = 0.1

const cart = { x: canvas.width / 2, y: canvas.height / 2 };
let cartVelocity = 0.0
const PI = Math.PI
let poleAngle =  PI + 0.01;
let angleVelocity = 0.0
const pole = { x: cart.x + 40 + Length * Math.sin(poleAngle),  
               y: cart.y + Length * Math.cos(poleAngle)};
let cartLeft = 0;
let cartRight = 0;
let lastTime = 0;
let solve = false


function normalize(angle) {
    while (angle > PI) {
        angle -= 2 * PI
    }
    while (angle < -PI) {
        angle += 2 * PI
    }
    return angle
}


let kP = 5; 
let kI = 2.5; 
let kD = 1.5;  

let integralError = 0;
let previousError = 0;


function calculateControlInput(dt) {
    const error = normalize(PI - poleAngle)
    const P = kP * error;
    integralError += error;

    const I = kI * integralError;

    const D = kD * (error - previousError);
    previousError = error;
    
    return P + I + D;
}


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


    // Pole
    context.beginPath();
    context.lineWidth = 10;
    context.moveTo(cart.x + 40, cart.y);
    context.lineTo(pole.x, pole.y);
    context.strokeStyle = "blue";
    context.stroke();


    // Draw bob
    context.beginPath();
    context.lineWidth = 1;
    context.arc(pole.x, pole.y, 15, 0, 2 * PI);
    context.fillStyle = "blue";
    context.fill();
    context.strokeStyle = "black";
    context.stroke();
    
    if (solve) {
        let fx = calculateControlInput(dt);
        cartVelocity += fx;
        // Calculate the force due to cart movement on the pole
        const poleForce = (fx * 2.5 * Math.cos(poleAngle)) / (totalMass * Length);
        angleVelocity += poleForce;
    }

    let force = cartRight + cartLeft;
    cartVelocity += (force - friction * cartVelocity) / cartMass;
    cart.x += cartVelocity * dt;


    const angularAcceleration = (-gravity / Length) * Math.sin(poleAngle)
    angleVelocity += angularAcceleration * 1;
    poleAngle += angleVelocity * dt;

    // Calculate the force due to cart movement on the pole
    const poleForce = (force * Math.cos(poleAngle)) / (totalMass * Length);
    angleVelocity += poleForce;


    pole.x = cart.x + 40 + Length * Math.sin(poleAngle);
    pole.y = cart.y + Length * Math.cos(poleAngle);

    angleVelocity *= 0.99;
    cartVelocity *= 0.5;
    requestAnimationFrame(animate);
}

// Event listeners
window.addEventListener("keydown", (event) => {

    if(event.code === "l" || event.code === "L" || event.code === "KeyL"){
        ai()
    }
    if (event.code === "ArrowLeft") {
        cartLeft = -1000;
    } else if (event.code === "ArrowRight") {
        cartRight = 1000;
    }
});

window.addEventListener("keyup", (event) => {
    if (event.code === "ArrowLeft") {
        cartLeft = 0;
    } else if (event.code === "ArrowRight") {
        cartRight = 0;
    }
});

// Resize canvas
function resize() {
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;
    cart.x = canvas.width / 2;
    cart.y = canvas.height / 2;
}

window.addEventListener("resize", resize);

// Initialize
resize();
requestAnimationFrame(animate);



function ai() {
    solve = !solve; // Toggle the value
    console.log(solve ? "Solving" : "Stopped");
}