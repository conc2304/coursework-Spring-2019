/*jshint esversion: 6 */

let v = Math.random(255);

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

  let waves = [];

  sketch.preload = () => {
    objects.lambo = myp5.loadModel('files/3d_obj/lp670.obj', true);
    objects.glock = myp5.loadModel('files/3d_obj/Glock 3d.obj', true);
  };

  sketch.setup = ()=> {
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

  sketch.windowResized =  () => {
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
      if (!wave.hasOwnProperty(prop) || !wave[prop].hasOwnProperty('targetValue')|| wave[prop].attrType !== "numeric" || !sliders[waveName].hasOwnProperty(prop)) {
        continue;
      }
      wave[prop].targetValue = sliders[waveName][prop].value();
    }
  }
};


let createSliders = (waves) => {

  let sliders = {};
  let button;
  let label;
  if (!waves.length) {
    return;
  }

  let j = 0;
  for (let wave in waves) {
    if (!waves.hasOwnProperty(wave)) {
      continue;
    }

    let i = 0;
    let offsetX;
    let offsetY;
    let sliderW = 150;
    let waveName = '';
    let step = 0;

    wave = waves[wave];
    waveName = wave.constructor.name;
    sliders[waveName] = {};
    offsetX = 10 + j * myp5.windowWidth / 3; // shift the column to the right

    // create a button to toggle the slider visibility
    button = myp5.createButton(waveName, '1');
    button.position( offsetX + (sliderW/4) + 10, 10);
    button.style('background-color', '#fff');
    button.attribute('id', waveName + '-toggle');
    button.mousePressed(() => {
      $("." + this.html() + "-input").toggleClass('hide');
    });

    for (let prop in wave) {
      if (!wave.hasOwnProperty(prop) || !wave[prop].hasOwnProperty('attrType')) {
        continue;
      }

      if (wave[prop].attrType === 'numeric') {
        offsetY =  30 + (i * 20);

        // slider to control the individual property
        sliders[waveName][prop] = myp5.createSlider(wave[prop].min, wave[prop].max, wave[prop].currentValue, step);
        sliders[waveName][prop].position(offsetX, offsetY);
        sliders[waveName][prop].style('width', sliderW + 'px');
        sliders[waveName][prop].attribute('class', waveName + '-input hide');

        if (wave[prop].max - wave[prop].min < 1) { // if the difference between min and max is 1 or less
          step = (wave[prop].max - wave[prop].min) / 100;
        }

        label = myp5.createElement('p', prop);
        label.position( offsetX + sliderW + 10, offsetY - 15);
        label.attribute('class', waveName + '-input hide');
        label.style('color', '#fff');
        i++;
      }
    }

    // loop through again and create radio for all variable attribute types
    for (let prop in wave) {
      if (!wave.hasOwnProperty(prop)) {
        continue;
      }

      offsetY =  30 + (i * 20);

      if (wave[prop].attrType === "variable" && wave[prop].options.length) {
        sliders[waveName][prop] = myp5.createRadio();

        for (let o in wave[prop].options) {
          console.log(wave[prop].options[o]);
          if (!wave[prop].options.hasOwnProperty(o)) {
            continue;
          }
          sliders[waveName][prop].option(wave[prop].options[o], wave[prop].options[o]);
          sliders[waveName][prop].position(offsetX, offsetY);
          sliders[waveName][prop].attribute('class', waveName + '-input hide');

          label = myp5.createElement('p', prop);
          label.position( offsetX + sliderW + 10, offsetY - 15);
          label.attribute('class', waveName + '-input hide');
          label.style('color', '#fff');
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

