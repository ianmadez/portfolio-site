// assets/js/ui/version-info-ui.js

const VERSION_ITEMS = [
    {
        label: "Console", value: "Portfolio OS / Diagnosis", subItems: [
            { label: "Diagnosis", value: "Off", options: ["On", "Off"], activeIndex: 0 },
            { label: "Curriculum Vitae", value: "Press ✖ / Enter to Open", action: "DOWNLOAD_CV" }
        ]
    },
    {
        label: "Dev's Summary", value: "Ian Madez v2.0", subItems: [
            { label: "OPERATOR", value: "Ian Madekufamba" },
            { label: "BUILD TYPE", value: "Design Engineer (Fullstack)" },
            { label: "LANGUAGES", value: "HTML5, CSS3, JavaScript, React, Python, Typescript" },
            { label: "REGION", value: "Kuala Lumpur" },
            { label: "PHILOSOPHY", value: "Creative Software Development" },
            { label: "STATUS", value: "Available for Projects ✓" }
        ]
    },
    { label: "CD Player", value: "Web Audio API", subItems: [] },
    {
        label: "PlayStation® Driver", value: "Three.js / WebGL Rendering", subItems: [
            { label: "Texture Mapping", value: "Standard", options: ["Standard", "High"], activeIndex: 0 },
            { label: "Disc Speed", value: "Fast", options: ["Fast", "Slow"], activeIndex: 0 }
        ]
    },
    { label: "DVD Player", value: "GSAP Motion Engine", subItems: [] },
    {
        label: "Site Controls", value: "Controller / Keyboard", subItems: [
            { label: "X / Enter", value: "Confirm / Action" },
            { label: "Circle / Esc / O", value: "Back / Cancel" },
            { label: "Triangle / T", value: "Options / Version Info" },
            { label: "Square / Q", value: "Toggle CRT Display" },
            { label: "D-Pad / Arrow Keys / WASD", value: "Navigate Grid" }
        ]
    }
];

let versionSelectedIndex = 0;
let versionCurrentView = "MAIN"; // "MAIN" or "SUB"
let versionParentIndex = 0;
let versionIsEditing = false; // Tracks if we are cycling options

function createVersionInfoScreen() {
    let screen = document.getElementById("version-info-screen");
    if (screen) return screen;

    screen = document.createElement("section");
    screen.id = "version-info-screen";
    screen.className = "version-info-screen hidden";

    // Create 8 orbs using CSS 3D transforms to spin like a wheel and twist
    let orbsHtml = '';
    for (let i = 0; i < 8; i++) {
        let angle = (i / 8) * 360;
        orbsHtml += `<div class="v-orb" style="transform: rotateZ(${angle}deg) translateX(35px) rotateY(90deg);"></div>`;
    }

    screen.innerHTML = `
        <div class="version-info-container">
            <div class="version-three-mount">
                <canvas id="version-canvas"></canvas>
            </div>

            <div class="version-content">
                <div id="version-dynamic-header" class="version-header">Version Information</div>
                <div id="version-list-container" class="version-list"></div>
            </div>

            <div id="cv-preview-panel" style="position: absolute; left: 6%; top: 28%; width: 38%; bottom: 18%; background: rgba(255,255,255,0.03); border: 1px dashed rgba(110,142,150,0.3); padding: 20px; font-size: 0.75em; color: #aaa; overflow: hidden; display: none; line-height: 1.4;">
                <div style="color: #62c3d0; font-weight: bold; margin-bottom: 8px; border-bottom: 1px solid rgba(98,195,208,0.2); padding-bottom: 4px;">DOCUMENT PREVIEW</div>
                <div><strong>IAN THABANI MADEKUFAMBA</strong></div>
                <div style="font-size: 0.9em; margin-bottom: 12px; color: #6e8e96;">Design Engineer / Software Developer</div>
                <p style="margin-bottom: 8px;">• Core focus on React, Next.js, Expo, Supabase, and offline-first mobile infrastructures.</p>
                <p style="margin-bottom: 8px;">• Projects include ClariFi (Finance OS), D.A.V.E Agentic Engine, and Level Up Aviation systems.</p>
                <p>• Seeking impactful engineering challenges combining heavy systems architecture with tactical user experiences.</p>
            </div>

            <div id="version-dynamic-footer" class="version-footer">
                </div>
        </div>
    `;

    document.getElementById("boot-container").appendChild(screen);
    return screen;
}

function renderVersionList() {
    const container = document.getElementById("version-list-container");
    const headerEl = document.getElementById("version-dynamic-header");
    const footerEl = document.getElementById("version-dynamic-footer");
    if (!container || !headerEl || !footerEl) return;

    let html = '';
    const itemsToRender = versionCurrentView === "MAIN" ? VERSION_ITEMS : VERSION_ITEMS[versionParentIndex].subItems;

    itemsToRender.forEach((item, index) => {
        const isActive = index === versionSelectedIndex;
        const activeClass = isActive ? 'active' : '';
        const displayValue = item.options ? item.options[item.activeIndex] : item.value;
        html += `
            <div class="v-row-container">
                <div class="v-row ${activeClass}">
                    <div class="v-label">${item.label}</div>
                    <div class="v-value">${displayValue}</div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;

    // Handle interactive visibility of the document preview pane
    const previewPanel = document.getElementById("cv-preview-panel");
    if (previewPanel) {
        const currentItem = itemsToRender[versionSelectedIndex];
        if (versionCurrentView === "SUB" && currentItem && currentItem.action === "DOWNLOAD_CV") {
            previewPanel.style.display = "block";
        } else {
            previewPanel.style.display = "none";
        }
    }

    // Update Header and Footer based on View State
    if (versionCurrentView === "MAIN") {
        headerEl.innerText = "Version Information";
        footerEl.innerHTML = `
            <span class="v-footer-item" data-command="BACK">
                <img src="assets/images/ui/circle.png" class="footer-button-icon" alt="Circle">
                <span>Back</span>
            </span>
            <span class="v-footer-item" data-command="OPTIONS">
                <img src="assets/images/ui/triangle.png" class="footer-button-icon" alt="Triangle">
                <span>Options</span>
            </span>
        `;
    } else {
        headerEl.innerText = VERSION_ITEMS[versionParentIndex].label;

        if (versionIsEditing) {
            // Edit Mode Footer (Just like System Config)
            footerEl.innerHTML = `
                <span class="v-footer-item">
                    <span style="color: rgba(180, 200, 240, 0.5); font-size: 0.75em; letter-spacing: 0.05em;">◀ ▶</span>
                    <span>Change</span>
                </span>
                <span class="v-footer-item" data-command="CONFIRM">
                    <img src="assets/images/ui/ex.png" class="footer-button-icon" alt="Cross">
                    <span>Confirm</span>
                </span>
                <span class="v-footer-item" data-command="BACK">
                    <img src="assets/images/ui/circle.png" class="footer-button-icon" alt="Circle">
                    <span>Cancel</span>
                </span>
            `;
        } else {
            // Standard Sub-menu Footer
            footerEl.innerHTML = `
                <span class="v-footer-item" data-command="CONFIRM">
                    <img src="assets/images/ui/ex.png" class="footer-button-icon" alt="Cross">
                    <span>Enter</span>
                </span>
                <span class="v-footer-item" data-command="BACK">
                    <img src="assets/images/ui/circle.png" class="footer-button-icon" alt="Circle">
                    <span>Back</span>
                </span>
            `;
        }
    }
}

window.moveVersionInfoSelection = function (direction) {
    if (versionIsEditing) return; // Prevent vertical scrolling while changing a value

    const maxIndex = versionCurrentView === "MAIN" ? VERSION_ITEMS.length : VERSION_ITEMS[versionParentIndex].subItems.length;
    versionSelectedIndex = (versionSelectedIndex + direction + maxIndex) % maxIndex;
    renderVersionList();
    window.AudioManager.playSFX("assets/audio/sfx/tick.mp3");
};

window.enterVersionInfoSubMenu = function () {
    if (versionCurrentView !== "MAIN") return;
    const currentItem = VERSION_ITEMS[versionSelectedIndex];
    if (currentItem.subItems.length > 0) {
        versionCurrentView = "SUB";
        versionParentIndex = versionSelectedIndex;
        versionSelectedIndex = 0;
        renderVersionList();
        window.AudioManager.playSFX("assets/audio/sfx/select.mp3");
    } else {
        window.AudioManager.playSFX("assets/audio/sfx/tick.mp3");
    }
};

window.confirmVersionInfoSelection = function () {
    if (versionCurrentView === "MAIN") {
        const currentItem = VERSION_ITEMS[versionSelectedIndex];
        if (currentItem.subItems.length > 0) {
            versionCurrentView = "SUB";
            versionParentIndex = versionSelectedIndex;
            versionSelectedIndex = 0;
            renderVersionList();
            window.AudioManager.playSFX("assets/audio/sfx/select.mp3");
        } else {
            window.AudioManager.playSFX("assets/audio/sfx/tick.mp3");
        }
    } else {
        // We are in the SUB menu. Check if the item has options or actions.
        const currentItem = VERSION_ITEMS[versionParentIndex].subItems[versionSelectedIndex];

        if (currentItem && currentItem.action === "DOWNLOAD_CV") {
            window.AudioManager.playSFX("assets/audio/sfx/select.mp3");
            
            if (window.showTemporaryPhaseToast) {
                window.showTemporaryPhaseToast("Downloading Curriculum Vitae...");
            }
            
            // Using window.open is the most reliable way to force a PDF action without browser blocking
            window.open("assets/documents/Ian_Madez_CV.pdf", "_blank");
            return;
            
        } else if (currentItem && currentItem.options) {
            // Toggle Edit Mode
            versionIsEditing = !versionIsEditing;
            renderVersionList();
            window.AudioManager.playSFX("assets/audio/sfx/select.mp3");

            // If they just confirmed a change, log it or apply it to AppState here
            if (!versionIsEditing) {
                console.log(`Setting ${currentItem.label} applied: ${currentItem.options[currentItem.activeIndex]}`);
            }
        } else {
            // Item is static text, cannot be edited.
            window.AudioManager.playSFX("assets/audio/sfx/tick.mp3");
        }
    }
};

window.openVersionInfoScreen = function () {
    if (!window.AppState) return;

    window.AppState.previousScreen = window.AppState.screen;
    window.AppState.setScreen("VERSION_INFO");

    versionSelectedIndex = 0;
    versionCurrentView = "MAIN";

    const screen = createVersionInfoScreen();
    renderVersionList();

    window.AudioManager.playSFX("assets/audio/sfx/select.mp3");

    const sysConfigPanel = document.querySelector(".system-config-panel");
    const sysConfigFooter = document.querySelector(".system-config-footer");
    const sysConfigCopy = document.querySelector(".system-config-copy");

    if (sysConfigPanel) gsap.to([sysConfigPanel, sysConfigFooter, sysConfigCopy], { autoAlpha: 0, duration: 0.2 });
    gsap.to(".system-config-three-canvas", { autoAlpha: 0, duration: 0.2 });

    screen.classList.remove("hidden");
    gsap.fromTo(screen, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: "power2.out" });

    // Initialize Three.js orbs
    const mount = screen.querySelector(".version-three-mount");
    if (typeof window.initVersionScene === "function" && mount) {
        window.initVersionScene(mount);
    }
};

window.cycleVersionInfoValue = function (direction) {
    if (!versionIsEditing) return;
    const currentItem = VERSION_ITEMS[versionParentIndex].subItems[versionSelectedIndex];
    if (!currentItem || !currentItem.options) return;
    const max = currentItem.options.length;
    currentItem.activeIndex = (currentItem.activeIndex + direction + max) % max;
    renderVersionList();
    window.AudioManager.playSFX("assets/audio/sfx/tick.mp3");
};

window.closeVersionInfoScreen = function () {
    if (versionIsEditing) {
        // Cancel the edit mode and revert the UI
        versionIsEditing = false;
        renderVersionList();
        window.AudioManager.playSFX("assets/audio/sfx/back.mp3");
        return;
    }

    if (versionCurrentView === "SUB") {
        versionCurrentView = "MAIN";
        versionSelectedIndex = versionParentIndex;
        renderVersionList();
        window.AudioManager.playSFX("assets/audio/sfx/back.mp3");
        return;
    }

    const screen = document.getElementById("version-info-screen");
    if (!screen) return;

    window.AudioManager.playSFX("assets/audio/sfx/back.mp3");

    if (typeof window.disposeVersionScene === "function") {
        window.disposeVersionScene();
    }

    gsap.to(screen, {
        autoAlpha: 0,
        duration: 0.2,
        onComplete: () => {
            screen.classList.add("hidden");

            const sysConfigPanel = document.querySelector(".system-config-panel");
            const sysConfigFooter = document.querySelector(".system-config-footer");
            const sysConfigCopy = document.querySelector(".system-config-copy");

            if (sysConfigPanel) gsap.to([sysConfigPanel, sysConfigFooter, sysConfigCopy], { autoAlpha: 1, duration: 0.2 });
            gsap.to(".system-config-three-canvas", { autoAlpha: 1, duration: 0.2 });

            window.AppState.setScreen(window.AppState.previousScreen || "SYSTEM_CONFIG");
        }
    });
};