
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
    }
}

PoseDetector.prototype.render = function () {
    myp5.scale(-1.0, 1.0);
    myp5.image(video, - this.windowWidth / 2, -this.windowHeight / 2, this.windowWidth, this.windowHeight);

    // We can call both functions to draw all keypoints and the skeletons
    this.drawKeypoints();
    // this.drawSkeleton();
}


// A function to draw ellipses over the detected keypoints
PoseDetector.prototype.drawKeypoints = function () {
    // Loop through all the poses detected
    for (let i = 0; i < poses.length; i++) {
        // For each pose detected, loop through all the keypoints
        let pose = poses[i].pose;
        for (let j = 0; j < pose.keypoints.length; j++) {
            // A keypoint is an object describing a body part (like rightArm or leftShoulder)
            let keypoint = pose.keypoints[j];
            // Only draw an ellipse is the pose probability is bigger than 0.2
            if (keypoint.score > 0.2) {
                myp5.fill(100, 200, 100);
                myp5.noStroke();
                myp5.ellipse(keypoint.position.x - this.windowWidth / 2, keypoint.position.y - this.windowHeight / 2, 50, 50);
            }
        }
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