let video;
let poses = [];
let poseDetectionRegistration;
let pose;

const partsToTrack = [
  "nose",
  "leftElbow",
  "rightElbow",
  "rightWrist",
  "leftWrist",
  "rightAnkle",
  "leftAnkle",
  "leftHip",
  "rightHip"
];


let p5setupPoseNet = sketch => {
  video = createCapture(sketch.VIDEO);
  video.size(sketch.width, sketch.height);

  const ml5Options = {
    imageScaleFactor: 0.2,
    outputStride: 16,  // 8, 16, 32
    flipHorizontal: true,
    minConfidence: 0.5,
    maxPoseDetections: 1,
    scoreThreshold: 0.5,
    nmsRadius: 20,
    detectionType: 'single',
    multiplier: 0.75,
   }

  // Create a new poseNet method with a single detection
  const poseNet = ml5.poseNet(video, ml5Options, function() {console.log('ML5 Model Loaded')});
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
      displayLabel: "Mode",
      resetValue: "Basic",
      defaultValue: "Basic",
      currentValue: "Triangulate",
      targetValue: null,
      options: ["Basic", "Flocking", "Triangulate", "Shaper"],
      attrType: "variable",
      lockOn: false
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

    this.boidAlignDist = {
      displayLabel: "Boid Align Dist",
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

    this.boidCohesionDist = {
      displayLabel: "Boid Cohesion Dist",
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


    this.maxBoidSpeed = {
      displayLabel: "Boid Speed",
      resetValue: 8,
      defaultValue: 8,
      currentValue: 8,
      targetValue: null,
      min: 1, // this can be edited by the user
      defaultMin: 1, //  this is the range within which the user can edit the min and max values
      max: 20, // this can be edited by the user
      defaultMax: 20, //  this is the range within which the user can edit the min and max values
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

    this.maxBoidForce = {
      displayLabel: "Boid Turning Force",
      resetValue: 0.8,
      defaultValue: 0.8,
      currentValue: 0.8,
      targetValue: null,
      min: 0.01, // this can be edited by the user
      defaultMin: 0.01, //  this is the range within which the user can edit the min and max values
      max: 5, // this can be edited by the user
      defaultMax: 5, //  this is the range within which the user can edit the min and max values
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
  // We can call both functions to draw all keypoints and the skeletons

  if (this.mode.currentValue === "Flocking") {
    flock.run();
  }

  if (this.mode.currentValue === "Triangulate") {
    createParticle();
    renderParticleNet();
  }

  if (this.mode.currentValue === "Shaper") {
    this.renderShaper();
  }

  this.drawKeypoints();
  // this.drawSkeleton();
};



// A function to draw ellipses over the detected keypoints
PoseDetector.prototype.drawKeypoints = function() {
  // Loop through all the poses detected
  if (!poses) {
      return;
  }
  
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
  if (!poses) {
      return;
  }
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      myp5.stroke(this.hue.currentValue, this.saturation.currentValue, 100);
      myp5.stroke(0, this.saturation.currentValue, 100);
      myp5.strokeWeight(8);
      myp5.line(
        partA.position.x,
        partA.position.y,
        partB.position.x,
        partB.position.y
      );
    }
  }
};

PoseDetector.prototype.renderShaper = function() {
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    this.history.unshift(pose);
    myp5.noFill();
    myp5.strokeWeight(3);
    myp5.stroke(this.hue.currentValue, this.saturation.currentValue, 100);
    this.renderShaperPose(pose);
  }
}

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

PoseDetector.prototype.renderShaperPose = function(pose) {

  myp5.noFill();
  myp5.strokeWeight(5);
  myp5.beginShape();
  let first = null;
  for (let j = 0; j < pose.keypoints.length; j++) {
    // A keypoint is an object describing a body part (like rightArm or leftShoulder)
    let keypoint = pose.keypoints[j];

    if (keypoint.score < 0.2) {
      continue;
    }

    // if (!partsToTrack.includes(keypoint.part) || keypoint.part.toLowerCase() === 'nose') {
    //   continue;
    // }

    if (first === null) {
      first = j;
    }
       
    myp5.curveVertex(keypoint.position.x - this.windowWidth / 2, keypoint.position.y - this.windowHeight / 2);
  }
  if (first && pose.keypoints) {
    // myp5.curveVertex(pose.keypoints[first].position.x - this.windowWidth / 2, pose.keypoints[first].position.y - this.windowHeight / 2);
  }
  myp5.endShape(CLOSE);
  myp5.noStroke();

}

PoseDetector.prototype.renderPose = function(pose) {
  for (let j = 0; j < pose.keypoints.length; j++) {
    // A keypoint is an object describing a body part (like rightArm or leftShoulder)
    let keypoint = pose.keypoints[j];
    if (keypoint.score > 0.2) {

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
      this.boids[i].run(this.boids, i); // Passing the entire list of boids to each boid individually
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
class Boid {
    constructor(x, y) {
        this.acceleration = myp5.createVector(myp5.windowWidth / 2, myp5.windowHeight / 2);
        this.velocity = myp5.createVector(myp5.random(-1, 1), myp5.random(-1, 1));
        // if (flipHorizintal) {
            // this.position = myp5.createVector(-x, y);
        // }
        // else {
        this.position = myp5.createVector(x, y);
        // }
        this.r = 5;
        this.maxspeed = poseDetectionRegistration.maxBoidSpeed.defaultValue; // Maximum speed
        this.maxforce = poseDetectionRegistration.maxBoidForce.defaultValue; // Maximum steering force
    }
    run(boids, i) {
        this.flock(boids);
        this.updateBoid();
        this.boidBorders();
        this.renderBoid(i);
    }
    applyForce(force) {
        // We could add mass here if we want A = F / M
        this.acceleration.add(force);
    }
    // We accumulate a new acceleration each time based on three rules
    flock(boids) {
        let sep = this.separateBoids(boids); // Separation
        let ali = this.alignBoids(boids); // Alignment
        let coh = this.boidCohesion(boids); // Cohesion
        // Arbitrarily weight these forces
        sep.mult(1.5);
        ali.mult(1.0);
        coh.mult(1.0);
        // Add the force vectors to acceleration
        this.applyForce(sep);
        this.applyForce(ali);
        this.applyForce(coh);
    }
    // Method to update location
    updateBoid() {
        // Update velocity
        this.velocity.add(this.acceleration);
        // Limit speed
        this.velocity.limit(poseDetectionRegistration.maxBoidSpeed.currentValue);
        this.position.add(this.velocity);
        // Reset accelertion to 0 each cycle
        this.acceleration.mult(0);
    }
    // A method that calculates and applies a steering force towards a target
    // STEER = DESIRED MINUS VELOCITY
    seekBoid(target) {
        let nearestTarget = getNearestTartget(this.position);
        // console.log(nearestTarget);
        // console.log(nearestTarget);
        let homingDirection = myp5.createVector(nearestTarget.x, nearestTarget.y);
        //   let homingDirection = myp5.createVector(myp5.mouseX, myp5.mouseY);
        let desired = p5.Vector.sub(homingDirection, this.position); // A vector pointing from the location to the target
        // Normalize desired and scale to maximum speed
        desired.normalize();
        desired.mult(poseDetectionRegistration.maxBoidSpeed.currentValue);
        // Steering = Desired minus Velocity
        let steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(poseDetectionRegistration.maxBoidForce.currentValue); // Limit to maximum steering force
        return steer;
    }
    renderBoid(i) {
        // Draw a triangle rotated in the direction of velocity
        let theta = this.velocity.heading() + radians(90);
        this.r = myp5.map(poseDetectionRegistration.radius.currentValue, poseDetectionRegistration.radius.min, poseDetectionRegistration.radius.max, 2, 15);
        this.r = this.r * (1 + myp5.noise((5 * i) + myp5.frameCount * 0.009 ));
        myp5.noFill();
        myp5.stroke(poseDetectionRegistration.hue.currentValue, poseDetectionRegistration.saturation.currentValue, 200);
        myp5.strokeWeight(2);
        myp5.push();
        myp5.translate(this.position.x - myp5.width / 2, this.position.y - myp5.height / 2);
        myp5.rotate(theta);
        myp5.beginShape();
        myp5.vertex(0, -this.r * 2);
        myp5.vertex(-this.r, this.r * 5);
        myp5.vertex(this.r, this.r * 5);
        myp5.endShape(CLOSE);
        myp5.pop();
    }
    // Wraparound
    boidBorders() {
        if (this.position.x < -this.r)
            this.position.x = myp5.width + this.r;
        if (this.position.y < -this.r)
            this.position.y = myp5.height + this.r;
        if (this.position.x > myp5.width + this.r)
            this.position.x = -this.r;
        if (this.position.y > myp5.height + this.r)
            this.position.y = -this.r;
    }
    // Separation
    // Method checks for nearby boids and steers away
    separateBoids(boids) {
        let desiredseparation = myp5.map(poseDetectionRegistration.trailLength.currentValue, poseDetectionRegistration.trailLength.min, poseDetectionRegistration.trailLength.max, 0, 40);
        // let desiredseparation = 25.0;
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
            steer.mult(poseDetectionRegistration.maxBoidSpeed.currentValue);
            steer.sub(this.velocity);
            steer.limit(poseDetectionRegistration.maxBoidForce.currentValue);
        }
        return steer;
    }
    // Alignment
    // For every nearby boid in the system, calculate the average velocity
    alignBoids(boids) {
        let neighbordist = myp5.map(poseDetectionRegistration.boidAlignDist.currentValue, poseDetectionRegistration.boidAlignDist.min, poseDetectionRegistration.boidAlignDist.max, 0, 100);

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
            sum.mult(poseDetectionRegistration.maxBoidSpeed.currentValue);
            let steer = p5.Vector.sub(sum, this.velocity);
            steer.limit(poseDetectionRegistration.maxBoidForce.currentValue);
            return steer;
        }
        else {
            return createVector(0, 0);
        }
    }
    // Cohesion
    // For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
    boidCohesion(boids) {
      let neighbordist = myp5.map(poseDetectionRegistration.boidCohesionDist.currentValue, poseDetectionRegistration.boidCohesionDist.min, poseDetectionRegistration.boidCohesionDist.max, 0, 100);
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
            return this.seekBoid(sum); // Steer towards the location
        }
        else {
            return myp5.createVector(0, 0);
        }
    }
}


let flock;
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
    if (keypoint.score < 0.2 || keypoint.position.x > myp5.width || keypoint.position.x < 0 || keypoint.position.y < 0 || keypoint.position.y > myp5.height ) {
      continue;
    }

    if (!partsToTrack.includes(keypoint.part)) {
        continue;
    }

    let part = keypoint.part.toLowerCase();
    let gravity = 0;

    // have a graviational preference to these body parts
    if (part.includes('wrist')) {
      gravity = 0.4;
    }
    else if (part.includes('ankle')) {
      gravity = 0.3;
    }
    else if (part.includes('elbow')) {
      gravity = 0.1;
    }
    else if (part.includes('nose')) {
      gravity = 0.1;
    }
    else if (part.includes('hip')) {
      gravity = 0.05;
    }



    nextDistance = getDistance(seeker, keypoint.position);
    nextDistance = nextDistance * (nextDistance/gravity);

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









/*
Frozen brush

Makes use of a delaunay algorithm to create crystal-like shapes.
I did NOT develop delaunay.js, and not sure who the author really is to give proper credit.

Controls:
	- Drag the mouse.
    - Press any key to toggle between fill and stroke.

Inspired by:
	Makio135's sketch www.openprocessing.org/sketch/385808

Author:
  Jason Labbe

Site:
  jasonlabbe3d.com
*/

var allParticles = [];
var maxLevel = 5;
var useFill = false;

var data = [];


// Moves to a random direction and comes to a stop.
// Spawns other particles within its lifetime.
class Particle {
  constructor(x, y, level) {
    this.level = level;
    this.life = 0;
    this.pos = new p5.Vector(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.mult(map(this.level, 0, maxLevel, 5, 2));
    this.move = function () {
      this.life++;
      // Add friction.
      this.vel.mult(0.9);
      this.pos.add(this.vel);
      // Spawn a new particle if conditions are met.
      if (this.life % 10 == 0) {
        if (this.level > 0) {
          this.level -= 1;
          var newParticle = new Particle(this.pos.x, this.pos.y, this.level - 1);
          allParticles.push(newParticle);
        }
      }
    };
  }
}




function renderParticleNet() {
  // Create fade effect.
  // myp5.noStroke();
  // myp5.fill(0, 30);
  // myp5.rect(0, 0, width, height);
  
  // Move and spawn particles.
  // Remove any that is below the velocity threshold.
  for (var i = allParticles.length-1; i > -1; i--) {
    allParticles[i].move();
    
    if (allParticles[i].vel.mag() < .5) {
      allParticles.splice(i, 1);
    }
  }
  
  if (allParticles.length > 0) {
    // Run script to get points to create triangles with.
    data = Delaunay.triangulate(allParticles.map(function(pt) {
      return [pt.pos.x, pt.pos.y];
    }));
  	
    myp5.strokeWeight(0.5);
    
    // Display triangles individually.
    for (var i = 0; i < data.length; i += 3) {
      // Collect particles that make this triangle.
      var p1 = allParticles[data[i]];
      var p2 = allParticles[data[i+1]];
      var p3 = allParticles[data[i+2]];
      
      // Don't draw triangle if its area is too big.
      var distThreshMax = 300;
      var distTreshMin = 20;
      
      if (myp5.dist(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y) > distThreshMax || myp5.dist(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y) < distTreshMin) {
        continue;
      }
      
      if (myp5.dist(p2.pos.x, p2.pos.y, p3.pos.x, p3.pos.y) > distThreshMax || myp5.dist(p2.pos.x, p2.pos.y, p3.pos.x, p3.pos.y) < distTreshMin) {
        continue;
      }
      
      if (myp5.dist(p1.pos.x, p1.pos.y, p3.pos.x, p3.pos.y) > distThreshMax || myp5.dist(p1.pos.x, p1.pos.y, p3.pos.x, p3.pos.y) < distTreshMin) {
        continue;
      }
      
      // Base its hue by the particle's life.
      let color = poseDetectionRegistration.hue.currentValue;
      if (useFill) {
        myp5.noStroke();
        myp5.fill(color + p1.life * 1.5, 360, 360);
      } else {
        myp5.noFill();
        myp5.stroke(color + p1.life * 1.5, 360, 360);
      }
      
      myp5.strokeWeight(2)
      myp5.triangle(p1.pos.x, p1.pos.y, 
               p2.pos.x, p2.pos.y, 
               p3.pos.x, p3.pos.y);
    }
  }
  
  myp5.noStroke();
  myp5.fill(255);
}


function createParticle() {

  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;

    for (let j = 0; j < pose.keypoints.length; j++) {
    // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      if (keypoint.score > 0.2 && partsToTrack.includes(keypoint.part)) {
        allParticles.push(new Particle(keypoint.position.x - this.windowWidth / 2, keypoint.position.y - this.windowHeight / 2, maxLevel));
      }
    }
  }
}




function keyPressed() {
  useFill = ! useFill;
}