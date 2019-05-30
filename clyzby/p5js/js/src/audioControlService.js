let uploadLoading = false;
let uploadedAudio;

// const FREQ_RANGES = {
let freqBands = {
  low: {
    optGroup: 'Low',
    ranges: [
      [32, 64],
    ]
  },
  midLow: {
    optGroup: 'Mid - Low',
    ranges: [
      [64, 125],
      [125, 250],
    ]
  },
  mid: {
    optGroup: 'Mid',
    ranges: [
      [250, 500],
      [500, 1000],
      [1000, 2000],
    ]
  },
  midHigh: {
    optGroup: 'Mid - High',
    ranges: [
      [2000, 4000],
      [4000, 8000],
    ]
  },
  high: {
    optGroup: 'High',
    ranges: [
      [8000, 16000],
      [16000, 22000],  // fft analysis breaks at 23,000k hz
    ]
  },
};



/**
 * On file upload trigger callback to play new file.
 * @param file
 */
let uploaded = (file) => {
  uploadLoading = true;
  uploadedAudio = myp5.loadSound(file.data, uploadedAudioPlay);
};



/**
 * Callback from when uploaded get called.
 * Stop the current audio and then upload new audio
 */
let uploadedAudioPlay = () => {

  uploadLoading = false;

  if (audio.isPlaying()) {
    console.log('is playing');
    audio.stop();
  }
  audio.stop();
  audio = uploadedAudio;
  audio.play();
  audio.loop();
};



/**
 * Stop and play the audio file
 * and change the display of the pause/play button
 */
let toggleAudio = () => {
  // console.log(elem);
  if (audio.isPlaying()) {
    audio.pause();
    $("#play-audio").html('&#9658;');
  } else {
    // audio.play();
    audio.loop();
    $("#play-audio").html('&#10074; &#10074;');
  }
};
// end reference



/**
 * Given each eq band, assign the energy levels for each band to that group
 * to be applied to elements that respond to each of those frequencies
 * @param fft
 * @param freqBands - a hardcoded set of frequency bands that we have prebuilt as an eq band
 * @returns {Array}
 */
let get10BandEnergy = (fft) => {

  fft.analyze();

  let fftAnalysis = [];
  fftAnalysis[0] = 0;  // account for the default text 'Frequency Ranges'

  let range;
  if (freqBands) {
    for (let i in freqBands) {
      if (!freqBands.hasOwnProperty(i)) {
        continue;
      }
      let band = freqBands[i];
      for (let j in  band.ranges) {
        if (!band.ranges.hasOwnProperty(j)) {
          continue;
        }

        range = band.ranges[j];
        fftAnalysis[`${range[0]} - ${range[1]} Hz`] = fft.getEnergy(range[0], range[1]); // lower and upper bound
      }
    }
  }

  return fftAnalysis;
};



let audioCtrl = {};
let elementPropToFQMap = {};
/**
 * On DOM dropdown select:
 * Map the selected frequency range to the given property and store globally
 * @param e - the event
 */
let setAudioCtrl = (e) => {
  "use strict";

  // console.log(e);

  let controlEl = $(e.target).data('ctrl_object');
  let property = $(e.target).data('prop');

  let value = e.target.selectedOptions[0].value;

  if (e.target.selectedIndex !== 0) {
    audioCtrl[value] = audioCtrl[value] || {};
    audioCtrl[value][controlEl] = audioCtrl[value][controlEl] || {};
    audioCtrl[value][controlEl][property] = audioCtrl[value][controlEl][property];

    elementPropToFQMap[controlEl] = elementPropToFQMap[controlEl] || {};
    elementPropToFQMap[controlEl][property] = value;
  } else {
    console.log('cleaning ');

    if (elementPropToFQMap[controlEl] && elementPropToFQMap[controlEl][property]) {

      let freqToClean = elementPropToFQMap[controlEl][property];
      console.log(freqToClean);

      delete audioCtrl[freqToClean][controlEl][property];
      if (Object.size(audioCtrl[freqToClean][controlEl]) === 0) {
        delete audioCtrl[freqToClean][controlEl];
      }

      if (Object.size(audioCtrl[freqToClean]) === 0) {
        delete audioCtrl[freqToClean];
      }
      delete elementPropToFQMap[controlEl][property];
    }


    if (Object.size(elementPropToFQMap[controlEl]) === 0) {
      delete elementPropToFQMap[controlEl];
    }
  }

  console.log(audioCtrl);
  console.log(elementPropToFQMap);
};



/**
 * Loop through all of the elements that have audio reactive set,
 * and apply the frequency to the element property.
 * We map the audio frequency value between the minimum and maximum for the property.
 * We then adjust the target value using the reset or target value based on responsiveness type
 * @param energyValues - an array of amplitude readings for each frequency
 * @returns {boolean}
 */
let applyAudioEnergyValues = (energyValues) => {
  "use strict";

  if (energyValues.size < 1) {
    return false;
  }

  let controlObject;
  let audioValue;

  let ctrlHandlers = elementPropToFQMap;
  for (let controlElementName in ctrlHandlers) {
    if (!ctrlHandlers.hasOwnProperty(controlElementName)) {
      continue;
    }

    controlObject = myp5[`get${controlElementName}`]();
    for (let ctrlProp in ctrlHandlers[controlElementName]) {
      if (!ctrlHandlers[controlElementName].hasOwnProperty(ctrlProp)) {
        continue;
      }

      let eqBand = ctrlHandlers[controlElementName][ctrlProp];
      // the value in eq band will be somewhere between 0 and 255
      // we need to scale that between the upper and lower bounds of the element
      if (energyValues[eqBand] === 0) {
        continue;
      } else {
        audioValue = myp5.map(energyValues[eqBand], 0, 255, controlObject[ctrlProp].min, controlObject[ctrlProp].max);
      }

      // todo create a knob for this in the dom
      audioValue = audioValue * controlObject[ctrlProp].audio.gain;

      // todo should the lock affect this? should random and reset affect these

      let setValue;
      let overBy;
      switch (controlObject[ctrlProp].audio.responsiveType) {
        case "infinite":
          audioValue = myp5.map(energyValues[eqBand], 0, 255, 0, controlObject[ctrlProp].max);
          audioValue = audioValue * 0.01;
          setValue = controlObject[ctrlProp].targetValue + audioValue;
          break;
        case "loop up":
          audioValue = myp5.map(energyValues[eqBand], 0, 255, 0, controlObject[ctrlProp].max);

          audioValue = audioValue * 0.01;
          // increase it by how much it went over and then loop from top again
          if (controlObject[ctrlProp].targetValue + audioValue > controlObject[ctrlProp].max) {
            overBy = controlObject[ctrlProp].targetValue + audioValue - controlObject[ctrlProp].max;
            setValue = controlObject[ctrlProp].min + overBy;
          } else {
            setValue = controlObject[ctrlProp].targetValue + audioValue;
          }
          break;
        case "loop down":
          audioValue = myp5.map(energyValues[eqBand], 0, 255, 0, controlObject[ctrlProp].max);

          audioValue = audioValue * 0.01;
          // decrease it by how much it went under and then loop from top again
          if (controlObject[ctrlProp].targetValue - audioValue < controlObject[ctrlProp].min) {
            overBy = controlObject[ctrlProp].targetValue - audioValue + controlObject[ctrlProp].min;
            setValue = controlObject[ctrlProp].max - overBy;
          } else {
            setValue = controlObject[ctrlProp].targetValue - audioValue;
          }
          break;
        case "subtract":
          setValue = controlObject[ctrlProp].resetValue - Number(audioValue.toFixed(3));
          break;
        case "add":
        default:
          setValue = controlObject[ctrlProp].resetValue + Number(audioValue.toFixed(3));
          break;
      }

      controlObject[ctrlProp].targetValue = setValue;
    }
  }
};



/**
 * From radio input change the value of the responsive type for that contorl element
 * @param radioElem
 */
let setAudioResponsiveType = (radioElem) => {
  "use strict";

  console.log($(radioElem).parent().find('input:radio:checked').val());
  console.log(radioElem);

  let value = $(radioElem).val();
  let controlElementName = $(radioElem).data('ctrl_object');
  let prop = $(radioElem).data('prop');

  let controlObject = myp5[`get${controlElementName}`]();
  if (controlObject[prop].lockOn === false) {
    controlObject[prop].audio.responsiveType = value;
  }
};


let randomizeAudioCtrls = () => {
  "use strict";
  console.log('stuff');

  randomizeAudioFrequency();
  randomizeAudioResponsiveOption();
};



/**
 * Iterate through each of the input radios and randomize their
 * value based on the number of inputs by radio group name
 */
let randomizeAudioResponsiveOption = (ctrlObjectName = false) => {

  let radioNamesArr = [];
  let selector;
  if (ctrlObjectName === false) {
    selector = 'input.audio-responsive-selector';
  } else {
    selector = `#${ctrlObjectName}-wrapper input.audio-responsive-selector`;
  }

  $(selector).each(function () {
    if (!radioNamesArr.includes(this.name)) {
      radioNamesArr.push(this.name);
    }
  });

  for (let radioGroup in radioNamesArr) {
    if (!radioNamesArr.hasOwnProperty(radioGroup)) {
      continue;
    }

    let groupName = radioNamesArr[radioGroup];
    if (ctrlObjectName === false) {
      selector = `input.audio-responsive-selector[name*=${groupName}]`;
    } else {
      selector = `#${ctrlObjectName}-wrapper input.audio-responsive-selector[name*=${groupName}]`;
    }

    let $radioGroup = $(selector);
    let radioLength = $radioGroup.length;
    let rVal = getRandomInt(1, radioLength) - 1;

    rVal = $radioGroup[rVal].value;

    $radioGroup.each(function () {
      $(this).val([rVal]);
    });
  }
};



/**
 * Go through each of the frequency dropdowns and randomize each value
 */
let randomizeAudioFrequency = (ctrlObjectName = false) => {

  let randomOption;
  let optionsLength;
  let rVal;
  let selector;

  if (ctrlObjectName === false) {
    selector = 'select.freq-selector';
  } else {
    selector = `#${ctrlObjectName}-wrapper select.freq-selector`;
  }

  $(selector).each(function(){

    optionsLength = this.options.length;
    randomOption = getRandomInt(0, optionsLength);

    console.log($(this));

    if (typeof this.options[randomOption] === 'undefined') {
      console.log('stop');
      return true;
    }

    rVal = this.options[randomOption].value;

    $(this)
      .val(rVal)
      .trigger('change');
  });
};