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

const cart = Bodies.rectangle(200, 240, 40, 20, {
  friction: 0,
  restitution: 0,
  angle: 0,
  isStatic: false,
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

let ground = Bodies.rectangle(0, innerHeight / 2, innerWidth * 2, 10, {
  friction: 0,
  restitution: 0.5,
  angle: 0,
  isStatic: true,
  collisionFilter: {
    mask: 0x0001
  }
});


let leftWall = Bodies.rectangle(5, 0, 100, innerHeight, {
  friction: 0,
  restitution: 1,
  angle: 0,
  isStatic: true,
  collisionFilter: {
    mask: 0x0001
  }
});

let rightWall = Bodies.rectangle(innerWidth, 0, 100, innerHeight, {
  friction: 0,
  restitution: 1,
  angle: 0,
  isStatic: true,
  collisionFilter: {
    mask: 0x0001
  }
});

// Add all bodies and constraints to the world
World.add(engine.world, [cart, pole, ground, rightWall, leftWall]);
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

const randomValue = (minValue, maxValue) => { return Math.random() * (maxValue - minValue) + minValue }

let prevAngle = 0
let pGain = randomValue(0.005, 0.001)
let dGain = randomValue(0.0025, 0.001)
let error = 0 
let solve = false
let lastTime = 0;
let accumulatedTime = 0;
const fixedTimeStep = 1000 / 60; // Target frame rate of 60 FPS
const canvas = document.getElementsByTagName("canvas")[0] // Replace 'canvas' with your canvas element's ID
const ctx = canvas.getContext('2d');
ctx.strokeStyle = 'rgb(255, 255, 255)'; // Set stroke color to white
ctx.lineWidth = 4; // Set stroke weight

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
    let angle = Math.atan2(arm.y, arm.x) + Math.PI / 2;
    let dt = 1;
    let angleV = (angle - prevAngle) / dt;
    prevAngle = angle;
    
    error = 0 - angle;

    if(solve){

      if(Math.abs(error) < 0.001 || Math.abs(error) > 1.0){
 
        pGain += error * 0.0001
        dGain += error * 0.0001
      }


      let fx = -1 * pGain * error - dGain * -angleV;
      fx = Math.min(Math.max(fx, -0.0033), 0.0028);
  
      const force = {x: fx, y: 0};
      Matter.Body.applyForce(cart, cart.position, force);
    }

   
    if (isLeftKeyDown) {
      const force = { x: -0.002, y: 0 }
      Matter.Body.applyForce(cart, cart.position, force);
    }
    if (isRightKeyDown) {
      const force = { x: 0.002, y: 0 }
      Matter.Body.applyForce(cart, cart.position, force);
    }

    ctx.beginPath();
    ctx.moveTo(cart.position.x, cart.position.y);
    ctx.lineTo(pole.position.x, pole.position.y);
    ctx.stroke();

    accumulatedTime -= fixedTimeStep;
  }
});




function ai() {
  if(!solve){
    solve = true
  }else{
    solve = false
  }
}