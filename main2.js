import "./style.css";


import * as Matter from "matter-js";

const Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Constraint = Matter.Constraint;

const engine = Engine.create();

// Create a rendering context
const render = Render.create({
  element: document.getElementById("app"),
  engine: engine,
  options: {
    width: innerWidth,
    height: innerHeight,
    wireframes: false,
  },
});

let restLength = 100;

const cart = Bodies.rectangle(innerWidth/2, innerHeight/2, 40, 20, {

  isStatic: true,
  render: { fillStyle: '#f55a3c' }
});

cart.w = 40;
cart.h = 20;

const pole = Bodies.rectangle(cart.position.x, cart.position.y - restLength, 20, 20, {
  friction: 0,
  restitution: 0.5,
  isStatic: false,
  collisionFilter: {
    category: 0x0002
  }
});

// Create constraints to attach the pole to the cart
const poleConstraint = Constraint.create({
  bodyA: cart,
  bodyB: pole,
  length: restLength,
  stiffness: 1,
});


// Add all bodies and constraints to the world
World.add(engine.world, [cart, pole]);
World.add(engine.world, poleConstraint);

// Start the engine
Matter.Runner.run(engine);

// Start rendering
Render.run(render);


// Flag to track key presses
let isLeftKeyDown = false;
let isRightKeyDown = false;

document.addEventListener("keydown", (event) => {
  const key = event.key;
  if (key === "ArrowLeft") {
    isLeftKeyDown = true;
  } else if (key === "ArrowRight") {
    isRightKeyDown = true;
  } 
  if (key === "l" || key === "L") {
    ai()
  } 
});

document.addEventListener("keyup", (event) => {
  const key = event.key;

  if (key === "ArrowLeft") {
    isLeftKeyDown = false;
  } else if (key === "ArrowRight") {
    isRightKeyDown = false;
  }
});

let prevAngle = 0
let pGain = 55
let dGain = 45
const PI = Math.PI
let error = 0 
let solve = false
let lastTime = 0;
let accumulatedTime = 0;
const fixedTimeStep = 1000 / 60; // Target frame rate of 60 FPS
const canvas = document.getElementsByTagName("canvas")[0] // Replace 'canvas' with your canvas element's ID

const ctx = canvas.getContext('2d');

function normalize(angle) {
  while (angle > PI) {
      angle -= 2 * PI
  }
  while (angle < -PI) {
      angle += 2 * PI
  }
  return angle
}

const kP = -10;  
const kI = 0.001; 
const kD = 0.002;  
let integralError = 0;
let previousError = 0;

function calculateControlInput(angleV) {
  
  const error = normalize(0 - angleV) 
  const P = kP * error;
  integralError += error;

  const I = kI * integralError;

  const D = kD * (error - previousError);
  previousError = error;
  
  return P + I + D;
}

// Update cart position based on key presses and delta time
Matter.Events.on(engine, "beforeUpdate", (event) => {
  const currentTime = event.timestamp;
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;

  accumulatedTime += deltaTime;

  while (accumulatedTime >= fixedTimeStep) {


    let arm = { x: 0, y: 0 }
    arm.x = pole.position.x - cart.position.x;
    arm.y = pole.position.y - cart.position.y;
    let angle = Math.atan2(arm.y, arm.x) + PI / 2;

    let angleV = (angle - prevAngle) / deltaTime;
    prevAngle = angle;
    


    if(solve){
      let fx = calculateControlInput(-angleV)
      
      Matter.Body.translate(cart, { x: fx, y: 0 });
    }

   
    if (isLeftKeyDown) {
      Matter.Body.translate(cart, { x: -80 * (deltaTime / 100), y: 0 });
    }
    if (isRightKeyDown) {
      Matter.Body.translate(cart, { x: 80 * (deltaTime / 100), y: 0 });
    }

    accumulatedTime -= fixedTimeStep;
  }
});




function ai() {
  if(!solve){
    console.log("solving");
    solve = true
  }else{
    console.log("stopped");
    solve = false
  }
}