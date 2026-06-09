// System Configuration UI module. Exposes system config screen functions.

const SYSTEM_CONFIG_ITEMS = [
    { id: "clock", label: "Clock Adjustment", remap: "Availability Clock", values: ["KL", "GMT+8", "Available"], defaultIndex: 0 },
    { id: "screen", label: "Screen Size", remap: "Viewport Mode", values: ["Standard (4:3)", "Full Screen (16:9)", "Full"], defaultIndex: 0 },
    { id: "digital", label: "Digital Out (Optical)", remap: "Audio Output", values: ["On", "Off"], defaultIndex: 0 },
    { id: "component", label: "Component Video Out", remap: "Render Quality", values: ["Standard", "Performance"], defaultIndex: 0 },
    { id: "remote", label: "Remote Control", remap: "Input Mode", values: ["Classic", "Mouse"], defaultIndex: 0 },
    { id: "language", label: "Language", remap: "Language", values: ["English", "Malay", "Swahili"], defaultIndex: 0 },
];

let systemConfigClockTimer = null;

function ensureSystemConfigState() {
    if (!window.AppState) return;

    if (typeof window.AppState.selectedSystemConfigIndex !== "number") {
        window.AppState.selectedSystemConfigIndex = 0;
    }

    if (typeof window.AppState.systemConfigEditing !== "boolean") {
        window.AppState.systemConfigEditing = false;
    }

    if (!window.AppState.systemConfigValues || typeof window.AppState.systemConfigValues !== "object") {
        window.AppState.systemConfigValues = {};
    }

    SYSTEM_CONFIG_ITEMS.forEach(item => {
        if (!(item.id in window.AppState.systemConfigValues)) {
            window.AppState.systemConfigValues[item.id] = item.values[item.defaultIndex];
        }
    });
}

function createSystemConfigScreen() {
    let screen = document.getElementById("system-config-screen");
    if (screen) return screen;

    screen = document.createElement("section");
    screen.id = "system-config-screen";
    screen.className = "system-config-screen hidden";

    screen.innerHTML = `
    <div class="system-config-panel">
      <div class="system-config-date" id="system-config-date"></div>
      <div class="system-config-time" id="system-config-time"></div>

      <div id="system-config-3d-mount" class="system-config-3d-mount"></div>

      <div class="system-config-orrery system-config-css-fallback" aria-hidden="true">
        <div class="system-config-core"></div>
        <div class="system-config-ring"></div>
        ${SYSTEM_CONFIG_ITEMS.map((item, i) => {
            const angle = (i / SYSTEM_CONFIG_ITEMS.length) * 360;
            return `
              <div
                class="system-config-cube"
                data-config-index="${i}"
                data-angle="${angle}"
                style="transform: rotate(${angle}deg) translateX(7vw) rotate(0deg);"
              >
                <span class="system-config-cube-label">${item.remap.split(" ")[0]}</span>
              </div>
            `;
        }).join("")}
      </div>

      <div class="system-config-copy">
        <div class="system-config-heading">System Configuration</div>
        <div id="system-config-remap" class="system-config-remap"></div>
        <div id="system-config-value" class="system-config-value"></div>
      </div>

      <div class="system-config-footer" id="system-config-footer">
        <div class="system-config-footer-inner" id="system-config-footer-inner"></div>
      </div>
    </div>
  `;

    document.getElementById("boot-container").appendChild(screen);
    return screen;
}

function updateSystemConfigClock() {
    const dateEl = document.getElementById("system-config-date");
    const timeEl = document.getElementById("system-config-time");

    if (!dateEl || !timeEl) return;

    const now = new Date();

    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();

    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");

    dateEl.textContent = `${dd}/${mm}/${yyyy}`;
    timeEl.textContent = `${hh}:${min}:${ss}`;
}

function startSystemConfigClock() {
    stopSystemConfigClock();
    updateSystemConfigClock();
    systemConfigClockTimer = window.setInterval(updateSystemConfigClock, 1000);
}

function stopSystemConfigClock() {
    if (systemConfigClockTimer) {
        window.clearInterval(systemConfigClockTimer);
        systemConfigClockTimer = null;
    }
}

function renderSystemConfigFooter() {
    const footerInner = document.getElementById("system-config-footer-inner");
    if (!footerInner) return;

    footerInner.classList.toggle("editing", window.AppState.systemConfigEditing);

    if (window.AppState.systemConfigEditing) {
        footerInner.innerHTML = `
      <span class="system-config-footer-item">
        <span class="system-config-footer-hint">◀ ▶</span>
        <span>Change</span>
      </span>
      <span class="system-config-footer-item" data-command="CONFIRM">
        <img src="assets/images/ui/ex.png" class="footer-button-icon" alt="Cross">
        <span>Confirm</span>
      </span>
      <span class="system-config-footer-item" data-command="BACK">
        <img src="assets/images/ui/circle.png" class="footer-button-icon" alt="Circle">
        <span>Cancel</span>
      </span>
    `;
    } else {
        footerInner.innerHTML = `
      <span class="system-config-footer-item" data-command="DISPLAY">
        <img src="assets/images/ui/square.png" class="footer-button-icon" alt="Square">
        <span>Display</span>
      </span>
      <span class="system-config-footer-item" data-command="CONFIRM">
        <img src="assets/images/ui/ex.png" class="footer-button-icon" alt="Cross">
        <span>Enter</span>
      </span>
      <span class="system-config-footer-item" data-command="BACK">
        <img src="assets/images/ui/circle.png" class="footer-button-icon" alt="Circle">
        <span>Back</span>
      </span>
      <span class="system-config-footer-item" data-command="VERSION">
        <img src="assets/images/ui/triangle.png" class="footer-button-icon" alt="Triangle">
        <span>Options</span>
      </span>
    `;
    }
}

function updateSystemConfigSelection() {
    ensureSystemConfigState();

    const cubes = document.querySelectorAll(".system-config-cube");
    const index = window.AppState.selectedSystemConfigIndex;
    const item = SYSTEM_CONFIG_ITEMS[index];

    cubes.forEach((cube, i) => {
        cube.classList.toggle("active", i === index);
    });

    if (typeof window.setSystemConfigActiveCube === "function") {
        window.setSystemConfigActiveCube(index);
    }

    const remapEl = document.getElementById("system-config-remap");
    const valueEl = document.getElementById("system-config-value");

    if (remapEl) remapEl.textContent = item.remap;

    if (valueEl) {
        const currentVal = window.AppState.systemConfigValues[item.id] || item.values[item.defaultIndex];
        valueEl.textContent = currentVal;
    }
}

window.moveSystemConfigSelection = function (direction) {
    ensureSystemConfigState();

    const total = SYSTEM_CONFIG_ITEMS.length;
    window.AppState.selectedSystemConfigIndex = (window.AppState.selectedSystemConfigIndex + direction + total) % total;

    updateSystemConfigSelection();
    window.AudioManager.playSFX("assets/audio/sfx/tick.mp3");
};

window.cycleSystemConfigValue = function (direction) {
    ensureSystemConfigState();

    const item = SYSTEM_CONFIG_ITEMS[window.AppState.selectedSystemConfigIndex];
    const values = item.values;
    const currentVal = window.AppState.systemConfigValues[item.id] || item.values[item.defaultIndex];
    const currentIdx = values.indexOf(currentVal);
    const nextIdx = (currentIdx + direction + values.length) % values.length;

    window.AppState.systemConfigValues[item.id] = values[nextIdx];

    updateSystemConfigSelection();
    window.AudioManager.playSFX("assets/audio/sfx/tick.mp3");
};

window.confirmSystemConfigAction = function () {
    ensureSystemConfigState();

    if (window.AppState.systemConfigEditing) {
        window.AppState.systemConfigEditing = false;
        renderSystemConfigFooter();
        window.AudioManager.playSFX("assets/audio/sfx/select.mp3");
    } else {
        window.AppState.systemConfigEditing = true;
        renderSystemConfigFooter();
        window.AudioManager.playSFX("assets/audio/sfx/select.mp3");
    }
};

window.cancelSystemConfigAction = function () {
    ensureSystemConfigState();

    if (window.AppState.systemConfigEditing) {
        window.AppState.systemConfigEditing = false;
        renderSystemConfigFooter();
        window.AudioManager.playSFX("assets/audio/sfx/back.mp3");
    } else {
        closeSystemConfigScreen();
    }
};

function closeSystemConfigScreen() {
    const screen = document.getElementById("system-config-screen");

    stopSystemConfigClock();

    if (typeof window.hideSystemConfigScene === "function") {
        window.hideSystemConfigScene();
    }

    if (screen) {
        screen.classList.add("hidden");
        gsap.set(screen, { autoAlpha: 0 });
    }

    window.AppState.setScreen("BIOS_BROWSER");
    window.AppState.systemConfigEditing = false;
    window.AppState.selectedSystemConfigIndex = 0;

    const browserMenu = document.getElementById("browser-menu");
    if (browserMenu) {
        browserMenu.classList.remove("hidden");
        gsap.set(browserMenu, {
            visibility: "visible",
            autoAlpha: 1,
            filter: "blur(0px)",
            pointerEvents: "auto"
        });
    }

    gsap.set("#boot-canvas", { autoAlpha: 1, filter: "blur(0px)" });

    window.AudioManager.playSFX("assets/audio/sfx/back.mp3");
    window.AudioManager.setBGMState("BIOS");
}

window.openSystemConfigScreen = function () {
    if (window.AppState.screen !== "BIOS_BROWSER") return;

    const screen = createSystemConfigScreen();
    const browserMenu = document.getElementById("browser-menu");

    window.AppState.setScreen("TRANSITIONING");

    window.AudioManager.playSFX("assets/audio/sfx/select.mp3");

    gsap.to(browserMenu, {
        autoAlpha: 0,
        filter: "blur(8px)",
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
            if (browserMenu) browserMenu.classList.add("hidden");

            screen.classList.remove("hidden");
            gsap.set(screen, { autoAlpha: 1 });

            gsap.set(".system-config-panel", {
                autoAlpha: 0,
                filter: "brightness(0.4) blur(8px)",
                scale: 0.96
            });

            gsap.set(".system-config-copy", {
                autoAlpha: 0,
                y: 12,
                filter: "blur(6px)"
            });

            gsap.set(".system-config-footer", {
                autoAlpha: 0,
                y: 10
            });

            window.AppState.selectedSystemConfigIndex = 0;
            window.AppState.systemConfigEditing = false;
            ensureSystemConfigState();

            renderSystemConfigFooter();
            updateSystemConfigSelection();
            startSystemConfigClock();

            const mount = document.getElementById("system-config-3d-mount");

            if (mount && typeof window.initSystemConfigScene === "function") {
                window.initSystemConfigScene(mount);
            }

            if (typeof window.showSystemConfigScene === "function") {
                window.showSystemConfigScene();
            }

            if (typeof window.setSystemConfigActiveCube === "function") {
                window.setSystemConfigActiveCube(window.AppState.selectedSystemConfigIndex);
            }

            window.AppState.setScreen("SYSTEM_CONFIG");

            const reveal = gsap.timeline({ defaults: { overwrite: "auto" } });

            reveal
                .to(".system-config-panel", {
                    autoAlpha: 1,
                    filter: "brightness(1) blur(0px)",
                    scale: 1,
                    duration: 1.2,
                    ease: "power2.out"
                }, 0)
                .to(".system-config-copy", {
                    autoAlpha: 1,
                    y: 0,
                    filter: "blur(0px)",
                    duration: 0.8,
                    ease: "power2.out"
                }, 0.4)
                .to(".system-config-footer", {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.6,
                    ease: "power2.out"
                }, 0.6);
        }
    });
};

window.closeSystemConfigScreen = closeSystemConfigScreen;