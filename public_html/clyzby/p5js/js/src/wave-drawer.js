/*jshint esversion: 6 */


let objects = {
  glock: null,
  lambo: null,
};

let s = function (sketch) {
  'use strict';
  let centerWave;
  let outerWaves;
  let threeDWave;
  let sliders = {};
  let domCtrl;

  sketch.preload = function () {
    objects.lambo = myp5.loadModel('files/3d_obj/lp670.obj', true);
    objects.glock = myp5.loadModel('files/3d_obj/Glock 3d.obj', true);
  };

  sketch.setup = function () {
    console.log('stuff');
    this.getCenterWave = () => centerWave;
    this.getOuterWaves = () => outerWaves;
    this.getThreeDWave = () => threeDWave;

    this.polygon = renderPolygon;

    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight, sketch.WEBGL);
    centerWave = new CenterWave(sketch.windowWidth, sketch.windowHeight);
    outerWaves = new OuterWaves(sketch.windowWidth, sketch.windowHeight);
    threeDWave = new ThreeDWave(sketch.windowWidth, sketch.windowHeight);

    sliders = createSliders([centerWave, outerWaves, threeDWave]);
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

    setSliderValues(sliders, [centerWave, outerWaves, threeDWave]);

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

let setSliderValues = (sliders, waves) => {
  "use strict";
  let waveName;

  for (let wave in waves) {
    if (!waves.hasOwnProperty(wave)) {
      continue;
    }

    wave = waves[wave];
    waveName = wave.constructor.name;

    for (let prop in wave) {
      if (!wave.hasOwnProperty(prop) || !wave[prop].hasOwnProperty('targetValue') || !sliders[waveName].hasOwnProperty(prop)) {
        continue;
      }
      wave[prop].targetValue = sliders[waveName][prop].value();
    }
  }
};


let createSliders = function (waves) {

  if (!waves.length) {
    return;
  }

  let sliders = {};
  let button;
  let label;
  let j = 0;
  let i = 0;
  let sliderW = 150;
  let waveName;
  let wrapperID;
  let step = 0;

  // loop through each of the waves objects and create settings controllers based on
  // the property's attribute type
  for (let wave in waves) {
    if (!waves.hasOwnProperty(wave)) {
      continue;
    }

    wave = waves[wave];
    waveName = wave.constructor.name;
    sliders[waveName] = {};
    wrapperID = waveName + '-settings';

    // create a div for each of the different waves
    domCtrl = myp5.createDiv();
    domCtrl.attribute('id', wrapperID);
    domCtrl.attribute('class', 'wave-settings');
    domCtrl.parent('settings-inner-wrap');

    // create a button to toggle the settings sliders visibility
    button = myp5.createButton(waveName, '1');
    button.style('position', 'relative');
    button.attribute('id', waveName + '-toggle');
    button.mousePressed(function () {
      $("." + this.html() + "-input").toggleClass('hide');
    });

    button.parent(wrapperID);
    for (let prop in wave) {
      if (!wave.hasOwnProperty(prop) || !wave[prop].hasOwnProperty('attrType')) {
        continue;
      }

      if (wave[prop].attrType === 'numeric') {
        label = myp5.createElement('p', prop);
        label.attribute('class', waveName + '-input hide');
        label.style('position', 'relative');
        label.parent(wrapperID);

        // slider to control the individual property
        sliders[waveName][prop] = myp5.createSlider(wave[prop].min, wave[prop].max, wave[prop].currentValue, step);
        sliders[waveName][prop].style('width', sliderW + 'px');
        sliders[waveName][prop].attribute('class', waveName + '-input hide');
        sliders[waveName][prop].parent(wrapperID);

        if (wave[prop].max - wave[prop].min < 10) {
          // if the difference between min and max is 1 or less
          step = (wave[prop].max - wave[prop].min) / 100;
        }
        i++;
      }
    }

    // loop through again (so that re radios come last in the group)
    // and create radio for all variable attribute types
    for (let prop in wave) {
      if (!wave.hasOwnProperty(prop)) {
        continue;
      }

      if (wave[prop].attrType === "variable" && wave[prop].options.length) {
        label = myp5.createElement('p', prop);
        label.attribute('class', waveName + '-input hide');
        label.style('position', 'relative');
        label.parent(wrapperID);

        sliders[waveName][prop] = myp5.createRadio();

        for (let o in wave[prop].options) {
          if (!wave[prop].options.hasOwnProperty(o)) {
            continue;
          }

          sliders[waveName][prop].option(wave[prop].options[o], wave[prop].options[o]);
          sliders[waveName][prop].style('width', sliderW + 'px');
          sliders[waveName][prop].attribute('class', waveName + '-input hide');
          sliders[waveName][prop].parent(wrapperID);
        }
        i++;
      }
    }
    j++;
  }

  return sliders;
};

let renderPolygon = function (x, y, radius, numPoints) {
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

