

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

let uploadedAudioPlay = (audioFile) => {

  uploadLoading = false;

  if (audio.isPlaying()) {
    audio.pause();
  }

  audio = audioFile;
  audio.loop();
};

let toggleAudio = () => {
  if (audio.isPlaying()) {
    audio.pause();
  } else {
    audio.play();
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

        fftAnalysis.push(fft.getEnergy(range[0], range[1]));
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

  let controlEl = e.target.dataset.wave;
  let property = e.target.dataset.prop;

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
