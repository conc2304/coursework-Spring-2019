/**
 *
 * todo add comments to functions and files
 * todo create a lock feature for each control property
 * todo mute certain elements
 * todo make audio reactive option additive, subtractive, e
 */



let audio;

let s = (sketch) => {
  'use strict';

  let centerWave;
  let outerWaves;
  let threeDWave;
  let domCtrl = {};
  let fft;



  //todo add a preload animation maybe?
  // keep all 'custom' code here

  sketch.preload = () => {
    sketch.objects = {};
    sketch.objects.lambo = myp5.loadModel('files/3d_obj/lp670.obj', true);
    sketch.objects.glock = myp5.loadModel('files/3d_obj/Glock 3d.obj', true);
    // audio = myp5.loadSound('/~jconchel/clyzby/p5js/files/audio/CharlestheFirst - Chynna - The Conversation.wav');
    audio = myp5.loadSound('/~jconchel/clyzby/p5js/files/audio/PUFF - TSURUDA x HUXLEY ANNE.mp3');
    // audio = myp5.loadSound('/~jconchel/clyzby/p5js/files/audio/Pushloop - Deep, Dark & Dangerous Mix 015.mp3');
    audio.pause();
    fft = new p5.FFT();

    // this is where each different "sketch" should change - this should be the only customizing
    // all future controllable objects should integrate via this
    // todo pass in these as arguments from another file?
    centerWave = new CenterWave(sketch.windowWidth, sketch.windowHeight);
    outerWaves = new OuterWaves(sketch.windowWidth, sketch.windowHeight);
    threeDWave = new ThreeDWave(sketch.windowWidth, sketch.windowHeight);

    sketch.ctrlElementsArray = [];
    sketch.ctrlElementsArray.push(centerWave, outerWaves, threeDWave);
  };


  sketch.setup = () => {

    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight, sketch.WEBGL);
    sketch.polygon = renderPolygon;

    // make a method to retrieve the elements externally by the myp5 namespace
    for (let ctrlElement in sketch.ctrlElementsArray) {
      if (!sketch.ctrlElementsArray.hasOwnProperty(ctrlElement)) {
        continue;
      }
      let ctrlObjectName = sketch.ctrlElementsArray[ctrlElement].constructor.name;
      sketch[`get${ctrlObjectName}`] = () => sketch.ctrlElementsArray[ctrlElement];
    }

    // add all of the elements to a global variable to 'register' them
    domCtrl = createDOMControls(sketch.ctrlElementsArray);

    // when everything is loaded open the control bar
    $("#settings-open").click();
  };


  sketch.windowResized = () => {

    // todo this is taxing on the browser find out how to optimize
    for (let ctrlElement in sketch.ctrlElementsArray) {
      if (!sketch.ctrlElementsArray.hasOwnProperty(ctrlElement)) {
        continue;
      }

      sketch.ctrlElementsArray[ctrlElement].width = sketch.windowWidth;
      sketch.ctrlElementsArray[ctrlElement].waveWidth = sketch.windowWidth + 200;
      sketch.ctrlElementsArray[ctrlElement].height = sketch.windowHeight;
    }
    sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
  };


  let fftAnalysis = {};
  let tempObj;
  sketch.draw = () => {
    sketch.background(0);

    fftAnalysis = get10BandEnergy(fft);
    applyAudioEnergyValues(fftAnalysis);


    for (let ctrlElement in sketch.ctrlElementsArray) {
      if (!sketch.ctrlElementsArray.hasOwnProperty(ctrlElement)) {
        continue;
      }
      tempObj =  sketch.ctrlElementsArray[ctrlElement];
      tempObj.easeInto();
      tempObj.yPoints = new Array(Math.floor(tempObj.waveWidth / tempObj.xSpacing.currentValue));
      tempObj.calcWave(0);
      tempObj.render();
    }
  };

  sketch.keyPressed = () => {
    playPianoKey(sketch.keyCode, true);
  };
  sketch.keyReleased = () => {
    playPianoKey(sketch.keyCode, false);
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




