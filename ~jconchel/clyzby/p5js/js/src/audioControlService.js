

let uploadLoading = false;
let uploadedAudio;
// let audio;

// const FREQ_RANGES = {
let freqBands = {
  low : {
    optGroup : 'Low',
    ranges : [
      [32, 64],
    ]
  },
  midLow : {
    optGroup : 'Mid - Low',
    ranges : [
      [64, 125],
      [125, 250],
    ]
  },
  mid : {
    optGroup : 'Mid',
    ranges : [
      [250, 500],
      [500, 1000],
      [1000, 2000],
    ]
  },
  midHigh : {
    optGroup : 'Mid - High',
    ranges : [
      [2000, 4000],
      [4000, 8000],
    ]
  },
  high : {
    optGroup : 'High',
    ranges : [
      [8000, 16000],
      [16000, 22000],  // fft analysis breaks at 23,000k hz
    ]
  },
};

// reference - https://tympanus.net/Development/AudioVisualizers/
let uploaded = (file) => {
  uploadLoading = true;
  uploadedAudio = myp5.loadSound(file.data, uploadedAudioPlay);
};


let uploadedAudioPlay = () => {

  uploadLoading = false;

  if (audio.isPlaying()) {
    console.log('is playing');
    audio.stop();
  }
  audio = uploadedAudio;
  audio.play();
  audio.loop();
};

let toggleAudio = () => {
  if (audio.isPlaying()) {
    audio.pause();
  } else {
    // audio.play();
    audio.loop();
  }
};
// end reference


let get10BandEnergy = (fft) => {

  fft.analyze();

  let fftAnalysis = [];
  fftAnalysis[0] = 0;  // account for the default text 'Frequency Ranges'

  let range;
  if(freqBands) {
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

let setAudioCtrl = (e) => {
  "use strict";

  console.log(e);

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



let applyAudioEnergyValues = (energyValues) => {
  "use strict";

  if (energyValues.size < 1) {
    return false;
  }

  let controlObject;
  let audioValue;

  // for each of the elements in the control
  for (let eqBand in energyValues) {

    if (eqBand === 0) {
      continue;
    }

    // console.log(eqBand); // the eqBand index [0-10]
    // console.log(energyValues[eqBand]);
  }

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
      // we need to scale that between the min and max value of the element
      audioValue = myp5.map(energyValues[eqBand], 0, 255, controlObject[ctrlProp].min, controlObject[ctrlProp].max);


      // todo find a way to make it additive or subtractive rather than replacing the value
      controlObject[ctrlProp].currentValue = controlObject[ctrlProp].resetValue + Number(audioValue.toFixed(3));
    }
  }
};
