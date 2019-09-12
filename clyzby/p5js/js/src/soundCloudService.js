//Variable
let urlList = [];
let nameList = [];
let currentIndex = 0;
let buttonPlay = $('#play');
let buttonPrev = $('#prev');
let buttonNext = $('#next');
let selectSound = $('#selectSound');
let songName = $('#songname');
let songTime = $('#songtime');
let loadingBar = $('#loadingBar');
let progressBar = $('#progressBar');
let seconds, minutes, bass, mid, treble, list, ntgr;
let fft;

//SoundCloud
let CLIENT_ID = 'NmW1FlPaiL94ueEu7oziOWjYEzZzQDcK';
let PLAYLIST_URL = 'https://soundcloud.com/clyzby/sets/safe-bass';
// let PLAYLIST_URL = 'https://soundcloud.com/clyzby/likes';
// var PLAYLIST_URL = 'https://soundcloud.com/fftb/sets/party';

SC.initialize({
  client_id: CLIENT_ID
});

SC.resolve(PLAYLIST_URL)
  .then(function (playlist) {
    let tracks;
    if (playlist.tracks) {
      tracks = playlist.tracks;
    } else if (playlist.length && playlist[0].stream_url) {
      tracks = playlist;
    }
    for (var i = 0; i < tracks.length; i++) {
      urlList.push(tracks[i].stream_url + '?client_id=' + CLIENT_ID);
      nameList.push(tracks[i].title);
    }
    selectSound.append(createPlaylist(nameList));
  })
  .catch(function (error) {
    console.log(error);
  });




//loadSound callbacks
function success() {
  console.log('Sound is loaded : ' + audio.isLoaded());
  audio.playMode('restart');
  audio.play();
  audio.onended(endSong);
}

function error(fail) {
  console.log(fail);
}

function progress(percent) {
  loadingBar.value = (percent * 100) + 1;
  console.log((percent * 100) + 1);
  songName.innerHTML = nameList[currentIndex];
  songTime.innerHTML = ((percent * 100) + 1).toFixed() + '%';
}

//
function touchStarted() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
}

//
//Setup
function setup(loadsong) {
  console.log('LOADING FFT');
  audio = myp5.loadSound(loadsong, success, error, progress);
  fft = new p5.FFT();
  amplitude = new p5.Amplitude();
  peakDetect = new p5.PeakDetect(20,100);
  fft.setInput(audio);
  amplitude.setInput(audio);
  pixelDensity(1);
  // var cnv = createCanvas(document.getElementById('canvaswrapper').offsetWidth, document.getElementById('canvaswrapper').offsetHeight);
  // cnv.parent('canvaswrapper');
  // noFill();
}


//
// //Draw
// function draw() {
//
//   clear();
//
//   seconds = Math.floor(audio.currentTime() % 60);
//   minutes = Math.floor(audio.currentTime() / 60);
//   if (audio.isLoaded() && !audio.isPaused()) {
//     songTime.innerHTML = ('0' + minutes).substr(-2) + ':' + ('0' + seconds).substr(-2);
//     progressBar.value = 100 * (audio.currentTime() / audio.duration());
//   }
//   fft.analyze();
//
//   //energy
//   bass = fft.getEnergy("bass") / 100;
//   treble = fft.getEnergy("treble") / 100;
//   mid = fft.getEnergy("mid") / 100;
//
//   //amplitude
//   var level = amplitude.getLevel();
//
//   //peakDetect
//   peakDetect.update(fft);
//   if ( peakDetect.isDetected ) {
//
//   } else {
//
//   }
//   //spectrum
//   var spectrum = fft.analyze();
//   beginShape();
//   strokeWeight(2);
//   for (i = 0; i<spectrum.length; i++) {
//     vertex((width/spectrum.length)*i, map((spectrum[i]), 0, 255, height/2, 0));
//   }
//   endShape();
// };
//



// //Controls
function playCurrentSound() {
  if (!audio.isPlaying() && !audio.isPaused()) {
    buttonPlay.id = "pause";
    setup(urlList[currentIndex]);
    setSong();
  } else if (audio.isPaused()) {
    buttonPlay.id = "pause";
    audio.play();
  } else {
    audio.pause();
    buttonPlay.id = "play";
  }
}


function changeSong(btn, listItem) {
  if (audio.isPaused()) {
    audio.play();
  }
  audio.stop();
  audio.onended(pauseEndSong);
  if (btn === next) {
    currentIndex = Math.min(currentIndex + 1, urlList.length - 1);
    playCurrentSound();
  }
  if (btn === prev) {
    currentIndex = Math.max(currentIndex - 1, 0);
    playCurrentSound();
  }
  if (btn === select) {
    for (var i = 0; i < urlList.length; i++) {
      if (nameList[i] === listitem.innerHTML) {
        currentIndex = i;
        playCurrentSound();
      }
    }
  }
  setSong();
}


//Playlist
function createPlaylist(array) {
  var list = document.createElement('ul');
  for (var i = 0; i < array.length; i++) {
    listitem = document.createElement('li');
    if (ntgr == "odd") {
      listitem.classList.add('even');
      ntgr = "even";
    } else {
      listitem.classList.add('odd');
      ntgr = "odd";
    }
    if (i == 0) {
      listitem.classList.add('active');
    }
    listitem.appendChild(document.createTextNode(array[i]));
    list.appendChild(listitem);
  }
  return list;
}

function setSong() {
  for (var i = 0; i < urlList.length; i++) {
    selectSound.getElementsByTagName("li")[i].classList.remove('active');
    if (nameList[i] === nameList[currentIndex]) {
      selectSound.getElementsByTagName("li")[i].classList.add('active');
    }
  }
}

//endSong
function endSong() {
  if (!audio.isPaused() && (audio.currentTime() === '0' || audio.currentTime().toString().split(".")[0] === audio.duration().toString().split(".")[0])) {
    if (currentIndex === (urlList.length - 1)) {
      currentIndex = '0';
    } else {
      currentIndex = Math.min(currentIndex + 1, urlList.length - 1);
    }
    setup(urlList[currentIndex]);
    setSong();
    progressBar.value = audio.currentTime();
  }
}

function pauseEndSong() {
  console.log('set pauseEndSong');
}
