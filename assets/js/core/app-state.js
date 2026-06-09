// AppState module. Exposes window.AppState for global state tracking.
window.AppState = {
  screen: "BOOT",
  browserSelection: "browser",
  selectedSaveIndex: 0,
  selectedProjectOptionIndex: 0,
  selectedSystemConfigIndex: 0,
  systemConfigEditing: false,
  systemConfigValues: {},

  setScreen(nextScreen) {
    this.screen = nextScreen;
    document.body.dataset.screen = nextScreen;
  },

  setBrowserSelection(nextSelection, playSound = true) {
    if (this.browserSelection === nextSelection) return;

    this.browserSelection = nextSelection;

    if (typeof window.updateBrowserSelection === "function") {
      window.updateBrowserSelection();
    }

    if (playSound) {
      window.AudioManager.playSFX("assets/audio/sfx/tick.mp3");
    }
  }
};
