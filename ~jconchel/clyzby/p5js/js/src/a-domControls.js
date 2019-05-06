

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


  // create audio control config buttons
  // reference - https://tympanus.net/Development/AudioVisualizers/

  createAudioCtrls();

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
      $('#' + this.html() + "-wrapper").toggleClass('hide'); // p5 makes it so incredibly dubm to get any sort of information
      $(`#${this.html()}-toggle`).toggleClass('open');

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
        createSliderCtrlr(wave, prop, waveSettingWrapper, controls);
      }

    }

    // loop through again (so that the radios come last in the group)
    // and create radio for all variable attribute types
    for (let prop in wave) {
      if (!wave.hasOwnProperty(prop)) {
        continue;
      }
      if (wave[prop].attrType === 'variable') {
        createRadioToggle(wave, prop, controls, waveSettingWrapper);
      }
    }
  }

  return controls;
};



/**
 *
 * @param wave
 * @param prop
 * @param parentWrapper
 * @param controls
 */
let createSliderCtrlr = (wave, prop, parentWrapper, controls) => {
  "use strict";

  if (wave[prop].attrType === 'numeric') {

    let waveName = wave.constructor.name;

    // wrapper to hold individual range sliders
    let inputWrapper = myp5.createElement('div');
    inputWrapper.attribute('class', `range-slider-wrapper`);
    inputWrapper.parent(parentWrapper);


    let title = myp5.createElement('p', wave[prop].displayLabel);
    title.style('position', 'relative');
    title.parent(inputWrapper);

    createPianoDomInput(wave, prop, inputWrapper, controls);
    createDomSlider(wave, prop, inputWrapper, controls);
    createFrequencySelector(wave, prop, inputWrapper);
  }
};



/**
 *
 */
let createAudioCtrls = () => {
  "use strict";
  let audioWrapperID = "audio-control-panel";

  let uploadButton = myp5.createFileInput(uploaded);
  uploadButton.parent(audioWrapperID);
  uploadButton.addClass("upload-button");
  uploadButton.attribute('id', 'upload-file');
  uploadButton.attribute('name', 'upload-file');

  let label = myp5.createElement('label');
  label.html('Upload audio');
  label.attribute('for', 'upload-file');
  label.addClass("audio-button");
  label.parent(audioWrapperID);

  let playButton = myp5.createButton("Play / Pause");
  playButton.parent(audioWrapperID);
  playButton.addClass("audio-button");
  playButton.mousePressed(toggleAudio);
};



let createFrequencySelector = (wave, prop, inputWrapper) => {
  "use strict";

  let waveName = wave.constructor.name;
  let selectWrap = myp5.createElement('div');
  selectWrap.addClass('custom-select-wrapper');

  let rangeList = myp5.createElement("select");
  rangeList.attribute('data-wave', waveName);
  rangeList.attribute('data-prop', prop);

  let option = myp5.createElement('option');
  option.html(`Frequency Ranges`);
  option.parent(rangeList);

  for (let i in freqBands) {
    if (!freqBands.hasOwnProperty(i)) {
      continue;
    }

    let band = freqBands[i];

    let optGroup = myp5.createElement('optgroup');
    optGroup.attribute('label', band.optGroup);

    for (let j in  band.ranges) {
      if (!band.ranges.hasOwnProperty(j)) {
        continue;
      }

      let option = myp5.createElement('option');
      option.html(`${band.ranges[j][0]} - ${band.ranges[j][1]} Hz`);
      option.attribute('data-lower-bound', band.ranges[j][0]);
      option.attribute('data-upper-bound', band.ranges[j][1]);
      option.parent(optGroup);
    }
    optGroup.parent(rangeList);
  }

  rangeList.parent(selectWrap);
  selectWrap.parent(inputWrapper);
};


/**
 *
 * @param wave
 * @param prop
 * @param inputWrapper
 * @param controls
 */
let createDomSlider = (wave, prop, inputWrapper, controls) => {
  "use strict";

  let waveName = wave.constructor.name;

  let step = 0;
  if (Number.isInteger(wave[prop].currentValue)) {
    step = 1;
  }
  if ((wave[prop].max - wave[prop].min) < 10) {
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
};



/**
 *
 * @param wave
 * @param prop
 * @param controls
 * @param parentWrapper
 */
let createRadioToggle = (wave, prop, controls, parentWrapper) => {
  "use strict";

  if (wave[prop].attrType === "variable" && wave[prop].options.length) {

    let waveName = wave.constructor.name;


    let inputWrapper = myp5.createElement('div');
    inputWrapper.attribute('class', `radio-option-wrap ${waveName}-${prop}`);
    inputWrapper.parent(parentWrapper);

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
};



/**
 *
 * @param wave
 * @param prop
 * @param parentWrapper
 */
let createPianoDomInput = (wave, prop, parentWrapper) => {
  "use strict";

  let waveName = wave.constructor.name;

  let pianoWrapper = myp5.createElement('div');
  pianoWrapper.attribute('class', `piano-mode`);
  pianoWrapper.parent(parentWrapper);


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
  pianoInput.value(myp5.random(wave[prop].min, wave[prop].max).toFixed(3));
  pianoInput.elt.max = wave[prop].max;  // not sure if i want to set a max or min
  pianoInput.elt.min = wave[prop].min;  // not sure if i want to set a max or min
  pianoInput.attribute('data-type', 'value-set');
  pianoInput.attribute('data-wave', waveName);
  pianoInput.attribute('data-prop', prop);

  pianoInput.elt.onchange = setKeyboardControl;
  pianoInput.elt.step = Number((wave[prop].max - wave[prop].min) / 200).toFixed(3);
  pianoInput.parent(pianoWrapper);

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
let updateRangeDisplay = (range) => {
  "use strict";
  let value = $(range).val();
  value = Math.round(value * 100) / 100;
  $(range).parents('.range-slider-wrapper').children('.range-slider-value').html(value);
};




let keyboardCtrl = {};
let wavePropToKeyMap = {};
/**
 * When the user enters a key into the input
 * save it to a key to controller map
 * @param e
 */
let setKeyboardControl = (e) => {
  "use strict";
  // console.log(e);

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
      delete wavePropToKeyMap[waveName][property];
    }


    if (Object.size(wavePropToKeyMap[waveName]) === 0) {
      delete wavePropToKeyMap[waveName];
    }
  }

  console.log(keyboardCtrl);
  console.log(wavePropToKeyMap);
};


// initialize the the menu toggle
$(() => {
  $("#settings-close").click(() => {
    $("#settings-menu").fadeOut();
    $("#settings-open").fadeIn();
  });

  $("#settings-open").click(() => {
    $("#settings-menu").fadeIn();
    $("#settings-open").fadeOut();
  });
});


