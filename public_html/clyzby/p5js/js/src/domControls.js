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

// TODO  -  this function is way to damn long
let createDOMControls = (waves) => {
  "use strict";

  if (!waves.length) {
    return {};
  }

  // loop through each of the waves objects and create settings controllers based on
  // the property's attribute type
  let controls = {};

  for (let wave in waves) {
    if (!waves.hasOwnProperty(wave)) {
      continue;
    }

    wave = waves[wave];
    let waveName = wave.constructor.name;
    let wrapperID = waveName + '-settings';
    controls[waveName] = {};


    // create a div for each of the different waves
    let domCtrl = myp5.createDiv();
    domCtrl.attribute('id', wrapperID);
    domCtrl.attribute('class', 'wave-settings');
    domCtrl.parent('wave-control-panel');


    // create a button to toggle the settings sliders visibility
    let button = myp5.createButton(waveName, '1');
    button.style('position', 'relative');
    button.attribute('id', waveName + '-toggle');
    button.attribute('class', 'settings-toggle-button');
    button.mousePressed(function () {  // todo  figure out how to pass a 'lexical this' with es6 arrow functions
      $('#' + this.html() + "-wrapper").toggleClass('hide');
    });

    button.parent(wrapperID);

    let waveSettingWrapper = myp5.createElement('div');
    waveSettingWrapper.attribute('id', `${waveName}-wrapper`);
    waveSettingWrapper.attribute('class', `hide settings-wrapper`);
    waveSettingWrapper.parent(wrapperID);


    for (let prop in wave) {
      if (!wave.hasOwnProperty(prop)) {
        continue;
      }

      if (wave[prop].attrType === 'numeric') {

        // wrapper to hold individual range sliders
        let inputWrapper = myp5.createElement('div');
        inputWrapper.attribute('class', `range-slider-wrapper`);
        inputWrapper.parent(waveSettingWrapper);


        let title = myp5.createElement('p', wave[prop].displayLabel);
        title.style('position', 'relative');
        title.parent(inputWrapper);

        // wrapper to toggle piano mode
        let pianoWrapper = myp5.createElement('div');
        pianoWrapper.attribute('class', `piano-mode`);
        pianoWrapper.parent(inputWrapper);


        // input to set which keyboard key plays that element
        let pianoInput = myp5.createInput();
        pianoInput.attribute('data-wave', waveName);
        pianoInput.attribute('data-prop', prop);
        pianoInput.attribute('data-type', 'key-set');
        pianoInput.elt.placeholder = "Control Key";
        pianoInput.elt.onchange = setKeyboardControl;
        pianoInput.elt.maxLength = 1;
        pianoInput.parent(pianoWrapper);


        // input to set what the value will be for that element on that key press
        pianoInput = myp5.createInput(wave[prop].currentValue.toString(), 'number');
        pianoInput.value(wave[prop].currentValue * 2);  // default it 2x so that they have something to play with
        pianoInput.elt.max = wave[prop].max;  // not sure if i want to set a max or min
        pianoInput.elt.min = wave[prop].min;  // not sure if i want to set a max or min
        pianoInput.attribute('data-type', 'value-set');
        pianoInput.attribute('data-wave', waveName);
        pianoInput.attribute('data-prop', prop);

        pianoInput.elt.onchange = setKeyboardControl;
        pianoInput.elt.step = Number((wave[prop].max - wave[prop].min) / 200).toFixed(3);
        pianoInput.parent(pianoWrapper);

        let step = 0;
        if (wave[prop].max - wave[prop].min < 10) {
          // if the difference between min and max is 10 or less
          step = (wave[prop].max - wave[prop].min) / 100;
        }

        // slider to control the individual property
        controls[waveName][prop] = myp5.createSlider(wave[prop].min, wave[prop].max, wave[prop].currentValue, step);
        controls[waveName][prop].attribute('class', `range-slider ${waveName}-${prop}`);
        controls[waveName][prop].attribute('oninput', 'updateRangeDisplay(this)');
        controls[waveName][prop].parent(inputWrapper);

        let displayValue = myp5.createElement('span', wave[prop].currentValue.toString());
        displayValue.attribute('class', `range-slider-value`);
        displayValue.parent(inputWrapper);

      }
    }

    // loop through again (so that the radios come last in the group)
    // and create radio for all variable attribute types
    for (let prop in wave) {
      if (!wave.hasOwnProperty(prop)) {
        continue;
      }

      if (wave[prop].attrType === "variable" && wave[prop].options.length) {

        let inputWrapper = myp5.createElement('div');
        inputWrapper.attribute('class', `radio-option-wrap ${waveName}-${prop}`);
        inputWrapper.parent(waveSettingWrapper);

        let label = myp5.createElement('p', wave[prop].displayLabel);
        label.style('position', 'relative');
        label.parent(inputWrapper);

        controls[waveName][prop] = myp5.createRadio();

        for (let o in wave[prop].options) {
          if (!wave[prop].options.hasOwnProperty(o)) {
            continue;
          }

          controls[waveName][prop].option(ucFirst(wave[prop].options[o]), wave[prop].options[o]);
          controls[waveName][prop].attribute('class', `radio-input`);
          controls[waveName][prop].parent(inputWrapper);
        }
        controls[waveName][prop].selected(wave[prop].currentValue);

      }
    }
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
let updateRangeDisplay = function (range) {
  "use strict";
  let value = $(range).val();
  $(range).parents('.range-slider-wrapper').children('.range-slider-value').html(Number(value).toFixed(2));
};

let editingPiano = true;  // Don't play 'piano' keys while in editing mode;
$(function () {
  "use strict";
  $('#piano-mode').click(function () {
    $('.piano-mode').toggleClass('hide');
    $('#piano-mode').toggleClass('editing');
    editingPiano = !editingPiano;
  });
});


let ucFirst = (string) => {
  "use strict";
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// when the user enters a key, lets
let keyboardCtrl = {};
let wavePropToKeyMap = {};
let setKeyboardControl = function (e) {
  "use strict";
  // console.log(e);
  // console.log($(this));

  let inputValue = e.target.value;
  let type = e.target.dataset.type;
  let waveName = e.target.dataset.wave;
  let property = e.target.dataset.prop;
  let charCode;
  let propValue;

  if (type === 'key-set') {
    propValue = e.target.nextSibling.value;
    // apparently p5 can only understand keys as uppercase on key press ...
    charCode = inputValue.toUpperCase().charCodeAt(0);
  }
  if (type === 'value-set') {
    propValue = e.target.value;
    // apparently p5 can only understand keys as uppercase on key press ...
    charCode = e.target.previousSibling.value.toUpperCase().charCodeAt(0);
  }

  if (!Number.isNaN(charCode) && waveName && property && propValue) {

    console.log('setting value');
    console.log([inputValue, charCode, waveName, property, propValue]);
    // only update the keyboard control if we have a key to control it with
    keyboardCtrl[charCode] = keyboardCtrl[charCode] || {};
    keyboardCtrl[charCode][waveName] = keyboardCtrl[charCode][waveName] || {};
    keyboardCtrl[charCode][waveName][property] = Number(propValue);

    wavePropToKeyMap[waveName] = wavePropToKeyMap[waveName] || {};
    wavePropToKeyMap[waveName][property] = charCode;
  } else {

    console.log('cleaning ');
    if (wavePropToKeyMap[waveName] && wavePropToKeyMap[waveName][property]) {

      let keyToClean = wavePropToKeyMap[waveName][property];
      console.log(keyToClean);

      delete keyboardCtrl[keyToClean][waveName][property];
      if (Object.size(keyboardCtrl[keyToClean][waveName]) === 0) {
        delete keyboardCtrl[keyToClean][waveName];
      }

      if (Object.size(keyboardCtrl[keyToClean]) === 0) {
        delete keyboardCtrl[keyToClean];
      }
    }

    delete wavePropToKeyMap[waveName][property];

    if (Object.size(wavePropToKeyMap[waveName]) === 0) {
      delete wavePropToKeyMap[waveName];
    }
  }

  console.log(keyboardCtrl);
  console.log(wavePropToKeyMap);
};


Object.size = (obj) => {
  "use strict";

  let size = 0, key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      size++;
    }
  }
  return size;
};

/**
 *   For each of the properties associated with that key
 *   set the targetValue to the value associated to that key press
 *   on release set it back to the reset value
 * @param key
 * @param pressed
 */

// TODO - we need to update the domControls too
let playPianoKey = (key, pressed) => {
  "use strict";

  if (editingPiano) {
    return null;
  }

  let waveHandlers = keyboardCtrl[key];
  let waveCtrl;
  console.log(waveHandlers);


  for (let waveName in waveHandlers) {
    if (!waveHandlers.hasOwnProperty(waveName)) {
      continue;
    }

    waveCtrl = getCtrlElement(waveName);
    for (let waveProp in waveHandlers[waveName]) {
      if (!waveHandlers[waveName].hasOwnProperty(waveProp)) {
        continue;
      }

      let waveClass = `.range-slider.${waveName}-${waveProp}`;
      console.log(waveClass);
      console.log($(waveClass));
      console.log(`set ${waveProp} to ${waveHandlers[waveName][waveProp]}`);

      let pianoValue;
      if (pressed) {
        pianoValue = waveHandlers[waveName][waveProp];
      } else {
        pianoValue = waveCtrl[waveProp].resetValue;
      }

      $(waveClass).val(pianoValue);
      updateRangeDisplay($(waveClass));
    }
  }
};

