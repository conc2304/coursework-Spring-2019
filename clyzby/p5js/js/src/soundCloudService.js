//Variable
let urlList = [];
let tracks = [];
let currentIndex = 0;
let buttonPlay = $('#play');
let selectSound = $('#selectSound');
let songName = $('#songname');
let songTime = $('#songtime');
let loadingBar = $('#loadingBar');
let progressBar = $('#progressBar');
let list;
let fft;

$(() => {

  $('#play').click(() => {
    playCurrentSound();
  });

  $('#next').click(() => {
    changeSong(next, null);
  });

  $('#prev').click(() => {
    changeSong(prev, null);
  });

  $('#selectSound').click((e) => {
    let listItem = e.target;
    changeSong(select, listItem);
  });

  $('#progressBar').click((progbar) => {
    let percent = (progbar.offsetX / progbar.target.offsetWidth);
    audio.jump(audio.duration() * percent);
    audio.onended(endSong);
  });

});
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
    tracks = playlist.tracks || playlist;

    for (let i = 0; i < tracks.length; i++) {
      urlList.push(tracks[i].stream_url + '?client_id=' + CLIENT_ID);
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

  songName.html(tracks[currentIndex].title);
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
  audio = myp5.loadSound(loadsong, success, error, progress);
  fft = new p5.FFT();
  amplitude = new p5.Amplitude();
  peakDetect = new p5.PeakDetect(20,100);
  fft.setInput(audio);
  amplitude.setInput(audio);
}




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
  if (btn === select && listItem) {
    for (var i = 0; i < urlList.length; i++) {
      if (tracks[i].title === listItem.innerHTML) {
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
    
    let songUserHtml = `<p class="playlist-username"><a href="${playlistData[i].user.permalink_url}" target=""_blank">${playlistData[i].user.username}</a></p>`;
    let songTitleHtml = `<p class="playlist-song-title">${playlistData[i].title}</p>`;

    songItem.innerHTML = songUserHtml + songTitleHtml;
    list.appendChild(songItem);
  }
  
  return list;
}


function setSong() {
  selectSound.find("li").removeClass('active');
  for (var i = 0; i < urlList.length; i++) {
    if (tracks[i] === tracks[currentIndex]) {
      selectSound.find("li")[i].addClass('active');
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
