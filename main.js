import "./style.css";


const canvas = document.createElement("canvas");
document.getElementById("app").appendChild(canvas)
const context = canvas.getContext("2d");


const Length = 300;
const gravity = 9.8;
const cartMass = 2
const pendulumMass = 1 + cartMass
let friction = 0.1

const cart = { x: canvas.width / 2, y: canvas.height / 2 };
let cartVelocity = 0.0
const PI = Math.PI
let poleAngle =  PI / 1;
let poleVelocity = 0.0
let angleVelocity = 0.0
const pole = { x: 0,  y: 0};


let cartLeft = 0;
let cartRight = 0;

let lastTime = 0;


let solve = false

let prevAngle = 0

let kp = -0.0127
let kpd = -0.822
let kt = 0.2234
let ktd = 0.437

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

    // Handle cart velocity
    let dx = (cartRight + cartLeft)
    cart.x += dx * dt;

    // Calculate angular acceleration
    const angularAcceleration =
    (-gravity / Length) * Math.sin(poleAngle)
   
    // Update angular velocity and angle
    angleVelocity += angularAcceleration
    poleAngle += angleVelocity * dt;

    angleVelocity += ((dx * 40 * Math.cos(poleAngle)) / (pendulumMass * Length * Length));

    if(solve){

        let error  = PI - poleAngle

        if(Math.abs(error) > 0.01){
          let fx = -kp * pole.x - kt * error - kpd * poleVelocity - ktd * angleVelocity
          cart.x += fx;
        }

    }
   
    cart.x += cartVelocity * dt
    pole.x = cart.x + 40 + Length * Math.sin(poleAngle);
    pole.y = cart.y + Length * Math.cos(poleAngle);

    angleVelocity *= 0.99
    cartVelocity *= 0.5
    requestAnimationFrame(animate);
}

// Event listeners
window.addEventListener("keydown", (event) => {

    if(event.code === "l" || event.code === "L" || event.code === "KeyL"){
        ai()
    }


    if (event.code === "ArrowLeft") {
        cartLeft = -1200;
    } else if (event.code === "ArrowRight") {
        cartRight = 1200;
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