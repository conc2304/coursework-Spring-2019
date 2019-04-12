/*jshint esversion: 6 */


let objects = {
  glock: null,
  lambo: null,
};

let s = (sketch) => {
  'use strict';

  let centerWave;
  let outerWaves;
  let threeDWave;
  let domCtrl = {};

  sketch.preload = () => {
    objects.lambo = myp5.loadModel('files/3d_obj/lp670.obj', true);
    objects.glock = myp5.loadModel('files/3d_obj/Glock 3d.obj', true);
  };

  sketch.setup = () => {
    sketch.getCenterWave = () => centerWave;
    sketch.getOuterWaves = () => outerWaves;
    sketch.getThreeDWave = () => threeDWave;

    sketch.polygon = renderPolygon;

    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight, sketch.WEBGL);
    centerWave = new CenterWave(sketch.windowWidth, sketch.windowHeight);
    outerWaves = new OuterWaves(sketch.windowWidth, sketch.windowHeight);
    threeDWave = new ThreeDWave(sketch.windowWidth, sketch.windowHeight);

    domCtrl = createDOMControls([centerWave, outerWaves, threeDWave]);
  };

  sketch.windowResized = () => {
    sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
    centerWave.width = sketch.windowWidth;
    centerWave.waveWidth = sketch.windowWidth + 200;
    centerWave.height = sketch.windowHeight;

    outerWaves.width = sketch.windowWidth;
    outerWaves.waveWidth = sketch.windowWidth + 200;
    outerWaves.height = sketch.windowHeight;

    threeDWave.width = sketch.windowWidth;
    threeDWave.waveWidth = sketch.windowWidth + 200;
    threeDWave.height = sketch.windowHeight;
  };

  sketch.draw = () => {

    setDOMControlValues(domCtrl, [centerWave, outerWaves, threeDWave]);

    sketch.background(0);
    centerWave.easeInto();
    centerWave.yPoints = new Array(Math.floor(centerWave.waveWidth / centerWave.xSpacing.currentValue));
    centerWave.calcWave(0);
    centerWave.render();

    outerWaves.easeInto();
    outerWaves.yPoints = new Array(Math.floor(outerWaves.waveWidth / outerWaves.xSpacing.currentValue));
    outerWaves.calcWave(0);
    outerWaves.render();

    threeDWave.easeInto();
    threeDWave.yPoints = new Array(Math.floor(threeDWave.waveWidth / threeDWave.xSpacing.currentValue));
    threeDWave.calcWave();
    threeDWave.render(sketch.frameCount);
  };
};


let renderPolygon = function (x, y, radius, numPoints) {
  'use strict';
  let angle = myp5.TWO_PI / numPoints;
  myp5.beginShape();
  for (let a = 0; a < myp5.TWO_PI; a += angle) {
    let sx = x + myp5.cos(a) * radius;
    let sy = y + myp5.sin(a) * radius;
    myp5.vertex(sx, sy);
  }
  myp5.endShape(myp5.CLOSE);
};


let myp5 = new p5(s, 'sketch-container');




