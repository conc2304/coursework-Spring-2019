// initialize the the menu toggle
$(() => {
  "use strict";

  $("#settings-close").click(() => {
    $("#settings-menu").fadeOut();
    $("#settings-open").fadeIn();
  });

  $("#settings-open").click(() => {
    $("#settings-menu").fadeIn();
    $("#settings-open").fadeOut();
  });

  $("#reset-settings").click(() => {
    resetSettings();
  });

  $("#randomize-settings").click(() => {
    randomizeSettings();
  });


  $("#toggle-help").click(() => {
    $("#toggle-help").toggleClass("inactive");
  });

  $("#settings-menu").on('mouseover', '.helper', function () {

    if ($("#toggle-help").hasClass("inactive") || !this.hasAttribute('title')) {
      return false;
    }

    let helpText = $(this).data('helper');
    if (typeof(helpText) === 'undefined' || !helpText) {
      helpText = $(this).attr('title');
    }

    // delay the helper a little
    setTimeout(function () {
        $("#help-text").fadeOut(function () {
          $(this).html(helpText);
          $(this).fadeIn();
          $("#help-section").show();
        });

      }, 200
    );
  });

  $("#settings-menu").on('mouseleave', '.helper', function () {
    $("#help-section").fadeOut();
  });

});  // end document on load


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
    button.mousePressed(function () {
      $('#' + this.html() + "-wrapper").toggleClass('hide'); // p5 makes it so incredibly dumb to get any sort of information
      $(`#${this.html()}-toggle`).toggleClass('open');
    });
    button.parent(wrapperID);

    addMasterElementControls(ctrlElem, wrapperID);

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

  setIntroDefaults();
};


/**
 * Create a mute button, a shuffle, and a reset button
 * that will affect only the that element
 * @param ctrlElem
 * @param parent
 */
let addMasterElementControls = (ctrlElem, parent) => {
  "use strict";

  let ctrlElemName = ctrlElem.constructor.name;
  // parent should be icon wrapper
  let iconWrapper = myp5.createElement('div');
  console.log(ctrlElemName);
  iconWrapper.addClass('icon-wrapper');
  iconWrapper.parent(parent);


  let icons = [
    {
      htmlIcon: 'visibility',
      title: 'Visibility',
      onclick: `toggleVisibility('${ctrlElemName}', this)`,
      helper: 'Toggles whether this element is visible or not.',
    },
    {
      htmlIcon: 'shuffle',
      title: 'Randomize',
      onclick: `randomizeSettings('${ctrlElemName}')`,
      helper: 'Randomize every property in this element.  This does not affect the audio reactive controllers.',
    },
    {
      htmlIcon: 'restore',
      title: 'Reset Visuals',
      onclick: `resetSettings('${ctrlElemName}')`,
      helper: 'Randomize every property in this element to their original default state.  This does not affect the audio reactive controllers.',
    }
  ];

  for (let i in icons) {
    if (!icons.hasOwnProperty(i)) {
      continue;
    }
    let icon = myp5.createElement('i');
    icon.addClass('material-icons md-light helper');
    icon.html(icons[i].htmlIcon);
    icon.attribute('title', icons[i].title);
    icon.attribute('data-helper', icons[i].helper);
    icon.attribute('onclick', icons[i].onclick);
    icon.parent(iconWrapper);
  }
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

    // wrapper to hold individual range sliders
    let inputWrapper = myp5.createElement('div');
    inputWrapper.attribute('class', `range-slider-wrapper`);
    inputWrapper.parent(parentWrapper);

    let title = myp5.createElement('p', ctrlObject[prop].displayLabel);
    title.style('position', 'relative')
      .parent(inputWrapper);

    createLockElement(ctrlObject, prop, title);
    createPianoDomInput(ctrlObject, prop, inputWrapper, controls);
    createDomSlider(ctrlObject, prop, inputWrapper, controls);
    createFrequencySelector(ctrlObject, prop, inputWrapper);
  }
};



/**
 * Create a DOM element to control whether a property is changeable or not.
 * @param ctrlObject
 * @param prop
 * @param parentElem
 */
let createLockElement = (ctrlObject, prop, parentElem) => {
  "use strict";

  let ctrlElemName = ctrlObject.constructor.name;

  let lockIcon = myp5.createElement('i', 'lock_open');
  lockIcon.addClass(`material-icons md-light ${ctrlElemName}-${prop} helper`);
  lockIcon.attribute('data-helper', 'Lock this property\'s settings from being set, randomized, or reset. Only the global reset button will override a locked property.');
  lockIcon.attribute('title', 'Settings Lock');
  lockIcon.attribute('onclick', `lockProperty('${ctrlElemName}', '${prop}', this)`);
  lockIcon.parent(parentElem);
};



/**
 *  Lets set the first elements with some default values
 *  to give the user something to play with
 */
let setIntroDefaults = () => {
  "use strict";

  let defaultValues = ['Q', 'W', 'E', 'R', 'T', 'Y'];

  let i = 0;
  $("input.keyboard-assigner").each(function () {
    // console.log(this);
    $(this)
      .val(defaultValues[i])
      .trigger('change');

    i++;

    if (i > defaultValues.length) {
      return false;
    }
  });

  $($(".freq-selector")[0]).val("2000 - 4000 Hz").trigger("change");
};


/**
 *
 */
let createAudioCtrls = () => {
  "use strict";
  let audioWrapperID = "audio-control-panel";


  let playButton = myp5.createButton("Play");
  playButton.parent(audioWrapperID);
  playButton.addClass("audio-button");
  playButton.attribute('id', 'play-audio');
  playButton.mousePressed(toggleAudio);

  let tooltip = myp5.createElement('span');
  tooltip.addClass('tooltip');
  tooltip.html('There is a built in audio file.<br>But you can also upload your own!');
  tooltip.parent(audioWrapperID);


  // we will hide the default file input bc its ugly and use the label
  let uploadButton = myp5.createFileInput(uploaded);
  uploadButton.parent(audioWrapperID);
  uploadButton.addClass("upload-button");
  uploadButton.attribute('id', 'upload-file');
  uploadButton.attribute('name', 'upload-file');

  let label = myp5.createElement('label');
  label.html('Upload Audio');
  label.attribute('for', 'upload-file');
  label.attribute('id', 'upload-file-label');
  label.addClass("audio-button");
  label.parent(audioWrapperID);
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
  rangeList.addClass("freq-selector helper");
  rangeList.attribute('data-ctrl_object', ctrlObjectName);
  rangeList.attribute('data-prop', prop);
  rangeList.attribute('data-helper', 'Make this element property audio reactive.  Select a frequency range from the dropdown to make it react to the music\'s frequency levels.');
  rangeList.attribute('title', 'Audio Reactive Settings');
  rangeList.elt.onchange = setAudioCtrl;

  let option = myp5.createElement('option');
  option.html(`Select Audio Frequency &#8675`);
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
  if ((ctrlObject[prop].max - ctrlObject[prop].min) < 50) {
    // if the difference between min and max is 10 or less
    step = (ctrlObject[prop].max - ctrlObject[prop].min) / 250;
  }

  // slider to control the individual property
  controls[ctrlObjectName][prop] = myp5.createSlider(ctrlObject[prop].min, ctrlObject[prop].max, ctrlObject[prop].currentValue, step)
  controls[ctrlObjectName][prop].addClass(`range-slider ${ctrlObjectName}-${prop} helper`);
  controls[ctrlObjectName][prop].attribute('data-ctrl_object', ctrlObjectName);
  controls[ctrlObjectName][prop].attribute('data-prop', prop);
  controls[ctrlObjectName][prop].attribute('title', 'Set element property');
  controls[ctrlObjectName][prop].attribute('data-helper', 'Changes the current value of this property. It also sets the reset value for key press release.  When you release a bound keystroke, the value will release to this value.');
  controls[ctrlObjectName][prop].attribute('oninput', 'sliderSetValue(this)');
  controls[ctrlObjectName][prop].parent(inputWrapper);


  let displayValue = myp5.createElement('span', ctrlObject[prop].currentValue.toString());
  displayValue.addClass(`range-slider-value helper`);
  displayValue.attribute('title', `Current and Reset value`);
  displayValue.attribute('data-helper', `Current and Reset value of this property. Reset Value is the value that the element will go to on key press release.`);
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

    createLockElement(ctrlObject, prop, label);

    controls[ctrlObjectName][prop] = myp5.createRadio();

    for (let o in ctrlObject[prop].options) {
      if (!ctrlObject[prop].options.hasOwnProperty(o)) {
        continue;
      }

      controls[ctrlObjectName][prop].option(ucFirst(ctrlObject[prop].options[o]), ctrlObject[prop].options[o]);
    }
    controls[ctrlObjectName][prop].selected(ctrlObject[prop].currentValue);
    controls[ctrlObjectName][prop].attribute('data-ctrl_object', ctrlObjectName);
    controls[ctrlObjectName][prop].attribute('class', `radio-input ${ctrlObjectName}-${prop}`);
    controls[ctrlObjectName][prop].attribute('data-prop', prop);
    controls[ctrlObjectName][prop].attribute('onchange', 'setRadioValue(this)');
    controls[ctrlObjectName][prop].parent(inputWrapper);
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
  if (controlObject[prop].lockOn === false) {
    controlObject[prop].currentValue = value;
  }
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
  pianoWrapper.addClass(`piano-mode`);
  pianoWrapper.parent(parentWrapper);


  // input to set which keyboard key plays that element
  let pianoInput = myp5.createInput();
  pianoInput.attribute('class', 'keyboard-assigner helper');
  pianoInput.attribute('title', 'Piano Mode Set Keyboard Key');
  pianoInput.attribute('data-helper', 'Basically use the keyboard as a piano and type away.  Assign a value to set for property on keypress.  When the key is pressed it will set the element\'s property to the value specified.');
  pianoInput.attribute('data-ctrl_object', ctrlObjectName);
  pianoInput.attribute('data-prop', prop);
  pianoInput.attribute('data-type', 'key-set');
  pianoInput.parent(pianoWrapper);
  pianoInput.elt.placeholder = "Assign Key";
  pianoInput.elt.onchange = setKeyboardControl;
  pianoInput.elt.maxLength = 1;


  // input to set what the value will be for that element on that key press
  pianoInput = myp5.createInput(ctrlObject[prop].currentValue.toString(), 'number');
  pianoInput.value(myp5.random(ctrlObject[prop].min, ctrlObject[prop].max).toFixed(3));
  pianoInput.addClass('helper');
  pianoInput.attribute('title', 'Piano Mode Set Keyboard Key Value');
  pianoInput.attribute('data-helper', ' Basically use the keyboard as a piano and type away.   Assign a value for the element\'s property to go to when its corresponding key is pressed. On key release, the it will go back to the reset value (the value set by the slider).');
  pianoInput.attribute('data-type', 'value-set');
  pianoInput.attribute('data-ctrl_object', ctrlObjectName);
  pianoInput.attribute('data-prop', prop);
  pianoInput.parent(pianoWrapper);

  pianoInput.elt.max = ctrlObject[prop].max;  // not sure if i want to set a max or min
  pianoInput.elt.min = ctrlObject[prop].min;  // not sure if i want to set a max or min
  pianoInput.elt.onchange = setKeyboardControl;
  pianoInput.elt.step = Number((ctrlObject[prop].max - ctrlObject[prop].min) / 200).toFixed(3);
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

  if (controlObject[prop].lockOn === false) {
    controlObject[prop].resetValue = controlObject[prop].currentValue = Number(value);
  }
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

    // console.log('setting value');
    // console.log([inputValue, charCode, ctrlObjectName, property, propValue]);
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

  // console.log(keyboardCtrl);
  // console.log(ctrlElemPropToKeyMap);
};


let resetSettings = (ctrlElement = false) => {
  // "use strict";

  let ctrlElementsArray = [];

  let globalReset;
  if (ctrlElement === false) {
    globalReset = true;
    ctrlElementsArray = myp5.ctrlElementsArray;
  } else {
    if (typeof(ctrlElement) === "string") {
      ctrlElement = myp5[`get${ctrlElement}`]();
    }
    globalReset = false;
    ctrlElementsArray.push(ctrlElement);
  }


  for (let i in ctrlElementsArray) {
    if (!ctrlElementsArray.hasOwnProperty(i)) {
      continue;
    }

    let ctrlElem = ctrlElementsArray[i];
    let ctrlObjectName = ctrlElem.constructor.name;

    for (let prop in ctrlElem) {
      if (!ctrlElem.hasOwnProperty(prop)) {
        continue;
      }

      if (!ctrlElem[prop].defaultValue || !ctrlElem[prop].currentValue) {
        continue;
      }

      if (ctrlElem[prop].attrType === "numeric") {
        $(`.range-slider.${ctrlObjectName}-${prop}`)
          .val(ctrlElem[prop].defaultValue);
      } else if (ctrlElem[prop].attrType === "variable") {
        $(`input.radio-input.${ctrlObjectName}-${prop}`)
          .val([ctrlElem[prop].defaultValue]);
      }

      if (globalReset === true) {
        ctrlElem[prop].lockOn = false;

        $(`i.${ctrlObjectName}-${prop}`)
          .html('lock_open')
          .attr('title', 'Lock This Property (Only the global reset will override a locked property)')
          .removeClass('locked');
        $(`i.${ctrlObjectName}-${prop}`)
          .parents(".range-slider-wrapper")
          .removeClass('locked')
          .find('input, select').each(function () {
          $(this).prop('disabled', false);
        });

      }

      if (ctrlElem[prop].lockOn === false) {
        ctrlElem[prop].currentValue = ctrlElem[prop].defaultValue;
      }
    }
  }
};


/**
 * This can either randomize every visual element
 * or just a single visual element if it gets passed in
 * @param ctrlElement
 */
let randomizeSettings = (ctrlElement = false) => {
  // "use strict";

  let ctrlElementsArray = [];

  if (ctrlElement === false) {
    ctrlElementsArray = myp5.ctrlElementsArray;
  } else {
    if (typeof(ctrlElement) === "string") {
      ctrlElement = myp5[`get${ctrlElement}`]();
    }
    ctrlElementsArray.push(ctrlElement);
  }
  console.log(ctrlElementsArray);

  let rVal;
  let optLength;
  let optIndex;

  for (let i in ctrlElementsArray) {
    if (!ctrlElementsArray.hasOwnProperty(i)) {
      continue;
    }

    let ctrlElem = ctrlElementsArray[i];
    let ctrlObjectName = ctrlElem.constructor.name;

    for (let prop in ctrlElem) {
      if (!ctrlElem.hasOwnProperty(prop)) {
        continue;
      }

      if (!ctrlElem[prop].defaultValue || !ctrlElem[prop].currentValue) {
        continue;
      }

      if (ctrlElem[prop].lockOn === true) {
        continue;
      }

      if (ctrlElem[prop].attrType === "numeric") {

        rVal = myp5.random(ctrlElem[prop].min, ctrlElem[prop].max);

        $(`.range-slider.${ctrlObjectName}-${prop}`)
          .val(rVal);
      } else if (ctrlElem[prop].attrType === "variable") {
        optLength = ctrlElem[prop].options.length;
        optIndex = getRandomInt(0, optLength - 1);
        rVal = ctrlElem[prop].options[optIndex];
        $(`input.radio-input.${ctrlObjectName}-${prop}`).val([rVal]);

        if (typeof(rVal) === "undefined") {
          console.log('stop');
        }
      }

      if (ctrlElem[prop].lockOn === false) {
        ctrlElem[prop].currentValue = rVal;
      }
    }
  }
};


/**
 * Turn off and on individual visual elements
 * and change the material design icon state and associated title
 * Called by onclick of ctrl Elements' mute icon
 * @param ctrlElementName
 * @param htmlElem
 */
let toggleVisibility = (ctrlElementName, htmlElem) => {
  "use strict";

  let controlObject = myp5[`get${ctrlElementName}`]();
  controlObject.mute = !controlObject.mute;

  $(htmlElem).toggleClass('inactive');

  if ($(htmlElem).hasClass('inactive')) {
    $(htmlElem).attr('title', 'Turn Visuals On');
    $(htmlElem).html('visibility_off');
  } else {
    $(htmlElem).attr('title', 'Turn Visuals Off');
    $(htmlElem).html('visibility');
  }
};

/**
 * Lock the property so that the values can't be changed
 * Set the icon and parent wrapper to a locked stated
 * Disable the inputs and selects
 * @param ctrlElementName
 * @param prop
 * @param htmlElem
 */
let lockProperty = (ctrlElementName, prop, htmlElem) => {
  "use strict";

  let controlObject = myp5[`get${ctrlElementName}`]();
  let parent = $(htmlElem).parents(".range-slider-wrapper, .radio-option-wrap");


  $(htmlElem).toggleClass("locked");
  parent.toggleClass('locked');

  if ($(htmlElem).hasClass("locked")) {

    $(htmlElem).html('lock');
    $(htmlElem).attr('title', 'Unlock This Property');

    parent.find('input, select').each(function () {
      $(this).prop('disabled', true);
    });
  } else {
    $(htmlElem).html('lock_open');
    $(htmlElem).attr('title', 'Lock This Property');

    parent.find('input, select').each(function () {
      $(this).prop('disabled', false);
    });
  }

  controlObject[prop].lockOn = !controlObject[prop].lockOn;
};


let getRandomInt = (min, max) => {
  "use strict";
  return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
};



