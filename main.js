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

const cartWidth = 100;

const cart = Bodies.rectangle(400, innerHeight/2, cartWidth, 20, { isStatic: true, render: { fillStyle: '#f55a3c' } });


const pole = Bodies.rectangle(400, 520, 50, 50, {
  frictionAir: 0.001,
  collisionFilter: {
    category: 0x0002
  }
});

// Create constraints to attach the pole to the cart
const poleConstraint = Constraint.create({
  bodyA: cart,
  bodyB: pole,
  pointB: { x: 0, y: 0 },
  stiffness: 0,
  length: 320,
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
const cartSpeed = 40; // Adjust the cart's speed as needed

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (key === "ArrowLeft") {
    isLeftKeyDown = true;
  } else if (key === "ArrowRight") {
    isRightKeyDown = true;
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

// Update cart position based on key presses
Matter.Events.on(engine, "beforeUpdate", () => {
  if (isLeftKeyDown && cart.position.x > 50) {
    Matter.Body.translate(cart, { x: -cartSpeed, y: 0 });
  }
  if (isRightKeyDown && cart.position.x < innerWidth - 50) {
    Matter.Body.translate(cart, { x: cartSpeed, y: 0 });
  }
});