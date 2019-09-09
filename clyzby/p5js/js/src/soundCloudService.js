// //Variable
// var sound;
// var urlList = [];
// var nameList = [];
// var currentIndex = 0;
// var buttonPlay = $('#play');
// var buttonPrev = $('#prev');
// var buttonNext = $('#next');
// var selectSound = $('#selectSound');
// var songName = $('#songname');
// var songTime = $('#songtime');
// var loadingBar = $('#loadingBar');
// var progressBar = $('#progressBar');
// var seconds, minutes, bass, mid, treble, list, ntgr;
//
// //SoundCloud
// var CLIENT_ID = 'NmW1FlPaiL94ueEu7oziOWjYEzZzQDcK';
// var PLAYLIST_URL = 'https://soundcloud.com/clyzby/likes';
// // var PLAYLIST_URL = 'https://soundcloud.com/fftb/sets/party';
//
// SC.initialize({
//   client_id: CLIENT_ID
// });
// SC.resolve(PLAYLIST_URL).then(function(playlist){
//   for(var i=0;i<playlist.tracks.length;i++) {
//     urlList.push(playlist.tracks[i].stream_url + '?client_id=' + CLIENT_ID);
//     nameList.push(playlist.tracks[i].title);
//   }
//   selectSound.appendChild(createPlaylist(nameList));
// }).catch(function(error){
//   console.log(error);
// });
//
// //Buttons
// buttonPlay.addEventListener('click', function() {
//   playCurrentSound();
// }, false);
// buttonPrev.addEventListener('click', function() {
//   changeSong(prev);
// }, false);
// buttonNext.addEventListener('click', function() {
//   changeSong(next);
// }, false);
// selectSound.addEventListener('click', function(eve) {
//   listitem = eve.target;
//   changeSong(select);
// }, false);
// progressBar.addEventListener("click", function(progbar) {
//   var percent = (progbar.offsetX / this.offsetWidth);
//   sound.jump(sound.duration()*percent);
//   sound.onended(endSong);
// }, false);
//
// //loadSound callbacks
// function success() {
//   console.log('Sound is loaded : ' + sound.isLoaded());
//   sound.playMode('restart');
//   sound.play();
//   sound.onended(endSong);
// }
// function error(fail) {
//   console.log(fail);
// }
// function progress(percent) {
//   loadingBar.value = (percent*100) + 1;
//   console.log((percent*100) + 1);
//   songName.innerHTML = nameList[currentIndex];
//   songTime.innerHTML = ((percent*100) + 1).toFixed() + '%';
// }
//
// //Preload
// function preload() {
//
// }
//
// function touchStarted() {
//   if (getAudioContext().state !== 'running') {
//     getAudioContext().resume();
//   }
// }
//
// //Setup
// function setup(loadsong) {
//   sound = loadSound(loadsong, success, error, progress);
//   fft = new p5.FFT();
//   amplitude = new p5.Amplitude();
//   peakDetect = new p5.PeakDetect(20,100);
//   fft.setInput(sound);
//   amplitude.setInput(sound);
//   pixelDensity(1);
//   var cnv = createCanvas(document.getElementById('canvaswrapper').offsetWidth, document.getElementById('canvaswrapper').offsetHeight);
//   cnv.parent('canvaswrapper');
//   noFill();
// };
//
// //Draw
// function draw() {
//
//   clear();
//
//   seconds = Math.floor(sound.currentTime() % 60);
//   minutes = Math.floor(sound.currentTime() / 60);
//   if (sound.isLoaded() && !sound.isPaused()) {
//     songTime.innerHTML = ('0' + minutes).substr(-2) + ':' + ('0' + seconds).substr(-2);
//     progressBar.value = 100 * (sound.currentTime() / sound.duration());
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
// function playCurrentSound() {
//   if (!sound.isPlaying() && !sound.isPaused()) {
//     buttonPlay.id = "pause";
//     setup(urlList[currentIndex]);
//     setSong();
//   } else if (sound.isPaused()) {
//     buttonPlay.id = "pause";
//     sound.play();
//   } else {
//     sound.pause();
//     buttonPlay.id = "play";
//   }
// }
// function changeSong(btn) {
//   if (sound.isPaused()) {
//     sound.play();
//   }
//   sound.stop();
//   sound.onended(pauseEndSong);
//   if (btn == next) {
//     currentIndex = Math.min(currentIndex + 1, urlList.length - 1);
//     playCurrentSound();
//   }
//   if (btn == prev) {
//     currentIndex = Math.max(currentIndex - 1, 0);
//     playCurrentSound();
//   }
//   if (btn == select) {
//     for (var i=0;i<urlList.length;i++) {
//       if (nameList[i] == listitem.innerHTML) {
//         currentIndex = i;
//         playCurrentSound();
//       }
//     }
//   }
//   setSong();
// }
// //Playlist
// function createPlaylist(array) {
//   var list = document.createElement('ul');
//   for(var i = 0; i < array.length; i++) {
//     listitem = document.createElement('li');
//     if (ntgr == "odd") {
//       listitem.classList.add('even');
//       ntgr = "even";
//     } else {
//       listitem.classList.add('odd');
//       ntgr = "odd";
//     }
//     if (i == 0) {
//       listitem.classList.add('active');
//     }
//     listitem.appendChild(document.createTextNode(array[i]));
//     list.appendChild(listitem);
//   }
//   return list;
// }
// function setSong() {
//   for (var i=0;i<urlList.length;i++) {
//     selectSound.getElementsByTagName("li")[i].classList.remove('active');
//     if (nameList[i] == nameList[currentIndex]) {
//       selectSound.getElementsByTagName("li")[i].classList.add('active');
//     }
//   }
// }
// //endSong
// function endSong() {
//   if (!sound.isPaused() && (sound.currentTime() == '0' || sound.currentTime().toString().split(".")[0] == sound.duration().toString().split(".")[0])) {
//     if (currentIndex == (urlList.length - 1)) {
//       currentIndex = '0';
//     } else {
//       currentIndex = Math.min(currentIndex + 1, urlList.length - 1);
//     }
//     setup(urlList[currentIndex]);
//     setSong();
//     progressBar.value = sound.currentTime();
//   }
// }
// function pauseEndSong() {
//   console.log('set pauseEndSong');
// }
