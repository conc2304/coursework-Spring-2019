
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


        this.radius = {
            displayLabel: 'Size',
            description: 'Sets the size of all of the 3D shapes.',
            resetValue: 20,
            defaultValue: 20,
            currentValue: 20,
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
    this.drawKeypoints();
    this.drawTrailers();
}


// A function to draw ellipses over the detected keypoints
PoseDetector.prototype.drawKeypoints = function () {
    // Loop through all the poses detected
    for (let i = 0; i < poses.length; i++) {
        // For each pose detected, loop through all the keypoints
        let pose = poses[i].pose;
        this.history.unshift(pose);
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
            myp5.stroke(100, 200, 100);
            myp5.line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
        }
    }
}



PoseDetector.prototype.drawTrailers = function () {

    this.history = this.history.slice(0, this.trailLength.currentValue);

    let opacity = 100;
    let historyLength = this.history.length;
    for (let i = 0; i < historyLength; i++) {

        let pose = this.history[i];
        for (let j = 0; j < pose.keypoints.length; j++) {
            // A keypoint is an object describing a body part (like rightArm or leftShoulder)
            let keypoint = pose.keypoints[j];
            // Only draw an ellipse is the pose probability is bigger than 0.2
            if (keypoint.score > 0.2) {
                myp5.noFill();
                myp5.stroke(100, 360, 360);
                myp5.ellipse(keypoint.position.x - this.windowWidth / 2, keypoint.position.y - this.windowHeight / 2, this.radius.currentValue, this.radius.currentValue);
            }
        }

    }
}


PoseDetector.prototype.renderPose = function (pose) {

    for (let j = 0; j < pose.keypoints.length; j++) {
        // A keypoint is an object describing a body part (like rightArm or leftShoulder)
        let keypoint = pose.keypoints[j];
        // Only draw an ellipse is the pose probability is bigger than 0.2
        if (keypoint.score > 0.2) {
            myp5.fill(100, 200, 100);
            myp5.noStroke();
            myp5.ellipse(keypoint.position.x - this.windowWidth / 2, keypoint.position.y - this.windowHeight / 2, this.radius.currentValue, this.radius.currentValue);
        }
    }

}