

// Grading Rubric (out of 20 points)
//
// Comment your code well = 1 points
// Link to the image = 1 point
// Cite original work = 1 point

let cnv = {
  w: 1024,
  h: 768,
};

let chaosMode = 'interactive';
const CHAOS_TYPES = ['auto', 'interactive'];
const FPB = 26;  // frames per beat

/**
 * Create p5 sketch in instance mode
 * @param sketch
 */
let myp5 = function (sketch) {

  let numRectangles = 7;
  let numBoxes = 11;
  let allRectangles = {};
  let allBoxes = {};

  let rectRanges = {
    x: {
      min : -cnv.w * .5,
      max : cnv.w * .5,
    },
    y: {
      min : -cnv.h/1.5,
      max : cnv.h/1.5,
    },
    z: {
      min: -600,
      max: 600,
    },
  };

  let rectOffsets = {
    shade: Math.floor(255 / numRectangles - 1), // max divided evenly between the number of shapes
    position: {
      x: getDistribution(rectRanges.x, numRectangles),
      y: getDistribution(rectRanges.y, numRectangles),
      z: getDistribution(rectRanges.z, numRectangles)
    },
    size: 12,
  };

  let boxRanges = {
    y: {
      min: -1100,
      max: 500,
    },
  };

  let boxOffsets = {
    position: {
      y: getDistribution(boxRanges.y, numRectangles)
    },
  };


  sketch.setup = function () {
    sketch.frameRate(60);
    sketch.createCanvas(cnv.w, cnv.h, sketch.WEBGL);
    sketch.rectMode(sketch.CENTER);
    sketch.textureMode(sketch.NORMAL);  // needed for vertexes in WEBGL
  };

  sketch.preload = function () {
    allRectangles = createRectangles(numRectangles, rectOffsets, rectRanges);
    allBoxes = createBoxes(numBoxes, boxOffsets, boxRanges);
  }; // end preload()

  sketch.draw = function () {

    sketch.background(20);
    s.orbitControl(10, 10);

    arrowControls();
    drawParametric(parametric1);
    for (let i = 0; i < numBoxes; i++) {
      drawBoxes(allBoxes[i])
    }

    for (let i = 0; i < numRectangles; i++) {
      drawRect(allRectangles[i]);
    }
  };

};

let s = new p5(myp5, window.document.getElementById('p5-container'));
