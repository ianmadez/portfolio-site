// AudioManager module. Exposes window.AudioManager for global access.
window.AudioManager = {
  ctx: null,
  reverbNode: null,
  sfxGain: null,

  bootNoise: new Audio('assets/audio/ps2noise.mp3'),
  bgmBios: new Audio('assets/audio/bios-music.mp3'),
  bgmBrowser: new Audio('assets/audio/browser-noise.mp3'),

  init: function () {
    if (this.ctx) {
      if (this.ctx.state === "suspended") this.ctx.resume();
      return;
    }

    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = 0.7;

    this.reverbNode = this.ctx.createConvolver();
    const sampleRate = this.ctx.sampleRate;
    const length = sampleRate * 1.5;
    const impulse = this.ctx.createBuffer(2, length, sampleRate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const decay = Math.exp(-i / (sampleRate * 0.3));
      left[i] = (Math.random() * 2 - 1) * decay;
      right[i] = (Math.random() * 2 - 1) * decay;
    }

    this.reverbNode.buffer = impulse;

    this.sfxGain.connect(this.reverbNode);
    this.reverbNode.connect(this.ctx.destination);
    this.sfxGain.connect(this.ctx.destination);

    this.bootNoise.preload = "auto";
    this.bgmBios.preload = "auto";
    this.bgmBrowser.preload = "auto";

    this.bgmBios.loop = true;
    this.bgmBrowser.loop = true;
    this.bgmBrowser.volume = 0.3;
  },

  isMuted: false,

  setMuted: function (mute) {
    this.isMuted = mute;
    this.bootNoise.muted = mute;
    this.bgmBios.muted = mute;
    this.bgmBrowser.muted = mute;
    if (this.sfxGain) {
      this.sfxGain.gain.value = mute ? 0 : 0.7;
    }
  },

  playSFX: function (audioFileUrl) {
    if (this.isMuted) return;

    if (window.location.protocol === "file:") {
      const fallbackSound = new Audio(audioFileUrl);
      fallbackSound.volume = 0.75;
      fallbackSound.play().catch(err => console.error("SFX fallback error:", err));
      return;
    }

    if (!this.ctx) return;

    fetch(audioFileUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Missing SFX file: ${audioFileUrl}`);
        }
        return response.arrayBuffer();
      })
      .then(data => this.ctx.decodeAudioData(data))
      .then(buffer => {
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(this.sfxGain);
        source.start(0);
      })
      .catch(err => console.error("SFX Error:", err));
  },

  playBootNoise: function () {
    this.bootNoise.currentTime = 0;
    this.bootNoise.play().catch(err => console.warn("Boot audio blocked:", err));
  },

  setBGMState: function (state) {
    if (state === "BIOS") {
      this.bgmBrowser.pause();
      this.bgmBios.loop = true;
      this.bgmBios.volume = 0.55;

      if (this.bgmBios.paused) {
        this.bgmBios.play().catch(err => console.warn("BIOS music blocked:", err));
      }

      return;
    }

    if (state === "BROWSER_AREA") {
      this.bgmBios.pause();
      this.bgmBrowser.loop = true;
      this.bgmBrowser.volume = 0.35;

      if (this.bgmBrowser.paused) {
        this.bgmBrowser.currentTime = 0;
        this.bgmBrowser.play().catch(err => console.warn("Browser noise blocked:", err));
      }

      return;
    }

    if (state === "SILENCE") {
      this.bgmBios.pause();
      this.bgmBrowser.pause();
      return;
    }
  }
};
