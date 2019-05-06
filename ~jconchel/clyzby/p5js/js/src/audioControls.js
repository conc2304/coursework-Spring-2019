

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
      [16000, 32000],
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