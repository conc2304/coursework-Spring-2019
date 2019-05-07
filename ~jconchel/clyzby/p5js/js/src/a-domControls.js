

/**
 * Iterate through all of the values that we want
 * to give the use control over and based on the
 * attribute type make a slider or a radio to control that property
 * @param ctrlElements
 * @returns {{}}
 */

// TODO  -  this function is way to damn long

let createDOMControls = (ctrlElements) => {
  "use strict";

  if (!ctrlElements.length) {
    return {};
  }


  // create audio control config buttons
  // reference - https://tympanus.net/Development/AudioVisualizers/

  createAudioCtrls();

  // loop through each of the control objects and create settings controllers based on
  // the property's attribute type
  let controls = {};

  for (let ctrlElem in ctrlElements) {
    if (!ctrlElements.hasOwnProperty(ctrlElem)) {
      continue;
    }

    ctrlElem = ctrlElements[ctrlElem];
    let ctrlObjectName = ctrlElem.constructor.name;
    let wrapperID = ctrlObjectName + '-settings';
    controls[ctrlObjectName] = {};


    // create a div for each of the different control
    let domCtrl = myp5.createDiv();
    domCtrl.attribute('id', wrapperID);
    domCtrl.attribute('class', 'ctrlObject-settings');
    domCtrl.parent('ctrlObject-control-panel');


    // create a button to toggle the settings sliders visibility
    let button = myp5.createButton(ctrlObjectName, '1');
    button.style('position', 'relative');
    button.attribute('id', ctrlObjectName + '-toggle');
    button.attribute('class', 'settings-toggle-button');
    button.mousePressed(function () {  // todo  figure out how to pass a 'lexical this' with es6 arrow functions
      $('#' + this.html() + "-wrapper").toggleClass('hide'); // p5 makes it so incredibly dubm to get any sort of information
      $(`#${this.html()}-toggle`).toggleClass('open');

    });

    button.parent(wrapperID);

    let ctrlElemSettingWrapper = myp5.createElement('div');
    ctrlElemSettingWrapper.attribute('id', `${ctrlObjectName}-wrapper`);
    ctrlElemSettingWrapper.attribute('class', `hide settings-wrapper`);
    ctrlElemSettingWrapper.parent(wrapperID);


    for (let prop in ctrlElem) {
      if (!ctrlElem.hasOwnProperty(prop)) {
        continue;
      }

      if (ctrlElem[prop].attrType === 'numeric') {
        createSliderCtrlr(ctrlElem, prop, ctrlElemSettingWrapper, controls);
      }

    }

    // loop through again (so that the radios come last in the group)
    // and create radio for all variable attribute types
    for (let prop in ctrlElem) {
      if (!ctrlElem.hasOwnProperty(prop)) {
        continue;
      }
      if (ctrlElem[prop].attrType === 'variable') {
        createRadioToggle(ctrlElem, prop, controls, ctrlElemSettingWrapper);
      }
    }
  }

  return controls;
};



/**
 *
 * @param ctrlObject
 * @param prop
 * @param parentWrapper
 * @param controls
 */
let createSliderCtrlr = (ctrlObject, prop, parentWrapper, controls) => {
  "use strict";

  if (ctrlObject[prop].attrType === 'numeric') {

    let ctrlObjectName = ctrlObject.constructor.name;

    // wrapper to hold individual range sliders
    let inputWrapper = myp5.createElement('div');
    inputWrapper.attribute('class', `range-slider-wrapper`);
    inputWrapper.parent(parentWrapper);


    let title = myp5.createElement('p', ctrlObject[prop].displayLabel);
    title.style('position', 'relative');
    title.parent(inputWrapper);

    createPianoDomInput(ctrlObject, prop, inputWrapper, controls);
    createDomSlider(ctrlObject, prop, inputWrapper, controls);
    createFrequencySelector(ctrlObject, prop, inputWrapper);
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


/**
 * Create a select drop down to assign frequency bands to visual elements
 * @param ctrlObject
 * @param prop
 * @param inputWrapper
 */
let createFrequencySelector = (ctrlObject, prop, inputWrapper) => {
  "use strict";

  let ctrlObjectName = ctrlObject.constructor.name;
  let selectWrap = myp5.createElement('div');
  selectWrap.addClass('custom-select-wrapper');

  let rangeList = myp5.createElement("select");
  rangeList.attribute('data-ctrl_object', ctrlObjectName);
  rangeList.attribute('data-prop', prop);
  rangeList.elt.onchange = setAudioCtrl;

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
 *  Create an html range slider to control the visual elements
 * @param ctrlObject
 * @param prop
 * @param inputWrapper
 * @param controls
 */
let createDomSlider = (ctrlObject, prop, inputWrapper, controls) => {
  "use strict";

  let ctrlObjectName = ctrlObject.constructor.name;

  let step = 0;
  if (Number.isInteger(ctrlObject[prop].currentValue)) {
    step = 1;
  }
  if ((ctrlObject[prop].max - ctrlObject[prop].min) < 10) {
    // if the difference between min and max is 10 or less
    step = (ctrlObject[prop].max - ctrlObject[prop].min) / 100;
  }

  // slider to control the individual property
  controls[ctrlObjectName][prop] = myp5.createSlider(ctrlObject[prop].min, ctrlObject[prop].max, ctrlObject[prop].currentValue, step);
  controls[ctrlObjectName][prop].attribute('class', `range-slider ${ctrlObjectName}-${prop}`);
  controls[ctrlObjectName][prop].attribute('data-ctrl_object', ctrlObjectName);
  controls[ctrlObjectName][prop].attribute('data-prop', prop);
  controls[ctrlObjectName][prop].attribute('oninput', 'sliderSetValue(this)');
  controls[ctrlObjectName][prop].parent(inputWrapper);

  let displayValue = myp5.createElement('span', ctrlObject[prop].currentValue.toString());
  displayValue.attribute('class', `range-slider-value`);
  displayValue.parent(inputWrapper);
};



/**
 *
 * @param ctrlObject
 * @param prop
 * @param controls
 * @param parentWrapper
 */
let createRadioToggle = (ctrlObject, prop, controls, parentWrapper) => {
  "use strict";

  if (ctrlObject[prop].attrType === "variable" && ctrlObject[prop].options.length) {

    let ctrlObjectName = ctrlObject.constructor.name;


    let inputWrapper = myp5.createElement('div');
    inputWrapper.attribute('class', `radio-option-wrap ${ctrlObjectName}-${prop}`);
    inputWrapper.parent(parentWrapper);

    let label = myp5.createElement('p', ctrlObject[prop].displayLabel);
    label.style('position', 'relative');
    label.parent(inputWrapper);

    controls[ctrlObjectName][prop] = myp5.createRadio();

    for (let o in ctrlObject[prop].options) {
      if (!ctrlObject[prop].options.hasOwnProperty(o)) {
        continue;
      }

      controls[ctrlObjectName][prop].option(ucFirst(ctrlObject[prop].options[o]), ctrlObject[prop].options[o]);
      controls[ctrlObjectName][prop].attribute('class', `radio-input`);
      controls[ctrlObjectName][prop].parent(inputWrapper);
    }
    controls[ctrlObjectName][prop].selected(ctrlObject[prop].currentValue);
    controls[ctrlObjectName][prop].attribute('data-ctrl_object', ctrlObjectName);
    controls[ctrlObjectName][prop].attribute('data-prop', prop);
    controls[ctrlObjectName][prop].attribute('onchange', 'setRadioValue(this)');

  }
};


let setRadioValue = (inputElem) => {
  "use strict";

  console.log($(inputElem));

  let value = $(inputElem).val();
  console.log(value);
  let controlElementName = $(inputElem).data('ctrl_object');
  let prop = $(inputElem).data('prop');

  let controlObject = myp5[`get${controlElementName}`]();
  controlObject[prop].currentValue = value;
};


/**
 *
 * @param ctrlObject
 * @param prop
 * @param parentWrapper
 */
let createPianoDomInput = (ctrlObject, prop, parentWrapper) => {
  "use strict";

  let ctrlObjectName = ctrlObject.constructor.name;

  let pianoWrapper = myp5.createElement('div');
  pianoWrapper.attribute('class', `piano-mode`);
  pianoWrapper.parent(parentWrapper);


  // input to set which keyboard key plays that element
  let pianoInput = myp5.createInput();
  pianoInput.attribute('data-ctrl_object', ctrlObjectName);
  pianoInput.attribute('data-prop', prop);
  pianoInput.attribute('data-type', 'key-set');
  pianoInput.elt.placeholder = "Control Key";
  pianoInput.elt.onchange = setKeyboardControl;
  pianoInput.elt.maxLength = 1;
  pianoInput.parent(pianoWrapper);


  // input to set what the value will be for that element on that key press
  pianoInput = myp5.createInput(ctrlObject[prop].currentValue.toString(), 'number');
  pianoInput.value(myp5.random(ctrlObject[prop].min, ctrlObject[prop].max).toFixed(3));
  pianoInput.elt.max = ctrlObject[prop].max;  // not sure if i want to set a max or min
  pianoInput.elt.min = ctrlObject[prop].min;  // not sure if i want to set a max or min
  pianoInput.attribute('data-type', 'value-set');
  pianoInput.attribute('data-ctrl_object', ctrlObjectName);
  pianoInput.attribute('data-prop', prop);

  pianoInput.elt.onchange = setKeyboardControl;
  pianoInput.elt.step = Number((ctrlObject[prop].max - ctrlObject[prop].min) / 200).toFixed(3);
  pianoInput.parent(pianoWrapper);
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



let sliderSetValue = (range) => {
  "use strict";

  let value = $(range).val();
  let controlElementName = $(range).data('ctrl_object');
  let prop = $(range).data('prop');
  let controlObject = myp5[`get${controlElementName}`]();

  controlObject[prop].resetValue = controlObject[prop].currentValue = Number(value);
  updateRangeDisplay(range);
};




let keyboardCtrl = {};
let ctrlElemPropToKeyMap = {};
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
  let ctrlObjectName = e.target.dataset.ctrl_object;
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

  if (!Number.isNaN(charCode) && ctrlObjectName && property && propValue) {

    console.log('setting value');
    console.log([inputValue, charCode, ctrlObjectName, property, propValue]);
    // only update the keyboard control if we have a key to control it with
    keyboardCtrl[charCode] = keyboardCtrl[charCode] || {};
    keyboardCtrl[charCode][ctrlObjectName] = keyboardCtrl[charCode][ctrlObjectName] || {};
    keyboardCtrl[charCode][ctrlObjectName][property] = Number(propValue);

    ctrlElemPropToKeyMap[ctrlObjectName] = ctrlElemPropToKeyMap[ctrlObjectName] || {};
    ctrlElemPropToKeyMap[ctrlObjectName][property] = charCode;
  } else {

    console.log('cleaning ');
    if (ctrlElemPropToKeyMap[ctrlObjectName] && ctrlElemPropToKeyMap[ctrlObjectName][property]) {

      let keyToClean = ctrlElemPropToKeyMap[ctrlObjectName][property];
      console.log(keyToClean);

      delete keyboardCtrl[keyToClean][ctrlObjectName][property];
      if (Object.size(keyboardCtrl[keyToClean][ctrlObjectName]) === 0) {
        delete keyboardCtrl[keyToClean][ctrlObjectName];
      }

      if (Object.size(keyboardCtrl[keyToClean]) === 0) {
        delete keyboardCtrl[keyToClean];
      }
      delete ctrlElemPropToKeyMap[ctrlObjectName][property];
    }


    if (Object.size(ctrlElemPropToKeyMap[ctrlObjectName]) === 0) {
      delete ctrlElemPropToKeyMap[ctrlObjectName];
    }
  }

  console.log(keyboardCtrl);
  console.log(ctrlElemPropToKeyMap);
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


