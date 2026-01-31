const progress = document.getElementById("progress");
const song = document.getElementById("song");
const controlIcon = document.getElementById("controlIcon");
const playPauseButton = document.querySelector(".play-pause-btn");
const forwardButton = document.querySelector(".controls button.forward");
const backwardButton = document.querySelector(".controls button.backward");
const songName = document.getElementById("song-title");
const artistName = document.getElementById("artist-name");
const songList = document.getElementById("song-list");
const backgroundCanvas = document.getElementById("background-visualizer");
const backgroundCtx = backgroundCanvas.getContext("2d");
const loopButton = document.querySelector(".controls button.loop");
const shuffleButton = document.querySelector(".controls button.shuffle");
const volumeControl = document.getElementById("volumeControl");
const albumo = document.getElementsByClassName("album-cover")

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
const source = audioCtx.createMediaElementSource(song);
source.connect(analyser);
analyser.connect(audioCtx.destination);
analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

const canvasLeft = document.getElementById("visualizer-left");
const canvasRight = document.getElementById("visualizer-right");
const canvasLeftCtx = canvasLeft.getContext("2d");
const canvasRightCtx = canvasRight.getContext("2d");
backgroundCanvas.width = window.innerWidth;
backgroundCanvas.height = window.innerHeight;
canvasLeft.width = 10;
canvasLeft.height = window.innerHeight;
canvasRight.width = 10;
canvasRight.height = window.innerHeight;
let splashColors = ['#00FFFF', '#FFFFFF'];
let splashColorIndex = 0;
const songs = [
  {title: "Choo Lo", name: "Local Train", source:"songs/Song12.mp3",image:"Photo/choolo.jpg"},
  { title: "Ale", name: "Antara Mitra", source: "songs/Song2.mp3",image:"Photo/ale.jpg"},
  { title: "Illahi", name: "Arijit Singh", source: "songs/Song3.mp3",image:"Photo/Ilahi.jpg" },
  { title: "Pee Loon", name: "Pritam, Mohit Chauhaan", source: "songs/Song4.mp3",image:"Photo/plu.jpg" },
  { title: "Raat Bhar", name: "Arijit Singh, Shreya Ghoshal", source: "songs/Song5.mp3",image:"Photo/rtbr.jpg" },
  { title: "Iktara", name: "Kavita Seth", source: "songs/Song6.mp3",image:"Photo/113.jpg" },
  { title: "Safarnama", name: "Lucky Ali", source: "songs/Song7.mp3",image:"Photo/fe.jpg" },
  {title: "Beedi Jalaile", name:"Sukwinder,Sunidhi Chauhaan", source:"songs/Song8.mp3",image:"Photo/hq2.jpg"},
  {title: "Bheege Hont", name: "Kushal Ganjawala", source:"songs/Song9.mp3",image:"Photo/OIP.jpg"},
  {title: "Sacch Keh raha hai", name: "K.K.", source:"songs/Song10.mp3",image:"Photo/kk.jpg"},
  {title: "Sawariyaan", name: "Monty Sharma", source:"songs/Song11.mp3",image:"Photo/dfe.jpg"},
  { title: "Prem ki Naiyaan", name: "Neeraj Shridhar", source: "songs/Song13.mp3",image:"Photo/neya.png" },
  { title: "Khudaya Khair", name: "Pritam", source: "songs/Song14.mp3",image:"Photo/KKK.jpg" },
  { title: "Khabar Nahi", name: "Vishal Dadlani", source: "songs/Song15.mp3",image:"Photo/kbr.jpg" },
  { title: "Kabira", name: "Pritam", source: "songs/Song16.mp3",image:"Photo/ss5.jpg" },
  { title: "Tum Saath Ho", name: "Arijit Singh, Alka Yagnik", source: "songs/Song17.mp3",image:"Photo/fe.jpg" },
  { title: "Aaj Kal Jindagi", name: "Shankar-Ehsaan-Loy", source: "songs/Song18.mp3",image:"Photo/dwdw.jpg" },
  { title: "Te Amo", name: "Sunidhi Chawhaan, Pritam", source: "songs/Song1.mp3",image:"Photo/fef.jpg" }
];

let currentSongIndex = 0;
let isLooping = false;

function updateSongList() {
  songList.innerHTML = "";
  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${song.title} - ${song.name}`;
    li.dataset.index = index;
    if (index === currentSongIndex) {
      li.classList.add("current-song");
    }
    songList.appendChild(li);
  });
  songList.querySelectorAll("li").forEach(item => {
    item.addEventListener("click", function() {
      const index = this.dataset.index;
      currentSongIndex = parseInt(index);
      updateSongInfo();
      playSong();
    });
  });
}

function pauseSong() {
  song.pause();
  controlIcon.classList.remove("fa-pause");
  controlIcon.classList.add("fa-play");
}
function playSong() {
  song.play();
  controlIcon.classList.add("fa-pause");
  controlIcon.classList.remove("fa-play");
}

function playPause() {
  if (song.paused) {
    playSong();
  } else {
    pauseSong();
  }
}
const songz = document.getElementById("song");
const albumImage = document.getElementById("album-image");

songz.addEventListener("play", () => {
  albumImage.classList.add("rotating");
});

songz.addEventListener("pause", () => {
  albumImage.classList.remove("rotating");
});

songz.addEventListener("ended", () => {
  albumImage.classList.remove("rotating");
});

function toggleLoop() {
  isLooping = !isLooping;
  song.loop = isLooping;
  loopButton.classList.toggle("active", isLooping);
}

function updateVolume() {
  song.volume = volumeControl.value;
}
volumeControl.addEventListener("input", updateVolume);
song.volume = volumeControl.value;
console.log("Initial volume set to: ", song.volume);

function shuffleSongs() {
  for (let i = songs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [songs[i], songs[j]] = [songs[j], songs[i]];
  }
  currentSongIndex = 0;
  updateSongInfo();
}

function nextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  updateSongInfo();
  playSong();
}

function previousSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  updateSongInfo();
  playSong();
}

song.addEventListener("timeupdate", function () {
  if (!song.paused) {
    progress.value = song.currentTime;
  }
});

song.addEventListener("loadedmetadata", function () {
  progress.max = song.duration;
  progress.value = song.currentTime;
});

song.addEventListener("ended", function() {
  if (isLooping) {
    song.currentTime = 0;
    playSong();
  } else {
    nextSong();
  }
});

playPauseButton.addEventListener("click", playPause);
progress.addEventListener("input", function () {
  song.currentTime = progress.value;
});
progress.addEventListener("change", function () {
  playSong();
});
forwardButton.addEventListener("click", nextSong);
backwardButton.addEventListener("click", previousSong);
shuffleButton.addEventListener("click", shuffleSongs);
loopButton.addEventListener("click", toggleLoop);

function drawVisualizer() {
  requestAnimationFrame(drawVisualizer);
  analyser.getByteFrequencyData(dataArray);
  canvasLeftCtx.clearRect(0, 0, canvasLeft.width, canvasLeft.height);
  canvasRightCtx.clearRect(0, 0, canvasRight.width, canvasRight.height);
  const barHeight = 8;
  const barWidth = 1;
  const barSpacing = 2;
  const barCount = canvasLeft.height / (barHeight + barSpacing);
  const gradientLeft = canvasLeftCtx.createLinearGradient(0, 0, 0, canvasLeft.height);
  gradientLeft.addColorStop(0, 'rgba(0, 255, 255, 1)');
  gradientLeft.addColorStop(0.5, 'rgba(255, 255, 255, 1)');
  gradientLeft.addColorStop(1, 'rgba(0, 255, 255, 1)');
  const gradientRight = canvasRightCtx.createLinearGradient(0, 0, 0, canvasRight.height);
  gradientRight.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradientRight.addColorStop(0.5, 'rgba(0, 255, 255, 1)');
  gradientRight.addColorStop(1, 'rgba(255, 255, 255, 1)');
  for (let i = 0; i < bufferLength; i++) {
    const barLength = dataArray[i] * (canvasLeft.width / 256);
    const y = i * (barHeight + barSpacing);
    canvasLeftCtx.fillStyle = gradientLeft;
    canvasLeftCtx.fillRect(0, y, barLength, barHeight);
    canvasRightCtx.save();
    canvasRightCtx.translate(canvasRight.width, 0);
    canvasRightCtx.scale(-1, 1);
    canvasRightCtx.fillStyle = gradientRight;
    canvasRightCtx.fillRect(0, y, barLength, barHeight);
    canvasRightCtx.restore();
  }
}

song.addEventListener("play", function () {
  audioCtx.resume().then(() => {
    drawVisualizer();
  });
});

updateSongInfo();

song.addEventListener('timeupdate', function () {
  const progressPercentage = (song.currentTime / song.duration) * 100;
  progress.style.background = `linear-gradient(to right, rgb(0, 195, 255) ${progressPercentage}%, rgb(4, 14, 82, 0.863) ${progressPercentage}%)`;
  if (!song.paused) {
    progress.value = song.currentTime;
  }
});
const primaryColors = [
  'rgb(0, 195, 255)',
  'rgb(255, 0, 0)',
  'rgb(45,255,10)',
  'rgb(255,255,0)',
  'rgb(206,56,255)',
  'rgb(255, 255, 255)',
  'rgb(223, 142, 0 )'
];
const backgroundColors = [
  'rgb(4, 14, 82, 0.863)', 
  'rgb(93,0,0)',
  'rgb(14,90,1)',  
  'rgb(165,155,0)',   
  'rgb(89,2,117)',
  'rgb(171,171,171)',
  'rgb(146, 122, 80)' 
];
let currentColorIndex = 0;
function updateProgressBar() {
  const progressPercentage = (song.currentTime / song.duration) * 100;
  const primaryColor = primaryColors[currentColorIndex];
  const backgroundColor = backgroundColors[currentColorIndex];
  progress.style.background = `linear-gradient(to right, ${primaryColor} ${progressPercentage}%, ${backgroundColor} ${progressPercentage}%)`;
  progress.style.boxShadow = `0 0 10px 2px ${primaryColor}`;
}
song.addEventListener('timeupdate', function () {
  const progressPercentage = (song.currentTime / song.duration) * 100;
  const primaryColor = primaryColors[currentColorIndex];
  const backgroundColor = backgroundColors[currentColorIndex];
  progress.style.background = `linear-gradient(to right, ${primaryColor} ${progressPercentage}%, ${backgroundColor} ${progressPercentage}%)`;
  if (!song.paused) {
    progress.value = song.currentTime;
  }
  updateProgressBar();
});

const handle = document.querySelector(".handle");
handle.addEventListener("click", function () {
  currentColorIndex = (currentColorIndex + 1) % primaryColors.length;
  const progressPercentage = (song.currentTime / song.duration) * 100;
  const newPrimaryColor = primaryColors[currentColorIndex];
  const newBackgroundColor = backgroundColors[currentColorIndex];
  progress.style.background = `linear-gradient(to right, ${newPrimaryColor} ${progressPercentage}%, ${newBackgroundColor} ${progressPercentage}%)`;
  updateProgressBar();
});
document.addEventListener("keydown", function(event) {
  if (event.code === "Space" && !event.target.matches("input, textarea")) {
    event.preventDefault();
    playPause();
  }
});
function updateSongInfo() {
  songName.textContent = songs[currentSongIndex].title;
  artistName.textContent = songs[currentSongIndex].name;
  song.src = songs[currentSongIndex].source;
  document.getElementById("album-image").src = songs[currentSongIndex].image;
  updateSongList();
}
