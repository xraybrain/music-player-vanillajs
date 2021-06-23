let progressBar = document.querySelector('.progress-bar');
let progress = document.querySelector('.progress');
let playBtn = document.querySelector('#play-btn');
let pauseBtn = document.querySelector('#pause-btn');
let prevBtn = document.querySelector('#prev-btn');
let nextBtn = document.querySelector('#next-btn');
let fileDropZone = document.querySelector('#file-drop-zone');
let playList = [];
let playIndex = 0;
let currentTime = 0;
let allowedFormats = ['audio/mpeg'];
let audioPlayer = document.querySelector('#audio-player');
let title = document.querySelector('.title');
let playListMenu = document.querySelector('#play-list-menu');
let fileLoader = document.querySelector('#file-loader');
let volume = document.querySelector('.volume');
let volumeBar = document.querySelector('.volume-bar');
let volumeUp = document.querySelector('#volume-up');
let volumeMute = document.querySelector('#volume-mute');

setVolume(audioPlayer.volume);

/**
 * 
 */
function addToPlayListMenu(title) {
  let index = playList.length - 1;
  let label = document.createElement('label');
  label.textContent = title;
  label.attributes['data-id'] = index;
  label.addEventListener('click', playFromPlayListMenu);
  playListMenu.appendChild(label);
}

function addToPlayList(files) {
  let index = 1;
  for (let file of files) {
    let isAllowed = audioPlayer.canPlayType(file.type);
    if (isAllowed) {
      let reader = new FileReader();
      reader.addEventListener('load', (event) => {
        let data = event.target.result;
        let media = {
          data,
          title: file.name
        }

        playList.push(media);
        addToPlayListMenu(media.title)
        if (index === files.length) play();
      });
      reader.readAsDataURL(file);
    }
    ++index;
  }
}

function playFromPlayListMenu(event) {
  event.preventDefault();
  let index = event.target.attributes['data-id'];
  playIndex = index;
  audioPlayer.currentTime = 0;
  play(event);
}

/**
 * Player navigation buttons
 */
function play() {
  if (playList.length == 0) return;
  let media = playList[playIndex];
  playBtn.classList.add('hide');
  pauseBtn.classList.remove('hide');

  if (audioPlayer.currentTime == 0) {
    audioPlayer.src = media.data;
    title.textContent = media.title;
  }
  audioPlayer.play();
}

function pause(event) {
  event.preventDefault();

  playBtn.classList.remove('hide');
  pauseBtn.classList.add('hide');
  audioPlayer.pause();
}

function prev(event) {
  event.preventDefault();

  if (playList.length < 0) return;
  audioPlayer.currentTime = 0;
  --playIndex;
  if (playIndex < 0) playIndex = playList.length - 1;
  play();
}

function next(event) {
  event.preventDefault();

  if (playList.length < 0) return;
  audioPlayer.currentTime = 0;
  ++playIndex;
  if (playIndex > playList.length - 1) playIndex = 0;
  play();
}

function seek(event) {
  event.preventDefault();
  if (audioPlayer.paused) return;

  let width = this.offsetWidth;
  let xPos = event.offsetX;
  let currentTime = (xPos / width) * audioPlayer.duration;
  audioPlayer.currentTime = currentTime;
}


function setVolume(rate) {
  if (rate < 0) return;
  if (rate == 0) {
    volumeMute.classList.remove('hide');
    volumeUp.classList.add('hide');
  } else {
    volumeMute.classList.add('hide');
    volumeUp.classList.remove('hide');
  }
  audioPlayer.volume = rate;
  volume.style.height = `${rate * 100}%`
}

/**
 * Event Handlers
 */
function dragOverHandler(event) {
  event.preventDefault();
}

function dropHandler(event) {
  event.preventDefault();
  let files = event.dataTransfer.files;
  addToPlayList(files);
}

function progressHandler(event) {
  let currentTime = audioPlayer.currentTime;
  let duration = audioPlayer.duration;
  let percent = (currentTime / duration) * 100;
  progress.style.width = `${percent}%`;
  if (percent === 100) next(event);
}

function fileLoaderHandler(event) {
  addToPlayList(this.files);
}

function changeVolumeHandler(event) {
  let height = this.offsetHeight;
  let yPos = event.offsetY;

  setVolume(yPos / height);
}
/**
 * Register Events
 */

fileDropZone.addEventListener('dragover', dragOverHandler);
fileDropZone.addEventListener('drop', dropHandler);
fileDropZone.addEventListener('dragenter', () => console.log('enter'));

playBtn.addEventListener('click', play);
pauseBtn.addEventListener('click', pause);
nextBtn.addEventListener('click', next);
prevBtn.addEventListener('click', prev);

audioPlayer.addEventListener('timeupdate', progressHandler);

progressBar.addEventListener('click', seek);
progress.addEventListener('drag', seek);

fileLoader.addEventListener('change', fileLoaderHandler);

volumeBar.addEventListener('click', changeVolumeHandler);