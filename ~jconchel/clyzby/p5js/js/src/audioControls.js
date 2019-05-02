/*jshint esversion: 6 */


let uploadLoading = false;
let uploadedAudio;
// let audio;

let equalizerBands = [
  [32, 64],
  [64, 125],
  [125, 250],
  [250, 500],
  [500, 1000],
  [1000, 2000],
  [2000, 4000],
  [4000, 8000],
  [8000, 16000],
];

// reference - https://tympanus.net/Development/AudioVisualizers/
function uploaded(file) {
  uploadLoading = true;
  uploadedAudio = myp5.loadSound(file.data, uploadedAudioPlay);
}

function uploadedAudioPlay(audioFile) {

  uploadLoading = false;

  if (audio.isPlaying()) {
    audio.pause();
  }

  audio = audioFile;
  audio.loop();
}

function toggleAudio() {
  if (audio.isPlaying()) {
    audio.pause();
  } else {
    audio.play();
  }
}