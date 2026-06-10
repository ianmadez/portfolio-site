// ==========================================
// PHASE 2E: HYBRID NETWORK CONFIG SCREEN
// ==========================================

const NETWORK_LINKS = [
    { id: "gh", title: "GitHub", icon: "assets/images/ui/gh.png", url: "https://github.com/ianmadez" },
    { id: "x", title: "X", icon: "assets/images/ui/tw.png", url: "https://x.com/spacethaMenace" },
    { id: "ig", title: "Instagram", icon: "assets/images/ui/ig.png", url: "https://instagram.com/deadspace.wav" },
    { id: "email", title: "Email", icon: "assets/images/ui/email.png", url: "mailto:ianmadekufamba@gmail.com" },
    { id: "wa", title: "WhatsApp", icon: "assets/images/ui/wh.png", url: "https://wa.me/60163170924" },
];

window.createNetworkConfigScreen = function () {
    let screen = document.getElementById("network-config-screen");
    if (screen) return screen;

    screen = document.createElement("section");
    screen.id = "network-config-screen";
    screen.className = "project-detail-screen hidden"; // Inherit absolute positioning

    screen.innerHTML = `
    <div class="project-detail-panel"> <div class="project-detail-copy" style="top: 10%; left: 0; right: 0; position: absolute;">
        <div class="project-memory-label">Memory Card (PS2)/1</div>
        <h1 id="project-detail-title" style="font-size: clamp(1.6rem, 3.5vw, 3.5rem);">Network Config</h1>
        <h2 id="network-dynamic-subtitle" style="margin-top: 5px;">Select a Node</h2>
      </div>

      <div id="network-grid-wrapper" class="memory-save-grid-wrapper" style="top: 35%; bottom: 18%;">
        <div id="network-grid" class="memory-save-grid" aria-label="Network saves">
            <img src="assets/images/ui/halo.png" class="memory-save-selector" id="network-selector" alt="" aria-hidden="true">
            ${NETWORK_LINKS.map((link, index) => `
              <button class="memory-save-item" data-network-index="${index}" type="button" aria-label="${link.title}">
                <img src="${link.icon}" class="memory-save-icon" alt="">
                <span class="memory-save-label" style="color: rgba(245,245,245,0.9);">${link.title}</span>
              </button>
            `).join("")}
        </div>
      </div>

      <div class="project-detail-footer">
        <button class="project-footer-item" data-command="CONFIRM" type="button">
          <img src="assets/images/ui/ex.png" class="footer-button-icon" alt="Cross">
          <span>Connect</span>
        </button>
        <button class="project-footer-item" data-command="BACK" type="button">
          <img src="assets/images/ui/circle.png" class="footer-button-icon" alt="Circle">
          <span>Back</span>
        </button>
      </div>
    </div>
  `;

    document.getElementById("boot-container").appendChild(screen);
    return screen;
};

window.updateNetworkSelection = function (playSound = true) {
    const items = [...document.querySelectorAll("#network-grid .memory-save-item")];
    const selector = document.getElementById("network-selector");
    if (!items.length || !selector) return;

    const activeIndex = window.AppState.selectedNetworkIndex || 0;
    const active = items[activeIndex];
    const link = NETWORK_LINKS[activeIndex];

    items.forEach((item, index) => {
        const isActive = index === activeIndex;
        item.classList.toggle("active", isActive);
    });

    // Move Halo
    const gridRect = document.getElementById("network-grid").getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    const x = activeRect.left - gridRect.left + activeRect.width / 2;
    const y = activeRect.top - gridRect.top + activeRect.height / 2;

    gsap.to(selector, { left: x, top: y, duration: 0.28, ease: "power3.out" });

    // Update Text
    document.getElementById("network-dynamic-subtitle").textContent = `Connect to ${link.title}`;

    if (playSound) window.AudioManager.playSFX("assets/audio/sfx/tick.mp3");
};

window.moveNetworkSelection = function (direction) {
    const total = NETWORK_LINKS.length;
    if (typeof window.AppState.selectedNetworkIndex !== "number") window.AppState.selectedNetworkIndex = 0;
    
    window.AppState.selectedNetworkIndex += direction;
    if (window.AppState.selectedNetworkIndex < 0) window.AppState.selectedNetworkIndex = total - 1;
    if (window.AppState.selectedNetworkIndex >= total) window.AppState.selectedNetworkIndex = 0;

    window.updateNetworkSelection(true);
};

window.confirmNetworkSelection = function () {
    const link = NETWORK_LINKS[window.AppState.selectedNetworkIndex || 0];
    window.AudioManager.playSFX("assets/audio/sfx/select.mp3");
    if (link.url) window.open(link.url, "_blank", "noopener,noreferrer");
};

window.openNetworkConfigScreen = function () {
    if (window.AppState.screen !== "MEMORY_CARD_GRID") return;

    const memoryScreen = document.getElementById("memory-card-screen");
    const networkScreen = window.createNetworkConfigScreen();

    window.AppState.setScreen("TRANSITIONING");
    window.AudioManager.playSFX("assets/audio/sfx/select.mp3");

    window.AppState.selectedNetworkIndex = 0;
    networkScreen.classList.remove("hidden");

    gsap.set(networkScreen, { autoAlpha: 0, filter: "blur(10px)" });
    gsap.set(networkScreen.querySelector(".project-detail-panel"), { autoAlpha: 0, scale: 1.04, filter: "brightness(0.85) blur(8px)" });

    const timeline = gsap.timeline({ defaults: { overwrite: "auto" }, onComplete: () => {
        window.AppState.setScreen("NETWORK_CONFIG_GRID");
        window.updateNetworkSelection(false);
        gsap.to("#network-selector", { autoAlpha: 0.92, scale: 1, duration: 0.55, ease: "power2.out" });
    }});

    timeline
        .to(memoryScreen, { autoAlpha: 0.18, filter: "blur(8px)", duration: 0.55, ease: "power2.inOut" }, 0)
        .to(networkScreen, { autoAlpha: 1, filter: "blur(0px)", duration: 0.55, ease: "power2.out" }, 0.1)
        .to(networkScreen.querySelector(".project-detail-panel"), { autoAlpha: 1, scale: 1, filter: "brightness(1) blur(0px)", duration: 0.8, ease: "power3.out" }, 0.15);
};

window.closeNetworkConfigScreen = function () {
    if (window.AppState.screen !== "NETWORK_CONFIG_GRID") return;

    const memoryScreen = document.getElementById("memory-card-screen");
    const networkScreen = document.getElementById("network-config-screen");

    window.AppState.setScreen("TRANSITIONING");
    window.AudioManager.playSFX("assets/audio/sfx/back.mp3");

    const timeline = gsap.timeline({ defaults: { overwrite: "auto" }, onComplete: () => {
        networkScreen.classList.add("hidden");
        gsap.set(memoryScreen, { autoAlpha: 1, filter: "blur(0px)" });
        window.AppState.setScreen("MEMORY_CARD_GRID");
    }});

    timeline
        .to(networkScreen.querySelector(".project-detail-panel"), { autoAlpha: 0, scale: 1.035, filter: "brightness(0.85) blur(8px)", duration: 0.45, ease: "power2.inOut" }, 0)
        .to(networkScreen, { autoAlpha: 0, filter: "blur(10px)", duration: 0.45, ease: "power2.inOut" }, 0.05)
        .to(memoryScreen, { autoAlpha: 1, filter: "blur(0px)", duration: 0.5, ease: "power2.out" }, 0.15);
};