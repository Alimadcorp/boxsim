let Engine = Matter.Engine;
let World = Matter.World;
let Bodies = Matter.Bodies;
let Body = Matter.Body;
let engine, world;
let boxes = [];
let ground, leftWall, rightWall, ceiling;
let tiltX = 0;
let tiltY = 0;
let g = 1.2;
let accAmp = 1.2;
let boxSize = 40;
function setup() {
  createCanvas(windowWidth, windowHeight);
  boxSize = width / 9;
  engine = Engine.create();
  world = engine.world;
  engine.world.gravity.y = 0;
  ground = Bodies.rectangle(width / 2, height + 10, width, 20, {
    isStatic: true
  });
  leftWall = Bodies.rectangle(-10, height / 2, 20, height, {
    isStatic: true
  });
  rightWall = Bodies.rectangle(width + 10, height / 2, 20, height, {
    isStatic: true
  });
  ceiling = Bodies.rectangle(width / 2, -10, width, 20, {
    isStatic: true
  });
  World.add(world, [ground, leftWall, rightWall, ceiling]);
  for (let i = 0; i < 10; i++) {
    let box = Bodies.rectangle(random(width), random(height / 2), boxSize, boxSize);
    boxes.push(box);
    World.add(world, box);
  }
  window.addEventListener("deviceorientation", handleOrientation);
}
function draw() {
  background(0);
  Engine.update(engine);
  if (typeof accelerationX !== 'undefined' && typeof accelerationY !== 'undefined') {
    for (let box of boxes) {
      Body.applyForce(box, box.position, {
        x: accelerationX * -0.001 * accAmp,
        y: accelerationY * -0.001 * accAmp
      });
    }
  }
  let gravityScale = 0.00005;
  for (let box of boxes) {
    Body.applyForce(box, box.position, {
      x: tiltX * gravityScale * g,
      y: tiltY * gravityScale * g,
    });
  }
  fill(255, 100, 100);
  noStroke();
  for (let box of boxes) {
    beginShape();
    for (let vtx of box.vertices) {
      vertex(vtx.x, vtx.y);
    }
    endShape(CLOSE);
  }
}
function handleOrientation(event) {
  tiltX = event.gamma;
  tiltY = event.beta;
}
function clamp(x, l){
  return constrain(x, boxSize / 2, l == 'w' ? width - boxSize/2 : height - boxSize/2);
}
function touchStarted() {
  for (let t of touches) {
    let box = Bodies.rectangle(clamp(t.x, 'w'), clamp(t.y, 'h'), boxSize, boxSize);
    boxes.push(box);
    World.add(world, box);
  }
  return false;
}