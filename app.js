const NUMBER_OF_PADS = 8;
const KICK_MUTE_INDEX = "0";
const SNARE_MUTE_INDEX = "1";
const HIHAT_MUTE_INDEX = "2";

class DrumKit {
  constructor() {
    this.pads = document.querySelectorAll(".pad");
    this.playButton = document.querySelector(".play");
    this.currentKick = "./sounds/kick-classic.wav";
    this.currentSnare = "./sounds/snare-acoustic01.wav";
    this.currentHihat = "./sounds/hihat-acoustic01.wav";
    this.kickAudio = document.querySelector(".kick-sound");
    this.snareAudio = document.querySelector(".snare-sound");
    this.hihatAudio = document.querySelector(".hihat-sound");
    this.index = 0;
    this.bpm = 150;
    this.isPlaying = null;
    this.selects = document.querySelectorAll("select");
    this.muteBtns = document.querySelectorAll(".mute");
    this.tempoSlider = document.querySelector(".tempo-slider");
  }

  activePad() {
    this.classList.toggle("active");
  }

  repeat() {
    let steps = this.index % NUMBER_OF_PADS;
    const activeBars = document.querySelectorAll(`.b${steps}`);

    // Loop over the pads
    activeBars.forEach((bar) => {
      bar.style.animation = `playTrack 0.3s alternate ease-in-out 2`;

      // check if pads are active, if so, play sound
      if (bar.classList.contains("active")) {
        // Check each sound type
        if (bar.classList.contains("kick-pad")) {
          // the audio doesn't play until it finished, that's why reset the currentTime to 0
          this.kickAudio.currentTime = 0;
          this.kickAudio.play();
        }

        if (bar.classList.contains("snare-pad")) {
          this.snareAudio.currentTime = 0;
          this.snareAudio.play();
        }

        if (bar.classList.contains("hihat-pad")) {
          this.hihatAudio.currentTime = 0;
          this.hihatAudio.play();
        }
      }
    });

    this.index++;
  }

  start() {
    const interval = (60 / this.bpm) * 1000;
    if (!this.isPlaying) {
      this.isPlaying = setInterval(() => {
        this.repeat();
      }, interval);
    } else {
      clearInterval(this.isPlaying);
      this.isPlaying = null;
    }
  }

  updateButton() {
    if (!this.isPlaying) {
      this.playButton.innerHTML = `<i class="fas fa-stop"></i>`;
      this.playButton.classList.remove("play-active");
      this.playButton.classList.add("stop-active");
    } else {
      this.playButton.innerHTML = `<i class="fas fa-play"></i>`;
      this.playButton.classList.add("play-active");
      this.playButton.classList.remove("stop-active");
    }
  }

  changeSound(e) {
    const selectionName = e.target.name;
    const selectionValue = e.target.value;
    switch (selectionName) {
      case "kick-select":
        this.kickAudio.src = selectionValue;
        break;
      case "snare-select":
        this.snareAudio.src = selectionValue;
        break;
      case "hihat-select":
        this.hihatAudio.src = selectionValue;
        break;
    }
  }

  mute(e) {
    const muteIndex = e.target.getAttribute("data-track");
    e.target.classList.toggle("active");
    if (e.target.classList.contains("active")) {
      switch (muteIndex) {
        case KICK_MUTE_INDEX:
          this.kickAudio.volume = 0;
          break;
        case SNARE_MUTE_INDEX:
          this.snareAudio.volume = 0;
          break;
        case HIHAT_MUTE_INDEX:
          this.hihatAudio.volume = 0;
          break;
      }
    } else {
      switch (muteIndex) {
        case KICK_MUTE_INDEX:
          this.kickAudio.volume = 1;
          break;
        case SNARE_MUTE_INDEX:
          this.snareAudio.volume = 1;
          break;
        case HIHAT_MUTE_INDEX:
          this.hihatAudio.volume = 1;
          break;
      }
    }
  }

  changeTempo(e) {
    const tempoText = document.querySelector(".tempo-nr");
    this.bpm = e.target.value;
    tempoText.innerText = e.target.value;
  }

  updateTempo() {
    clearInterval(this.isPlaying);
    this.isPlaying = null;
    const playBtn = document.querySelector(".play");
    if (!playBtn.classList.contains("play-active")) {
      this.start();
    }
  }
}

const drumKit = new DrumKit();

// Event Listeners
drumKit.pads.forEach((pad) => {
  pad.addEventListener("click", drumKit.activePad);
  pad.addEventListener("animationend", function () {
    this.style.animation = "";
  });
});

drumKit.playButton.addEventListener("click", function () {
  drumKit.updateButton();
  drumKit.start();
});

drumKit.selects.forEach((select) => {
  select.addEventListener("change", function (e) {
    drumKit.changeSound(e);
  });
});

drumKit.muteBtns.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    drumKit.mute(e);
  });
});

// event input runs dynamically with the tempo slider moves
drumKit.tempoSlider.addEventListener("input", function (e) {
  drumKit.changeTempo(e);
});

// event type change means it triggers when the slider stops
drumKit.tempoSlider.addEventListener("change", function (e) {
  drumKit.updateTempo(e);
});
