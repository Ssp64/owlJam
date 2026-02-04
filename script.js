const audio = document.getElementById("audio");
const grid = document.getElementById("album-grid");
const queueList = document.getElementById("queue-list");

const cover = document.getElementById("player-cover");
const title = document.getElementById("player-title");
const artist = document.getElementById("player-artist");

const playBtn = document.getElementById("play");
const playIcon = document.getElementById("play-icon");

const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const shuffleBtn = document.getElementById("shuffle");

const progress = document.getElementById("progress");


/* SONG DATA */

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

let queue = [...songs];
let current = 0;

const volumeSlider = document.getElementById("volume-slider");
const volumeIcon = document.getElementById("volume-icon");
audio.volume = 1;
volumeSlider.addEventListener("input", () => {

audio.volume = volumeSlider.value;

/* ICON FEEDBACK */

if(audio.volume == 0){

volumeIcon.className = "fa-solid fa-volume-xmark";

}
else if(audio.volume < 0.5){

volumeIcon.className = "fa-solid fa-volume-low";

}
else{

volumeIcon.className = "fa-solid fa-volume-high";

}

});
volumeIcon.onclick = () => {

if(audio.volume > 0){

audio.dataset.lastVolume = audio.volume;
audio.volume = 0;
volumeSlider.value = 0;
volumeIcon.className = "fa-solid fa-volume-xmark";

}else{

audio.volume = audio.dataset.lastVolume || 1;
volumeSlider.value = audio.volume;
volumeIcon.className = "fa-solid fa-volume-high";

}

};

/* BUILD GRID */

songs.forEach((song,index)=>{

const div=document.createElement("div");
div.className="album";

div.innerHTML=`
<img src="${song.image}">
<div class="play-btn">
<i class="fa-solid fa-play"></i>
</div>
<strong>${song.title}</strong>
<div style="color:#b3b3b3;font-size:14px">${song.name}</div>
`;

div.onclick=()=>{
queue=[...songs];
current=index;
buildQueue();
loadSong();
playSong();
};

grid.appendChild(div);

});


/* BUILD QUEUE (KEY FIX) */

function buildQueue(){

queueList.innerHTML="";

queue.forEach((song,index)=>{

const li=document.createElement("li");
li.textContent=song.title;

li.onclick=()=>{
current=index;
loadSong();
playSong();
};

queueList.appendChild(li);

});

highlightQueue();
}

buildQueue();


/* HIGHLIGHT */

function highlightQueue(){

[...queueList.children].forEach((li,i)=>{
li.classList.toggle("active",i===current);
});

}


/* LOAD */

function loadSong(){

const s=queue[current];

audio.src=s.source;
cover.src=s.image;
title.textContent=s.title;
artist.textContent=s.name;

document.body.style.background=
`linear-gradient(rgba(0,0,0,.75),rgba(0,0,0,.95)),
url(${s.image}) center/cover`;

highlightQueue();

}

loadSong();


/* PLAY */

function playSong(){
audio.play();
playIcon.classList.replace("fa-play","fa-pause");
}

function pauseSong(){
audio.pause();
playIcon.classList.replace("fa-pause","fa-play");
}

playBtn.onclick=()=>{
audio.paused ? playSong() : pauseSong();
};


/* NEXT / PREV */

nextBtn.onclick=()=>{
current=(current+1)%queue.length;
loadSong();
playSong();
};

prevBtn.onclick=()=>{
current=(current-1+queue.length)%queue.length;
loadSong();
playSong();
};


/* SHUFFLE (REAL FIX) */

shuffleBtn.onclick=()=>{

queue=[...songs].sort(()=>Math.random()-0.5);
current=0;

buildQueue();
loadSong();
playSong();

};


/* PROGRESS */

audio.addEventListener("timeupdate",()=>{
progress.value=audio.currentTime;
});

audio.addEventListener("loadedmetadata",()=>{
progress.max=audio.duration;
});

progress.oninput=()=>{
audio.currentTime=progress.value;
};


/* AUTO NEXT */

audio.addEventListener("ended",()=>{
nextBtn.click();
});
