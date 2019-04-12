/*jshint esversion: 6 */

/**
 *  - Assignment 3 - DOM, DOM, DOM -
 *
 *  create an element BESIDES a canvas element
 *  use value() to either retrieve the value of an element for use in your P5 sketch or to assign a new value to an element in the DOM
 *  style() a DOM element with CSS from within P5
 *  make use of parent() or child() to reorganize elements on the page
 */


/**
 * Iterate through all of the values that we want
 * to give the use control over and based on the
 * attribute type make a slider or a radio to control that property
 * @param waves
 * @returns {{}}
 */
let createDOMControls = (waves) => {
  "use strict";

  if (!waves.length) {
    return;
  }

  let controls = {};
  let button;
  let label;
  let j = 0;
  let i = 0;
  let sliderW = 300;
  let waveName;
  let wrapperID;
  let step = 0;
  let domCtrl;
  let inputWrapper;

  // loop through each of the waves objects and create settings controllers based on
  // the property's attribute type
  for (let wave in waves) {
    if (!waves.hasOwnProperty(wave)) {
      continue;
    }

    wave = waves[wave];
    waveName = wave.constructor.name;
    controls[waveName] = {};
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
    button.mousePressed(function () {  // todo  figure out how to pass a 'lexical this' with es6 arrow functions
      $("." + this.html() + "-input").toggleClass('hide');
    });

    button.parent(wrapperID);


    for (let prop in wave) {
      if (!wave.hasOwnProperty(prop)) {
        continue;
      }

      if (wave[prop].attrType === 'numeric') {
        label = myp5.createElement('p', wave[prop].displayLabel);
        label.attribute('class', `${waveName}-input hide`);
        label.style('position', 'relative');
        label.parent(wrapperID);

        // slider to control the individual property
        controls[waveName][prop] = myp5.createSlider(wave[prop].min, wave[prop].max, wave[prop].currentValue, step);
        controls[waveName][prop].style('width', sliderW + 'px');
        controls[waveName][prop].attribute('class', `${waveName}-input hide`);
        controls[waveName][prop].parent(wrapperID);

        if (wave[prop].max - wave[prop].min < 10) {
          // if the difference between min and max is 1 or less
          step = (wave[prop].max - wave[prop].min) / 100;
        }
        i++;
      }
    }

    // loop through again (so that the radios come last in the group)
    // and create radio for all variable attribute types
    for (let prop in wave) {
      if (!wave.hasOwnProperty(prop)) {
        continue;
      }

      if (wave[prop].attrType === "variable" && wave[prop].options.length) {
        label = myp5.createElement('p', wave[prop].displayLabel);
        label.attribute('class', `${waveName}-input hide`);
        label.style('position', 'relative');
        label.parent(wrapperID);

        controls[waveName][prop] = myp5.createRadio();

        for (let o in wave[prop].options) {
          if (!wave[prop].options.hasOwnProperty(o)) {
            continue;
          }

          controls[waveName][prop].option(wave[prop].options[o]);
          controls[waveName][prop].style('width', sliderW + 'px');
          controls[waveName][prop].attribute('class', `${waveName}-input hide`);
          controls[waveName][prop].attribute('id', `${waveName}-${wave[prop].options[o]}`);
          controls[waveName][prop].parent(wrapperID);
        }
        controls[waveName][prop].selected(wave[prop].currentValue);


        i++;
      }
    }
    j++;
  }

  return controls;
};

/**
 * On draw loop, check the value of all of our controls
 * and apply those values to our config objects
 * @param controls
 * @param waves
 */
let setDOMControlValues = (controls, waves) => {
  "use strict";
  let waveName;

  for (let wave in waves) {
    if (!waves.hasOwnProperty(wave)) {
      continue;
    }

    wave = waves[wave];
    waveName = wave.constructor.name;

    for (let prop in wave) {
      if (!wave.hasOwnProperty(prop) || !wave[prop].hasOwnProperty('targetValue') || !controls[waveName].hasOwnProperty(prop)) {
        continue;
      }
      if (wave[prop].attrType === "numeric") {
        wave[prop].targetValue = controls[waveName][prop].value();
      } else if (wave[prop].attrType === "variable") {
        wave[prop].currentValue = controls[waveName][prop].selected();
      }
    }
  }
};
