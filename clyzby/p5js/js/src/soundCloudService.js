//Variable
let urlList = [];
let nameList = [];
let currentIndex = 0;
let buttonPlay = $('#play');
let selectSound = $('#selectSound');
let songName = $('#songname');
let songTime = $('#songtime');
let loadingBar = $('#loadingBar');
let progressBar = $('#progressBar');
let list;
let fft;

//SoundCloud
let CLIENT_ID = 'NmW1FlPaiL94ueEu7oziOWjYEzZzQDcK';
let PLAYLIST_URL = 'https://soundcloud.com/clyzby/sets/safe-bass';
// let PLAYLIST_URL = 'https://soundcloud.com/atyya';
// let PLAYLIST_URL = 'https://soundcloud.com/clyzby/likes';
// var PLAYLIST_URL = 'https://soundcloud.com/fftb/sets/party';

SC.initialize({
  client_id: CLIENT_ID
});

SC.resolve(PLAYLIST_URL)
  .then(function (playlist) {
    let tracks = playlist.tracks || playlist;
    let songData = [];

    for (let i = 0; i < tracks.length; i++) {
      urlList.push(tracks[i].stream_url + '?client_id=' + CLIENT_ID);
      // nameList.push(tracks[i].title);
      // songData[i] = {
      //   title : tracks[i].title,
      //   user : tracks[i].user.username,
      //   url : tracks[i].permalink_url,
      //   albumArt : tracks[i].artwork_url,
      // };
    }
    selectSound.append(createPlaylist(tracks));
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
  loadingBar.val((percent * 100) + 1);
  console.log((percent * 100) + 1);
  songName.html(nameList[currentIndex]);
  songTime.html(((percent * 100) + 1).toFixed() + '%');
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
    buttonPlay.html("pause");
    setup(urlList[currentIndex]);
    setSong();
  } else if (audio.isPaused()) {
    buttonPlay.html("pause");
    audio.play();
  } else {
    audio.pause();
    buttonPlay.html("play_arrow");
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
      if (nameList[i] === listItem.html()) {
        currentIndex = i;
        playCurrentSound();
      }
    }
  }
  setSong();
}


//Playlist
function createPlaylist(playlistData) {
  let list = document.createElement('ul');
  let ntgr = "odd";

  for (var i = 0; i < playlistData.length; i++) {
    let songItem = document.createElement('li');
    if (ntgr === "odd") {
      songItem.classList.add('even');
      ntgr = "even";
    } else {
      songItem.classList.add('odd');
      ntgr = "odd";
    }
    if (i === 0) {
      songItem.classList.add('active');
    }
    
    let songUserHtml = `<p class="playlist-username"><a href="${playlistData[i].user.permalink_url}">${playlistData[i].user.username}</a></p>`;
    let songTitleHtml = `<p class="playlist-song-title">${playlistData[i].title}</p>`;

    songItem.innerHTML = songUserHtml + songTitleHtml;
    list.appendChild(songItem);
  }
  
  return list;
}


function setSong() {
  for (var i = 0; i < urlList.length; i++) {
    selectSound.children("li").removeClass('active');
    if (nameList[i] === nameList[currentIndex]) {
      selectSound.children("li").addClass('active');
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
    progressBar.val(audio.currentTime());
  }
}

function pauseEndSong() {
  console.log('set pauseEndSong');
}
