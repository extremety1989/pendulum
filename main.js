import "./style.css";

// Pendulum simulation taken from
// https://codepen.io/oscarsaharoy/pen/LYbmVma

document.getElementById("app").innerHTML = `     <svg width="100" height="100" viewbox="-50 -40 100 50" id="shadow" xmlns="http://www.w3.org/2000/svg" style="pointer-events: none">
            
<mask id="pendulum-shadow">
    <rect class="pole" x="-12.5" y="-55" width="5" height="65" style="fill: white; stroke: none" transform-origin="-10 10" />
    <circle class="top-circle" cx="-10" cy="10" r="10" style="fill: white; stroke: none" />
    <rect class="slider" x="-23" y="4" width="26" height="12" rx="3" style="fill: white; stroke: none" />
    <rect x="-110" y="7.5" width="200" height="5" style="fill: white; stroke: none" />
</mask>

<rect x="-300" y="-300" width="600" height="600" mask="url(#pendulum-shadow)" style="stroke: none; fill: rgba(0, 0, 0, 0.07)" />


</svg>

<svg width="100" height="100" viewbox="-50 -40 100 50" id="pendulum" xmlns="http://www.w3.org/2000/svg">

<rect id="rail" x="-100" y="-2.5" width="200" height="5" />
<line x1="-99.5" y1="-1.5" x2="99.5" y2="-1.5" style="stroke: white; pointer-events: none;" />
<line x1="-100" y1="1.7" x2="100" y2="1.7" style="stroke: rgba(0, 0, 0, 0.15); pointer-events: none;" />

<mask id="slider-rail-shadow">
    <polygon class="slider" points="-13,-2.5 -13,2.5 -18,2.5 -14.5,-2.5" style="fill: white; stroke: none" />
</mask>

<rect x="-100" y="-2.5" width="200" height="5" mask="url(#slider-rail-shadow)" style="fill: rgba(0, 0, 0, 0.2); stroke: none; pointer-events: none;" />


<rect class="pole" x="-2.5" y="-65" width="5" height="65" />
<line class="pole" x1="1" y1="-64" x2="1" y2="0" style="stroke: white" />
<line class="pole" x1="-1.5" y1="-64" x2="-1.5" y2="0" style="stroke: rgba(0, 0, 0, 0.1);" />

<clipPath id="pole-shadow-clip">
    <rect class="pole" x="-2.5" y="-70" width="5" height="70" style="fill: black;" />
</clipPath>


<mask id="top-circle-shadow">
    <circle cx="0" cy="0" r="10" style="stroke: none; fill: white;" />
    <circle cx="2" cy="-2" r="10" style="stroke: none; fill: black;" />
</mask>

<mask id="top-circle-pole-shadow-mask">
    <circle class="top-circle" cx="-1.5" cy="2.5" r="11" style="stroke: none; fill: white;" />
</mask>

<rect x="-200" y="-200" width="400" height="400" mask="url(#top-circle-pole-shadow-mask)" clip-path="url(#pole-shadow-clip)" style="fill: rgba(0, 0, 0, 0.15); stroke: none" />

<circle class="top-circle" id="drag-target" cx="0" cy="0" r="20" style="fill: transparent; stroke: none;" />
<circle class="top-circle" cx="0" cy="0" r="10" style="fill: #b0e4fE" />
<circle class="top-circle" cx="4" cy="-4" r="1.7" style="fill: rgba(255, 255, 255, 0.6); stroke: none" />
<circle class="top-circle" cx="0" cy="0" r="10.5" mask="url(#top-circle-shadow)" style="fill: rgba(0, 0, 0, 0.1)" />


<mask id="slider-pole-shadow-mask">
    <rect class="slider" x="-15.5" y="-6.5" width="28.7" height="15" rx="5" style="fill: white; stroke: none" />
</mask>

<rect x="-100" y="-100" width="200" height="200" mask="url(#slider-pole-shadow-mask)" clip-path="url(#pole-shadow-clip)" style="fill: rgba(0, 0, 0, 0.15); stroke: none" />
<rect class="slider" x="-13" y="-6" width="26" height="12" rx="3" style="fill: #3672a0" />
<rect class="slider" x="1.25" y="-4.25" width="10" height="2" rx="1" style="fill: rgba(255, 255, 255, 0.3); stroke: none" />
<rect class="slider" x="-12" y="-6" width="25" height="11" rx="2" style="fill: none; stroke: rgba(0, 0, 0, 0.15)" />

</svg>
`;


// get some of the elements
const svgs = Array.from(document.querySelectorAll("svg"));
const sliderElements = Array.from(document.querySelectorAll(".slider"));
const topCircleElements = Array.from(document.querySelectorAll(".top-circle"));
const poleElements = Array.from(document.querySelectorAll(".pole"));
const preventDrag = Array.from(document.querySelectorAll("input, button, #drag-target"));

const [pendulumSVG, shadowSVG] = svgs;

const stepsPerFrame = 10
const pi = 3.1415926535897932384;
const g = 9.81;                  // gravitational acceleration
const l = 0.65;                  // pendulum length
let dt = 0.016 / stepsPerFrame; // time step
const M = 1;                     // pendulum mass
const m = 1;                     // slider mass
const f = 0;                     // slider friction

let t = 0.1, x = 0.1, xdot = 0.1, xddot = 0.1, theta = 0, thetadot = 0.001, thetaddot = 0.001, lastTime = 0, timestamp = 0;
let solve = false
let cartRight, cartLeft
const randomValue = (Math.random() - 0.5) / 2;
thetadot += (randomValue + Math.sign(randomValue)) / l;
// vector operations
const mul = (vec, k) => vec.map(v => v * k);
const add = (vec1, vec2) => vec1.map((_, k) => vec1[k] + vec2[k]);
const dot = (vec1, vec2) => vec1.reduce((acc, val, k) => acc + vec1[k] * vec2[k], 0);
const mod = vec => vec.reduce((acc, val) => acc + val ** 2, 0) ** 0.5;
const norm = vec => mul(vec, 1 / mod(vec));
const rotm90 = vec => [vec[1], -vec[0]];
const crossmod = (vec1, vec2) => vec1[0] * vec2[1] - vec1[1] * vec2[0];


//position
let kp = 500;
let kpd = 200

//angle
let kt = 200
let ktd = 200

function normalize(angle) {

    while (angle > pi) {
        angle -= 2 * pi
    }
    while (angle < -pi) {
        angle += 2 * pi
    }
    return angle
}


function calculateControlInput() {
    const et = pi - theta
    console.log(pi, theta);
    if (Math.abs(et) > 0.01) {
        return ((kp * x + kpd * xdot) + (kt * theta + ktd * thetaddot)) * et
    } else {
        return 0
    }

}

function stateDot(state) {

    // get vars out of state vector
    const [theta, x, thetadot, xdot] = state;

    // equations of motion under gravity and controller
    let xddot = M / (m + M * Math.sin(theta) ** 2)
        * (l * thetadot ** 2 * Math.sin(theta)
            - g * Math.sin(theta) * Math.cos(theta))
        - f * xdot + calculateControlInput();

    let thetaddot = g / l * Math.sin(theta)
        - xddot / l * Math.cos(theta);



    // const force = solve ? calculateControlInput() : cartRight + cartLeft;
    // // add forces if there is a keyborad press event
    // if( force !== 0 ) {

    //     // direction vector of the pendulum pole
    //     const poleDir = [ Math.sin(theta), Math.cos(theta) ];

    //     // displacement vector to pendulum from mouse
    //     const dist = [ force - x - l*Math.sin(theta),
    //                    force     - l*Math.cos(theta) ];
    //   //  console.log(force);
    //     // create a force on the pendulum
    //     const springForce  = mul( dist, 600 );
    //     const thetaddotInc = crossmod( springForce, poleDir ) / ( M * l );
    //     const xddotInc     = dot( springForce, [1,0] ) / m - thetaddotInc * M*l/m * Math.cos(theta);

    //     // superpose the accelerations from the spring force onto those from the equations of motion
    //     // and add damping too
    //     thetaddot += thetaddotInc - thetadot * 40;
    //     xddot     += xddotInc     - xdot     * 40;
    //     // console.log(springForce)
    // }

    // return stateDot vector
    return [thetadot, xdot, thetaddot, xddot];
}

function updateCoordinates() {

    // increment time
    t += dt;

    // avoid division by 0
    if (l === 0) return;

    // handle bounce off edge of rail
    const bounce = Math.abs(x) > 0.875 && xdot * x > 0;
    
    thetadot += 2 * xdot * (Math.cos(theta) ** 2) / (l * Math.cos(theta)) * bounce;
    xdot += -2 * xdot * bounce;

    // get state vector
    const state = [theta, x, thetadot, xdot];

    // calculate RK4 intermediate values
    const k1 = stateDot(state);
    const k2 = stateDot(add(state, mul(k1, dt / 2)));
    const k3 = stateDot(add(state, mul(k2, dt / 2)));
    const k4 = stateDot(add(state, mul(k3, dt)));

    // calculate the overall RK4 step and increment the state vector
    const RK4step = mul(add(add(k1, mul(k2, 2)), add(mul(k3, 2), k4)), 1 / 6 * dt);


    // update the vars
    [theta, x, thetadot, xdot] = add(state, RK4step);

    // keep theta between -pi and pi
    if (theta > pi) theta -= 2 * pi;
    if (theta < -pi) theta += 2 * pi;
}



function updateGraphics() {

    // translate all the slider elements by sliderX
    let sliderTranslate = `translateX( ${100 * x}px )`
    sliderElements.forEach(elm => elm.style.transform = sliderTranslate);

    // translate the pole to connect to the slider then rotate it around by theta
    let poleTranslate = sliderTranslate + `rotateZ( ${theta * 57.296}deg ) scaleY( ${l / 0.65} )`;
    poleElements.forEach(elm => elm.style.transform = poleTranslate);

    // place the circle on top of the pole
    let topCircleTranslate = sliderTranslate + `translateX( ${100 * l * Math.sin(theta)}px ) translateY( ${-100 * l * Math.cos(theta)}px )`
    topCircleElements.forEach(elm => elm.style.transform = topCircleTranslate);
}


function mainloop(millis, lastMillis) {
    dt = (millis - lastMillis) / 1000 / stepsPerFrame;


    // do the physics step as many times as needed 
    for (let s = 0; s < stepsPerFrame; ++s) {
        updateCoordinates();
    }

    // update the graphics
    updateGraphics();

   // console.log( 1/2*m*xdot**2 + 1/2*M*( ( xdot + l*thetadot*Math.cos(theta) )**2+ (l*thetadot*Math.sin(theta))**2 ) + M*g*l*Math.cos(theta) );

    // call this again after 1 frame
    requestAnimationFrame(newMillis => mainloop(newMillis, millis));
}
mainloop(0, 0)
// Event listeners
window.addEventListener("keydown", (event) => {

    if (event.code === "l" || event.code === "L" || event.code === "KeyL") {
        ai()
    }
    if (event.code === "ArrowLeft") {
        cartLeft = -1;
    } else if (event.code === "ArrowRight") {
        cartRight = 1;
    }
});

window.addEventListener("keyup", (event) => {
    if (event.code === "ArrowLeft") {
        cartLeft = 0;
    } else if (event.code === "ArrowRight") {
        cartRight = 0;
    }
});







function ai() {
    solve = !solve; // Toggle the value
    console.log(solve ? "Solving" : "Stopped");
}