/**
 *
 *    --  HERE ARE MY AMBITIONS - BEHOLD THEIR MULTITUDE!  --
 * todo - audio controls to be more like a remote - pause, play, stop, rewind, ff, volume
 *        - todo this would be better if we can queue music
 * todo - make a playlist, queue music, if possible get music from Spotify (can it be processed through fft though?)
 * todo - make a toggle to spin/rotate the inner and outer waves like the 3D ones
 * todo - make patterns by saving current config and make them triggerable (ie a pattern bank)
 * todo - put controls into an iFrame
 * todo - convert this entire thing into an angular web app #Angular8!
 * todo - loading animation
 *
 */




let audio;

let s = (sketch) => {
  'use strict';

  let centerWave;
  let outerWaves;
  let threeDWave;
  let domCtrl = {};
  // let fft, amplitude, peakDetect;



  // keep all 'custom' code here

  sketch.preload = (loadsong) => {
    console.log('preload');
    sketch.objects = {};
    sketch.objects.lambo = myp5.loadModel('files/3d_obj/lp670.obj', true);
    sketch.objects.glock = myp5.loadModel('files/3d_obj/Glock 3d.obj', true);
    // todo find a way to display the name of the audio file  // hard code the original maybe? parse it out from the end of the file name?
    // audio = myp5.loadSound('/clyzby/p5js/files/audio/CharlestheFirst - Chynna - The Conversation.wav');
    // audio = myp5.loadSound('/clyzby/p5js/files/audio/PUFF - TSURUDA x HUXLEY ANNE.mp3');
    // audio = myp5.loadSound('/clyzby/p5js/files/audio/Pushloop - Deep, Dark & Dangerous Mix 015.mp3');
    // audio = myp5.loadSound(loadsong, success, error, progress);
    // audio.pause();
    // fft = new p5.FFT();
    // amplitude = new p5.Amplitude();
    // peakDetect = new p5.PeakDetect(20,100);
    // fft.setInput(audio);

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

    console.log('test');


    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight, sketch.WEBGL);
    sketch.polygon = renderPolygon;
    sketch.colorMode(sketch.HSB);

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

    let seconds = Math.floor(audio.currentTime() % 60);
    let minutes = Math.floor(audio.currentTime() / 60);
    if (audio.isLoaded() && !audio.isPaused()) {

      let time = ('0' + minutes).substr(-2) + ':' + ('0' + seconds).substr(-2);
      songTime.html(time);
      let downloadProgress = 100 * (audio.currentTime() / audio.duration())
      progressBar.val(downloadProgress);
    }

    fftAnalysis = getEQEnergy(fft);
    applyAudioEnergyValues(fftAnalysis);

    playKeyboardKeys();
    sketch.keyReleased = () => {
      playPianoKey(sketch.keyCode, false);
    };

    for (let ctrlElement in sketch.ctrlElementsArray) {
      if (!sketch.ctrlElementsArray.hasOwnProperty(ctrlElement)) {
        continue;
      }
      tempObj =  sketch.ctrlElementsArray[ctrlElement];
      // don't render an object if we have made it not visible it
      if (tempObj.bypass === true) {
        continue;
      }

      tempObj.render();
    }
  };


};



// todo - this probably needs to be moved to a new file
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




