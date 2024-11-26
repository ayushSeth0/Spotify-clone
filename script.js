let currentSong = new Audio();
let currFolder;
let songs;

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder) {
  currFolder = folder;
  let a = await fetch(`/${folder}/`);
  console.log(a);
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3") || element.href.endsWith(".m4a"))
      songs.push(element.href.split(`/${folder}/`)[1]);
  }
  let Songul = document.querySelector(".songs").getElementsByTagName("ul")[0];
  Songul.innerHTML = " ";
  for (const song of songs) {
    Songul.innerHTML += `<li><img src="Images/music.svg" alt="">
    <div class="info">
        <div>${song.replaceAll("%20", " ")}</div>
        <div>Yug</div>
    </div>
    <div class="playme">
        Play Now
        <img src="Images/play.svg" alt="" style="filter:invert(1);cursor:pointer">
    </div>
    </li>`;
  }

  Array.from(
    document.querySelector(".songs").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playmusic(e.querySelector(".info").firstElementChild.innerHTML);
    });
  });
  return songs;
}

const playmusic = (track, pause = false) => {
  //   var audio = new Audio("/Songs/"+track);
  currentSong.src = `/${currFolder}/ ` + track;
  currentSong.src = currentSong.src.replace("%20", "");

  if (!pause) {
    currentSong.play();
    play.src = "Images/pause.svg";
  }
  document.querySelector(".songname").innerHTML = decodeURI(track);
  document.querySelector(".duration").innerHTML = "00:00/00:00";
};

async function DisplayCard() {
  let a = await fetch(`/Songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;

  let anchor = div.getElementsByTagName("a");
  let cardcollection = document.querySelector(".cardcollection");
  let array = Array.from(anchor);

  for (let index = 0; index < array.length; index++) {
    const e = array[index];

    if (e.href.includes("/Songs/") && !e.href.includes(".htacces")) {
      let folder = e.href.split("/").slice(-1)[0];

      let a = await fetch(`/Songs/${folder}/info.json`);
      let response = await a.json();

      cardcollection.innerHTML =
        cardcollection.innerHTML +
        ` <div data-folder="${folder}" class="spotifycard">
      <div class="play">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 20V4L19 12L5 20Z"
            stroke="#141B34"
            fill="#000"
            stroke-width="1.5"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <img src="/Songs/${folder}/cover.jpg" alt="" />
      <h2>${response.title}</h2>
      <h4>${response.description}</h4>
    </div>`;
    }
  }
  Array.from(document.getElementsByClassName("spotifycard")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      songs = await getsongs(`Songs/${item.currentTarget.dataset.folder}`);
      playmusic(songs[0]);
    });
  });
}

async function main() {
  songs = await getsongs("Songs/Mood");

  playmusic(songs[0], true);
  await DisplayCard();
  //   var audio = new Audio(songs[0]);
  //   audio.play;

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "Images/pause.svg";
    } else {
      currentSong.pause();
      play.src = "Images/play.svg";
    }
  });
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".duration").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )}/${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = 0;
  });
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = -100 + "%";
  });

  previous.addEventListener("click", () => {
    let current = currentSong.src.split(`/${currFolder}/`)[1];
    if (current == songs[0]) {
      let n = songs.length;
      playmusic(songs[n - 1]);
    } else {
      for (let index = 1; index < songs.length; index++) {
        const element = songs[index];
        if (element == current) {
          playmusic(songs[index - 1]);
        }
      }
    }
  });
  nextone.addEventListener("click", () => {
    let current = currentSong.src.split(`/${currFolder}/`)[1];
    let n = songs.length;
    if (current == songs[n - 1]) {
      playmusic(songs[0]);
    } else {
      for (let index = 0; index < songs.length; index++) {
        const element = songs[index];
        if (element == current) {
          playmusic(songs[index + 1]);
        }
      }
    }
  });

  document
    .querySelector(".songtime")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentSong.volume = parseInt(e.target.value) / 100;
      if (e.target.value == 0) {
        volume.src = "Images/mute.svg";
      } else {
        volume.src = "Images/volume.svg";
      }
    });
  document.querySelector(".volumes>img").addEventListener("click", (e) => {
    console.log(e.target);
    if (e.target.src.includes("volume.svg")) {
      e.target.src = e.target.src.replace("volume.svg", "mute.svg");
      currentSong.volume = 0;
      document
        .querySelector(".volumes")
        .getElementsByTagName("input")[0].value = 0;
    } else {
      e.target.src = e.target.src.replace("mute.svg", "volume.svg");
      currentSong.volume = 0.1;
      document
        .querySelector(".volumes")
        .getElementsByTagName("input")[0].value = 10;
    }
  });
}

main();
