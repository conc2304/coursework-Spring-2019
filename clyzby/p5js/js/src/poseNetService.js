let video;
let poseNet;
let poses = [];
let poseDetectionRegistration;

let flipHorizintal = true;

let flock;

let p5setupPoseNet = sketch => {
  video = createCapture(sketch.VIDEO);
  video.size(sketch.width, sketch.height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on("pose", function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();

  initializeBoids(sketch.width, sketch.height);
};

class PoseDetector {
  constructor(windowWidth, windowHeight) {
    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
    this.easeInto = easeInto;
    this.history = [];
    this.colorRotate = true;
    this.mode = {
      currentValue: "Flocking"
    };

    this.radius = {
      displayLabel: "Size",
      description: "Sets the size of all of the 3D shapes.",
      resetValue: 40,
      defaultValue: 40,
      currentValue: 40,
      targetValue: null,
      min: 20, // this can be edited by the user
      defaultMin: 20, // this is the range within which the user can edit the min and max values
      max: 500, // this can be edited by the user
      defaultMax: 500, // this is the range within which the user can edit the min and max values
      attrType: "numeric",
      triggerSource: null,
      lockOn: false,
      audio: {
        responsiveType: "add",
        responsiveOptions: ["add", "subtract"],
        gain: 0.5,
        fall: 1
      },
      easingValue: 0.7,
      noteHeldEasing: 0.05,
      easingMax: 0,
      easingMin: 0
    };

    this.trailLength = {
      displayLabel: "Trail Length",
      resetValue: 50,
      defaultValue: 50,
      currentValue: 50,
      targetValue: null,
      min: 0, // this can be edited by the user
      defaultMin: 0, //  this is the range within which the user can edit the min and max values
      max: 100, // this can be edited by the user
      defaultMax: 100, //  this is the range within which the user can edit the min and max values
      attrType: "numeric",
      audio: {
        responsiveType: "add",
        responsiveOptions: ["add", "subtract"],
        gain: 0.5,
        fall: 1 // not sure what this will do yet
      },
      triggerSource: null,
      lockOn: false,
      easingValue: 0.7,
      noteHeldEasing: 0.1,
      easingMax: 0,
      easingMin: 0
    };

    this.shape = {
      displayLabel: "Shape",
      resetValue: "ellipse",
      defaultValue: "ellipse",
      currentValue: "ellipse",
      targetValue: null,
      options: ["line", "triangle", "square", "pentagon", "ellipse"],
      attrType: "variable",
      lockOn: false
    };

    this.hue = {
      displayLabel: "Color",
      resetValue: 100,
      defaultValue: 100,
      currentValue: 200,
      targetValue: null,
      min: 0, // this can be edited by the user
      defaultMin: 0, //  this is the range within which the user can edit the min and max values
      max: 360, // this can be edited by the user
      defaultMax: 360, //  this is the range within which the user can edit the min and max values
      attrType: "numeric",
      audio: {
        responsiveType: "add",
        responsiveOptions: ["add", "subtract"],
        gain: 0.5,
        fall: 1 // not sure what this will do yet
      },
      triggerSource: null,
      lockOn: false,
      easingValue: 0.1,
      noteHeldEasing: 0.1,
      easingMax: 0,
      easingMin: 0
    };

    this.saturation = {
      displayLabel: "Saturation",
      resetValue: 100,
      defaultValue: 100,
      currentValue: 100,
      targetValue: null,
      min: 0, // this can be edited by the user
      defaultMin: 0, //  this is the range within which the user can edit the min and max values
      max: 100, // this can be edited by the user
      defaultMax: 100, //  this is the range within which the user can edit the min and max values
      attrType: "numeric",
      audio: {
        responsiveType: "add",
        responsiveOptions: ["add", "subtract"],
        gain: 0.5,
        fall: 1 // not sure what this will do yet
      },
      triggerSource: null,
      lockOn: false,
      easingValue: 0.1,
      noteHeldEasing: 0.1,
      easingMax: 0,
      easingMin: 0
    };
  }
}

PoseDetector.prototype.render = function() {
  this.easeInto();

  // myp5.image(video, - this.windowWidth / 2, -this.windowHeight / 2, this.windowWidth, this.windowHeight);

  // We can call both functions to draw all keypoints and the skeletons

  if (this.mode.currentValue === "Flocking") {
    flock.run();
    //   } else {
    // this.drawTrailers();
    if (flipHorizintal) {
      myp5.scale(-1.0, 1.0);
    }
    this.drawKeypoints();
    this.drawSkeleton();
    if (flipHorizintal) {
      myp5.scale(1.0, 1.0);
    }
  }
};

// A function to draw ellipses over the detected keypoints
PoseDetector.prototype.drawKeypoints = function() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    this.history.unshift(pose);
    myp5.noFill();
    myp5.strokeWeight(3);
    myp5.stroke(this.hue.currentValue, this.saturation.currentValue, 100);
    this.renderPose(pose);
  }
};

PoseDetector.prototype.drawSkeleton = function() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      myp5.stroke(this.hue.currentValue, this.saturation.currentValue, 100);
      myp5.strokeWeight(1);
      myp5.line(
        partA.position.x,
        partA.position.y,
        partB.position.x,
        partB.position.y
      );
    }
  }
};

PoseDetector.prototype.drawTrailers = function() {
  this.history = this.history.slice(0, this.trailLength.currentValue);
  let historyLength = this.history.length;

  for (let i = 0; i < historyLength; i++) {
    let percent = (historyLength - (i + 1)) / historyLength;
    let rotationAmount = myp5.map(percent, 0, 1, 0, 100);
    let pose = this.history[i];
    let tempHue = this.hue.currentValue;

    let hue =
      this.colorRotate === true ? (tempHue + rotationAmount) % 360 : tempHue;

    myp5.noFill();
    myp5.strokeWeight(3);
    myp5.stroke(hue, this.saturation.currentValue, rotationAmount);
    this.renderPose(pose);
  }
};

PoseDetector.prototype.renderPose = function(pose) {
  for (let j = 0; j < pose.keypoints.length; j++) {
    // A keypoint is an object describing a body part (like rightArm or leftShoulder)
    let keypoint = pose.keypoints[j];
    if (keypoint.score > 0.2) {
      // console.log('render');
      // console.log({x: keypoint.position.x - this.windowWidth / 2, y: keypoint.position.y - this.windowHeight / 2, part: keypoint.part});
      this.renderShape(
        keypoint.position.x - this.windowWidth / 2,
        keypoint.position.y - this.windowHeight / 2,
        this.radius.currentValue
      );
    }
  }
};

/**
 * Renders a given shape along the the passed x and y positions.
 * @param xPos
 * @param yPos
 * @param radius
 */
PoseDetector.prototype.renderShape = function(xPos, yPos, radius) {
  let polygons = ["line", "triangle", "square", "pentagon"]; // polygons we are allowing for set in the shape attribute

  if (this.shape.currentValue === "ellipse") {
    myp5.ellipse(xPos, yPos, radius, radius); // one above and one below
  } else if (polygons.includes(this.shape.currentValue)) {
    let sides;
    switch (this.shape.currentValue) {
      case "line":
        sides = 2;
        break;
      case "triangle":
        sides = 3;
        break;
      case "square":
        sides = 4;
        break;
      case "pentagon":
        sides = 5;
        break;
    }
    myp5.pop();
    myp5.strokeWeight(3);
    myp5.translate(xPos, yPos);
    myp5.rotate(myp5.atan(myp5.frameCount / 50.0));
    myp5.polygon(0, 0, radius, sides);
    myp5.push();
  } else {
    myp5.ellipse(xPos, yPos, radius, radius); // one above and one below
  }
};

function initializeBoids(windowWidth, windowHeight) {
  flock = new Flock();
  // Add an initial set of boids into the system
  for (let i = 0; i < 100; i++) {
    let b = new Boid(windowWidth, windowHeight);
    flock.addBoid(b);
  }
}

// Add a new boid into the System
function mouseDragged() {
  flock.addBoid(new Boid(myp5.mouseX - myp5.width, myp5.mouseY));
}

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com
// Flock object
// Does very little, simply manages the array of all the boids
class Flock {
  constructor() {
    // An array for all the boids
    this.boids = []; // Initialize the array
  }
  run() {
    for (let i = 0; i < this.boids.length; i++) {
      this.boids[i].run(this.boids); // Passing the entire list of boids to each boid individually
    }
  }
  addBoid(b) {
    this.boids.push(b);
  }
}

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Boid class
// Methods for Separation, Cohesion, Alignment added

function Boid(x, y) {
  this.acceleration = myp5.createVector(0, 0);
  this.velocity = myp5.createVector(myp5.random(-1, 1), myp5.random(-1, 1));
  if (flipHorizintal) {
    this.position = myp5.createVector(-x, y);
  } else {
    this.position = myp5.createVector(x, y);
  }
  this.r = 3.0;
  this.maxspeed = 15; // Maximum speed
  this.maxforce = 1; // Maximum steering force
}

Boid.prototype.run = function(boids) {
  this.flock(boids);
  this.update();
  this.borders();
  this.render();
};

Boid.prototype.applyForce = function(force) {
  // We could add mass here if we want A = F / M
  this.acceleration.add(force);
};

// We accumulate a new acceleration each time based on three rules
Boid.prototype.flock = function(boids) {
  let sep = this.separate(boids); // Separation
  let ali = this.align(boids); // Alignment
  let coh = this.cohesion(boids); // Cohesion
  // Arbitrarily weight these forces
  sep.mult(1.5);
  ali.mult(1.0);
  coh.mult(1.0);
  // Add the force vectors to acceleration
  this.applyForce(sep);
  this.applyForce(ali);
  this.applyForce(coh);
};

// Method to update location
Boid.prototype.update = function() {
  // Update velocity
  this.velocity.add(this.acceleration);
  // Limit speed
  this.velocity.limit(this.maxspeed);
  this.position.add(this.velocity);
  // Reset accelertion to 0 each cycle
  this.acceleration.mult(0);
};

// A method that calculates and applies a steering force towards a target
// STEER = DESIRED MINUS VELOCITY
Boid.prototype.seek = function(target) {
  let mouseX = flipHorizintal ? -myp5.mouseX : myp5.mouseX;
  //   let nearestTarget = getNearestTartget(this.position);
  //   console.log(nearestTarget);
  //   let homingDirection = myp5.createVector(nearestTarget.x, nearestTarget.y);
  console.log(-myp5.mouseX);
  console.log(myp5.mouseX);
  let homingDirection = myp5.createVector(myp5.mouseX, myp5.mouseY);
  let desired = p5.Vector.sub(homingDirection, this.position); // A vector pointing from the location to the target
  // Normalize desired and scale to maximum speed
  desired.normalize();
  desired.mult(this.maxspeed);
  // Steering = Desired minus Velocity
  let steer = p5.Vector.sub(desired, this.velocity);
  steer.limit(this.maxforce); // Limit to maximum steering force
  return steer;
};

Boid.prototype.render = function() {
  // Draw a triangle rotated in the direction of velocity
  let theta = this.velocity.heading() + radians(90);
  myp5.fill(127);
  myp5.stroke(200);
  myp5.strokeWeight(1);
  myp5.push();
  myp5.translate(
    this.position.x - myp5.width / 2,
    this.position.y - myp5.height / 2
  );
  myp5.rotate(theta);
  myp5.beginShape();
  myp5.vertex(0, -this.r * 2);
  myp5.vertex(-this.r, this.r * 5);
  myp5.vertex(this.r, this.r * 5);
  myp5.endShape(CLOSE);
  myp5.pop();
};

// Wraparound
Boid.prototype.borders = function() {
  if (this.position.x < -this.r) this.position.x = myp5.width + this.r;
  if (this.position.y < -this.r) this.position.y = myp5.height + this.r;
  if (this.position.x > myp5.width + this.r) this.position.x = -this.r;
  if (this.position.y > myp5.height + this.r) this.position.y = -this.r;
};

// Separation
// Method checks for nearby boids and steers away
Boid.prototype.separate = function(boids) {
  let desiredseparation = 25.0;
  let steer = myp5.createVector(0, 0);
  let count = 0;
  // For every boid in the system, check if it's too close
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position, boids[i].position);
    // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
    if (d > 0 && d < desiredseparation) {
      // Calculate vector pointing away from neighbor
      let diff = p5.Vector.sub(this.position, boids[i].position);
      diff.normalize();
      diff.div(d); // Weight by distance
      steer.add(diff);
      count++; // Keep track of how many
    }
  }
  // Average -- divide by how many
  if (count > 0) {
    steer.div(count);
  }

  // As long as the vector is greater than 0
  if (steer.mag() > 0) {
    // Implement Reynolds: Steering = Desired - Velocity
    steer.normalize();
    steer.mult(this.maxspeed);
    steer.sub(this.velocity);
    steer.limit(this.maxforce);
  }
  return steer;
};

// Alignment
// For every nearby boid in the system, calculate the average velocity
Boid.prototype.align = function(boids) {
  let neighbordist = 50;
  let sum = createVector(0, 0);
  let count = 0;
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position, boids[i].position);
    if (d > 0 && d < neighbordist) {
      sum.add(boids[i].velocity);
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    sum.normalize();
    sum.mult(this.maxspeed);
    let steer = p5.Vector.sub(sum, this.velocity);
    steer.limit(this.maxforce);
    return steer;
  } else {
    return createVector(0, 0);
  }
};

// Cohesion
// For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
Boid.prototype.cohesion = function(boids) {
  let neighbordist = 50;
  let sum = myp5.createVector(0, 0); // Start with empty vector to accumulate all locations
  let count = 0;
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position, boids[i].position);
    if (d > 0 && d < neighbordist) {
      sum.add(boids[i].position); // Add location
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    return this.seek(sum); // Steer towards the location
  } else {
    return myp5.createVector(0, 0);
  }
};

function getNearestTartget(seeker) {
  let distance = null;
  let position = { x: 0, y: 0 };

  if (!poses || poses.length <= 0 || !poses[0].pose.keypoints) {
    return position;
  }
  let keypoints = poses[0].pose.keypoints;

  for (let i = 0; i < keypoints.length; i++) {
    // A keypoint is an object describing a body part (like rightArm or leftShoulder)
    let keypoint = keypoints[i];
    if (keypoint.score < 0.2) {
      continue;
    }

    keypoint.position.x -= this.windowWidth / 2;
    keypoint.position.y -= this.windowHeight / 2;
    nextDistance = getDistance(seeker, keypoint.position);

    if (distance === null) {
      currentDistance = nextDistance;
      position = {
        x: keypoint.position.x,
        y: keypoint.position.y,
        part: keypoint.part
      };
    }

    if (currentDistance <= nextDistance) {
      distance = currentDistance;
      position = {
        x: keypoint.position.x,
        y: keypoint.position.y,
        part: keypoint.part
      };
    }
  }
  return position;
}

function getDistance(p, q) {
  let dx = p.x - q.x;
  let dy = p.y - q.y;
  let dist = Math.sqrt(dx * dx + dy * dy);
  return dist;
}
