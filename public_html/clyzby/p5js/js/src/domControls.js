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
  let sliderW = 300;
  let step = 0;
  let domCtrl;
  let label, button, inputWrapper, displayVal, wrapperID, waveName;
  let pianoWrapper, pianoInput;


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

        inputWrapper = myp5.createElement('div');
        inputWrapper.attribute('class', `${waveName}-input hide range-slider`);
        inputWrapper.parent(wrapperID);

        label = myp5.createElement('p', wave[prop].displayLabel);
        label.style('position', 'relative');
        label.parent(inputWrapper);

        // slider to control the individual property
        controls[waveName][prop] = myp5.createSlider(wave[prop].min, wave[prop].max, wave[prop].currentValue, step);
        controls[waveName][prop].style('width', sliderW + 'px');
        controls[waveName][prop].attribute('class', `${waveName}-input hide range-slider__range`);
        controls[waveName][prop].attribute('oninput', 'updateRange(this)');
        controls[waveName][prop].parent(inputWrapper);

        displayVal = myp5.createElement('span', wave[prop].currentValue.toString());
        displayVal.attribute('class', `range-slider__value`);
        displayVal.parent(inputWrapper);


        // wrapper to toggle piano mode
        pianoWrapper = myp5.createElement('div');
        pianoWrapper.attribute('class', `${waveName}-input hide piano-mode`);
        pianoWrapper.parent(inputWrapper);


        // input to set which keyboard key plays that element
        pianoInput = myp5.createInput();
        // console.log(pianoInput);
        pianoInput.attribute('data-wave', waveName);
        pianoInput.attribute('data-prop', prop);
        pianoInput.elt.placeholder = "Control Key";
        pianoInput.elt.onkeypress = setKeyboardControl;
        pianoInput.elt.maxLength = 1;


        // input to set what the value will be for that element on that key press
        pianoInput.parent(pianoWrapper);
        pianoInput = myp5.createInput(wave[prop].currentValue.toString(), 'number');
        pianoInput.value(wave[prop].currentValue);
        pianoInput.elt.max = wave[prop].max;
        pianoInput.parent(pianoWrapper);

        if (wave[prop].max - wave[prop].min < 10) {
          // if the difference between min and max is 1 or less
          step = (wave[prop].max - wave[prop].min) / 100;
        }
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

      }
    }
  }

  return controls;
};


// TODO  - create a keyboard to controller map
// when the user enters a key, lets
let setKeyboardControl = function(e) {
  "use strict";
  console.log(e);
  console.log(this);
  let wave = $(this).attr('data-wave');
  let prop = $(this).attr('data-prop');
  console.log(`${wave} - ${prop}`);

  let waveN = myp5[`get${wave}()`];
  console.log(waveN);
  
  // console.log(myp5.getCenterWave());
}

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
      if (!wave.hasOwnProperty(prop)) {
        continue;
      }
      if (!wave[prop].hasOwnProperty('targetValue') || !controls[waveName].hasOwnProperty(prop)) {
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

/**
 * Bind the range slider to the display value
 * Called oninput via the html bc the dom elements aren't created until after the dom is ready
 * @param range
 */
let updateRange = function(range) {
  "use strict";
  let value = $(range).val();
  $(range).parents('.range-slider').children('.range-slider__value').html(Number(value).toFixed(2));
};



// todo  fix this - click not being caputred by svg
$('#piano-mode, #piano-mode path').click(function(){
  "use strict";

  console.log('click');

  $('.piano-mode').toggleClass('hide');
  $('#piano-mode').toggleClass('enabled');

});

