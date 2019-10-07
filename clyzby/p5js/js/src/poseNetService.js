
let video;
let poseNet;
let poses = [];
let poseDetectionRegistration;

let p5setupPoseNet = (sketch) => {
    video = createCapture(sketch.VIDEO);
    video.size(sketch.width, sketch.height);

    // Create a new poseNet method with a single detection
    poseNet = ml5.poseNet(video);
    // This sets up an event that fills the global variable "poses"
    // with an array every time new poses are detected
    poseNet.on('pose', function (results) {
        poses = results;
    });
    // Hide the video element, and just show the canvas
    video.hide();
}


class PoseDetector {
    constructor(windowWidth, windowHeight) {
        this.windowWidth = windowWidth;
        this.windowHeight = windowHeight;
        this.easeInto = easeInto;
        this.history = [];
        this.colorRotate = true;



        this.radius = {
            displayLabel: 'Size',
            description: 'Sets the size of all of the 3D shapes.',
            resetValue: 40,
            defaultValue: 40,
            currentValue: 40,
            targetValue: null,
            min: 20,   // this can be edited by the user
            defaultMin: 20,    // this is the range within which the user can edit the min and max values
            max: 500,    // this can be edited by the user
            defaultMax: 500,   // this is the range within which the user can edit the min and max values
            attrType: 'numeric',
            triggerSource: null,
            lockOn: false,
            audio: {
                responsiveType: 'add',
                responsiveOptions: ['add', 'subtract'],
                gain: 0.5,
                fall: 1,
            },
            easingValue: 0.7,
            noteHeldEasing: 0.05,
            easingMax: 0,
            easingMin: 0,
        };

        this.trailLength = {
            displayLabel: 'Trail Length',
            resetValue: 50,
            defaultValue: 50,
            currentValue: 50,
            targetValue: null,
            min: 0,    // this can be edited by the user
            defaultMin: 0,   //  this is the range within which the user can edit the min and max values
            max: 100,    // this can be edited by the user
            defaultMax: 100,   //  this is the range within which the user can edit the min and max values
            attrType: 'numeric',
            audio: {
                responsiveType: 'add',
                responsiveOptions: ['add', 'subtract'],
                gain: 0.5,
                fall: 1, // not sure what this will do yet
            },
            triggerSource: null,
            lockOn: false,
            easingValue: 0.7,
            noteHeldEasing: 0.1,
            easingMax: 0,
            easingMin: 0,
        };

        this.shape = {
            displayLabel: 'Shape',
            resetValue: 'ellipse',
            defaultValue: 'ellipse',
            currentValue: 'ellipse',
            targetValue: null,
            options: ['line', 'triangle', 'square', 'pentagon', 'ellipse'],
            attrType: 'variable',
            lockOn: false,
        };

        this.hue = {
            displayLabel: 'Color',
            resetValue: 100,
            defaultValue: 100,
            currentValue: 200,
            targetValue: null,
            min: 0,    // this can be edited by the user
            defaultMin: 0,   //  this is the range within which the user can edit the min and max values
            max: 360,    // this can be edited by the user
            defaultMax: 360,   //  this is the range within which the user can edit the min and max values
            attrType: 'numeric',
            audio: {
                responsiveType: 'add',
                responsiveOptions: ['add', 'subtract'],
                gain: 0.5,
                fall: 1, // not sure what this will do yet
            },
            triggerSource: null,
            lockOn: false,
            easingValue: 0.1,
            noteHeldEasing: 0.1,
            easingMax: 0,
            easingMin: 0,
        };

        this.saturation = {
            displayLabel: 'Saturation',
            resetValue: 100,
            defaultValue: 100,
            currentValue: 100,
            targetValue: null,
            min: 0,    // this can be edited by the user
            defaultMin: 0,   //  this is the range within which the user can edit the min and max values
            max: 100,    // this can be edited by the user
            defaultMax: 100,   //  this is the range within which the user can edit the min and max values
            attrType: 'numeric',
            audio: {
                responsiveType: 'add',
                responsiveOptions: ['add', 'subtract'],
                gain: 0.5,
                fall: 1, // not sure what this will do yet
            },
            triggerSource: null,
            lockOn: false,
            easingValue: 0.1,
            noteHeldEasing: 0.1,
            easingMax: 0,
            easingMin: 0,
        };


        this.flipHorizintal = {
            displayLabel: 'Flip Horizontal',
            resetValue: true,
            defaultValue: true,
            currentValue: true,
            targetValue: null,
            attrType: 'boolean',
            triggerSource: null,
            lockOn: false,
        };

    }
}

PoseDetector.prototype.render = function () {

    this.easeInto();
    if (this.flipHorizintal.currentValue === true) {
        myp5.scale(-1.0, 1.0);
    }
    // myp5.image(video, - this.windowWidth / 2, -this.windowHeight / 2, this.windowWidth, this.windowHeight);


    // We can call both functions to draw all keypoints and the skeletons
    this.drawTrailers();
    this.drawKeypoints();
    // this.drawSkeleton();
    
}


// A function to draw ellipses over the detected keypoints
PoseDetector.prototype.drawKeypoints = function () {
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
}


PoseDetector.prototype.drawSkeleton = function () {
    // Loop through all the skeletons detected
    for (let i = 0; i < poses.length; i++) {

        let skeleton = poses[i].skeleton;
        // For every skeleton, loop through all body connections
        for (let j = 0; j < skeleton.length; j++) {
            let partA = skeleton[j][0];
            let partB = skeleton[j][1];
            myp5.stroke(this.hue.currentValue, this.saturation.currentValue, 100);
            myp5.strokeWeight(1);
            myp5.line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
        }
    }
}



PoseDetector.prototype.drawTrailers = function () {

    this.history = this.history.slice(0, this.trailLength.currentValue);
    let historyLength = this.history.length;

    for (let i = 0; i < historyLength; i++) {

        let percent = (historyLength - (i + 1)) / historyLength;
        let rotationAmount = myp5.map(percent, 0, 1, 0, 100)
        let pose = this.history[i];
        let tempHue = this.hue.currentValue;


        hue =  (this.colorRotate === true ) ? 
            (tempHue + rotationAmount) % 360 : 
            tempHue;

        myp5.pop();
        myp5.noFill();
        myp5.strokeWeight(3);
        myp5.stroke(hue, this.saturation.currentValue, rotationAmount);
        this.renderPose(pose);
        myp5.push();
    }
}


PoseDetector.prototype.renderPose = function (pose) {
    for (let j = 0; j < pose.keypoints.length; j++) {
        // A keypoint is an object describing a body part (like rightArm or leftShoulder)
        let keypoint = pose.keypoints[j];
        if (keypoint.score > 0.2) {
            this.renderShape(keypoint.position.x - this.windowWidth / 2, keypoint.position.y - this.windowHeight / 2, this.radius.currentValue)
        }
    }
}



/**
 * Renders a given shape along the the passed x and y positions.
 * @param xPos
 * @param yPos
 * @param radius
 */
PoseDetector.prototype.renderShape = function (xPos, yPos, radius) {

    let polygons = ['line', 'triangle', 'square', 'pentagon'];  // polygons we are allowing for set in the shape attribute

    if (this.shape.currentValue === 'ellipse') {
        myp5.ellipse(xPos, yPos, radius, radius);  // one above and one below
    } else if (polygons.includes(this.shape.currentValue)) {
        let sides;
        switch (this.shape.currentValue) {
            case 'line':
                sides = 2;
                break;
            case 'triangle':
                sides = 3;
                break;
            case 'square':
                sides = 4;
                break;
            case 'pentagon':
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
        myp5.ellipse(xPos, yPos, radius, radius);  // one above and one below
    }
};