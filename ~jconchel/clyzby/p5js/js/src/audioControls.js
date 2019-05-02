
let uploadLoading = false;
let uploadedAudio;
// let audio;

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