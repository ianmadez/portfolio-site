// ==========================================
// PHASE 2F: CD PLAYER UI WITH CORRECTED PS2 CUBES & ICONS
// ==========================================

const CD_TRACKS = [
    { title: "Track 1", game: "Crash Twinsanity - Theme", file: "crashtwinsanity.mp3" },
    { title: "Track 2", game: "Shadow of the Colossus - A Despair-Filled Farewell", file: "ADFF.mp3" },
    { title: "Track 3", game: "Gran Turismo 4 - Arcade", file: "arcade_gt4.mp3" },
    { title: "Track 4", game: "Tomb Raider Underworld", file: "LCu_main.mp3" },
    { title: "Track 5", game: "Tomb Raider Legend", file: "LCl_main.mp3" },
    { title: "Track 6", game: "Quantum of Solace - Intro", file: "007qos.mp3" },
    { title: "Track 7", game: "Mortal Kombat - Intro", file: "mk.mp3" }
];

let cdRenderer = null, cdScene = null, cdCamera = null, cdAnimationFrame = null;
let cdCubes = [];
let cdSelectionHalo = null;
let cdHtmlAudio = null; // 👈 Native streaming audio instance
let cdCurrentView = "GRID"; // "GRID" or "PLAYBACK"
let cdSelectedIndex = 0;
let cdPlayingIndex = 0;
let cdIsPlaying = false;
let cdPlaybackTime = 0;
let cdTimerInterval = null;
let cdVolumeLevel = 0.25; // Default starts safely at 25%
let cdVolumeHideTimeout = null;

// Clean canvas-texture generator to draw numbers directly on faces
function createPS2CubeTexture(number, baseColorHex) {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#" + baseColorHex;
    ctx.fillRect(0, 0, 128, 128);

    // Render original console style tracking number
    ctx.font = "bold 66px Arial, Helvetica, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Smooth outline overlay for low-poly visibility
    ctx.strokeStyle = "rgba(0,0,0,0.45)";
    ctx.lineWidth = 5;
    ctx.strokeText(number.toString(), 64, 64);

    ctx.fillStyle = "#ffffff";
    ctx.fillText(number.toString(), 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}

window.createCDPlayerScreen = function () {
    let screen = document.getElementById("cd-player-screen");
    if (screen) return screen;

    screen = document.createElement("section");
    screen.id = "cd-player-screen";
    screen.className = "version-info-screen hidden";

    screen.innerHTML = `
        <div class="version-info-container" style="background: radial-gradient(circle at 52% 46%, rgba(255,255,255,0.25), transparent 42%), linear-gradient(to bottom, #b5b5b0 0%, #7a7a76 100%);">
            <div id="cd-three-mount" style="position: absolute; inset: 0; z-index: 1; pointer-events: none;"></div>
            
            <div style="position: absolute; top: 6%; left: 5%; z-index: 2; font-family: Helvetica, Arial, sans-serif; font-weight: bold; color: #fff; font-size: clamp(1.2rem, 2vw, 1.8rem); opacity: 0.85;">
                Audio CD
            </div>
            <div id="cd-track-indicator" style="position: absolute; top: 6%; right: 5%; z-index: 2; font-family: Helvetica, Arial, sans-serif; font-weight: bold; color: #d1b848; font-size: clamp(1.2rem, 2vw, 1.8rem);">
                Track 1
            </div>

            <div id="cd-playback-panel" style="position: absolute; left: 54%; top: 38%; z-index: 2; font-family: Helvetica, Arial, sans-serif; color: #fff; display: none; width: 40%;">
                
                <style>
                    .cd-icon { width: clamp(24px, 3.5vw, 36px); height: clamp(24px, 3.5vw, 36px); stroke: rgba(255,255,255,0.7); stroke-width: 2.5; fill: transparent; stroke-linejoin: round; stroke-linecap: round; transition: all 0.2s ease; }
                    .cd-icon.active { stroke: #62c3d0; filter: drop-shadow(0 0 8px rgba(98,195,208,0.6)); }
                    
                    /* Authentic LED Train Announcement Marquee */
                    .cd-marquee-wrap { 
                        width: 100%; 
                        overflow: hidden; 
                        white-space: nowrap; 
                        position: relative; 
                        margin-bottom: 6px; 
                        mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent); 
                        -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent); 
                    }
                    .cd-marquee-text { 
                        display: inline-block; 
                        font-size: clamp(2rem, 3.5vw, 3.5rem); 
                        font-weight: bold; 
                        color: #d1b848; 
                        padding-left: 100%; 
                        animation: cdMarquee 12s linear infinite; 
                    }
                    @keyframes cdMarquee { 
                        0% { transform: translateX(0%); } 
                        100% { transform: translateX(-100%); } 
                    }
                </style>

                <div class="cd-marquee-wrap">
                    <div id="cd-playback-title" class="cd-marquee-text">Track 1</div>
                </div>
                
                <div id="cd-playback-time" style="font-size: clamp(1.6rem, 2.5vw, 2.5rem); font-weight: normal; font-variant-numeric: tabular-nums; margin-bottom: 18px; color: #f2f2f2;">00 min. 00 sec.</div>
                
                <div style="display: flex; gap: clamp(12px, 2vw, 24px); align-items: center; user-select: none;">
                    <svg class="cd-icon" viewBox="0 0 24 24"><path d="M4 5v14 M11.5 12l7 6.5v-13z M4.5 12l7 6.5v-13z"/></svg>
                    <svg class="cd-icon" viewBox="0 0 24 24"><path d="M11 12l8 7V5z M3 12l8 7V5z"/></svg>
                    <svg class="cd-icon" viewBox="0 0 24 24"><path d="M13 12l-8-7v14z M21 12l-8-7v14z"/></svg>
                    <svg class="cd-icon" viewBox="0 0 24 24"><path d="M20 5v14 M12.5 12l-7-6.5v13z M19.5 12l-7-6.5v13z"/></svg>
                    
                    <span style="width: 10px;"></span> 
                    
                    <svg id="ctrl-play" class="cd-icon active" viewBox="0 0 24 24"><path d="M7 5l12 7-12 7z"/></svg>
                    <svg id="ctrl-pause" class="cd-icon" viewBox="0 0 24 24"><path d="M8 5v14 M16 5v14"/></svg>
                    <svg class="cd-icon" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="1"/></svg>
                </div>
            </div>

            <div id="cd-volume-osd" style="position: absolute; left: 54%; top: 28%; z-index: 3; display: flex; align-items: center; gap: 12px; opacity: 0; transition: opacity 0.3s ease; pointer-events: none;">
                <span style="color: #6edcff; font-family: Helvetica, Arial, sans-serif; font-weight: bold; font-size: clamp(0.9rem, 1.5vw, 1.2rem);">VOL</span>
                <div style="width: clamp(80px, 12vw, 120px); height: 10px; border: 2px solid rgba(255,255,255,0.4); padding: 2px; border-radius: 2px;">
                    <div id="cd-volume-bar" style="width: 25%; height: 100%; background: #6edcff; box-shadow: 0 0 8px rgba(110, 220, 255, 0.6);"></div>
                </div>
            </div>

            <div class="version-footer" style="z-index: 5;">
                <span class="v-footer-item" id="cd-vol-hint" style="display: none;">
                    <span style="color: #aaa; font-weight: bold; font-size: clamp(1rem, 2vw, 1.4rem); letter-spacing: -2px;">▲▼</span>
                    <span>Volume</span>
                </span>
                <span class="v-footer-item">
                    <img src="assets/images/ui/ex.png" class="footer-button-icon" alt="Cross">
                    <span id="cd-confirm-label">Enter</span>
                </span>
                <span class="v-footer-item">
                    <img src="assets/images/ui/circle.png" class="footer-button-icon" alt="Circle">
                    <span>Back</span>
                </span>
            </div>
        </div>
    `;

    document.getElementById("boot-container").appendChild(screen);
    return screen;
};

function initCDThreeScene(mount) {
    cdScene = new THREE.Scene();
    cdCamera = new THREE.PerspectiveCamera(40, mount.clientWidth / mount.clientHeight, 0.1, 100);
    cdCamera.position.set(0, 0, 8.5); // Pulled slightly back so the full grid sits cleanly

    cdRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    cdRenderer.setSize(mount.clientWidth, mount.clientHeight);
    cdRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(cdRenderer.domElement);

    cdScene.add(new THREE.AmbientLight(0xffffff, 1.2));
    let dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(3, 5, 4);
    cdScene.add(dirLight);

    const cubeGeo = new THREE.BoxGeometry(0.58, 0.58, 0.58);
    cdCubes = [];

    // Left (Purple) to Right (Blue) blending arrays for authentic row spectrums
    const leftColors = [0xa855f7, 0x3b82f6, 0x14b8a6, 0x22c55e];
    const rightColors = [0x3b82f6, 0x0ea5e9, 0x34d399, 0x10b981];

    CD_TRACKS.forEach((track, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);

        const rowColorLeft = new THREE.Color(leftColors[row % 4]);
        const rowColorRight = new THREE.Color(rightColors[row % 4]);
        const derivedColor = rowColorLeft.clone().lerp(rowColorRight, col / 3);

        const texturMap = createPS2CubeTexture(i + 1, derivedColor.getHexString());

        // Blank material for the 5 empty faces
        const blankMat = new THREE.MeshStandardMaterial({
            color: derivedColor,
            roughness: 0.3,
            metalness: 0.1,
            flatShading: true
        });

        // Textured material for the 1 numbered face
        const faceMat = new THREE.MeshStandardMaterial({
            map: texturMap,
            roughness: 0.3,
            metalness: 0.1,
            flatShading: true
        });

        // Three.js Box Face Order: Right, Left, Top, Bottom, Front, Back
        // We put the number on the Front face (Index 4)
        const materialsArray = [blankMat, blankMat, faceMat, blankMat, blankMat, blankMat];

        const mesh = new THREE.Mesh(cubeGeo, materialsArray);

        mesh.userData = {
            gridPos: new THREE.Vector3((col - 1.5) * 1.45, (0.4 - row) * 1.35, 0),
            playbackPos: new THREE.Vector3(-1.8, 0.1, 1.8),
            fixedRotation: new THREE.Euler(1.047198, 0, 0) // Tweak this using the Three.js Editor
        };

        mesh.position.copy(mesh.userData.gridPos);
        mesh.rotation.copy(mesh.userData.fixedRotation);
        cdScene.add(mesh);
        cdCubes.push(mesh);
    });

    // Generate the 3D Halo that sits BEHIND the cubes
    // Procedural white halo texture — no external image dependency
    const haloCanvas = document.createElement("canvas");
    haloCanvas.width = 256;
    haloCanvas.height = 256;
    const haloCtx = haloCanvas.getContext("2d");

    const gradient = haloCtx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.9)");
    gradient.addColorStop(0.6, "rgba(255, 255, 255, 0.4)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    haloCtx.fillStyle = gradient;
    haloCtx.fillRect(0, 0, 256, 256);

    const haloTex = new THREE.CanvasTexture(haloCanvas);
    cdSelectionHalo = new THREE.Sprite(
        new THREE.SpriteMaterial({
            map: haloTex,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            depthWrite: false // Ensures it doesn't clip badly with the cubes
        })
    );
    cdScene.add(cdSelectionHalo);
}

function updateCDSceneLoop() {
    if (!cdRenderer) return;

    const t = performance.now() * 0.001;
    const mount = document.getElementById("cd-three-mount");
    const halo = document.getElementById("cd-save-selector");
    const rect = mount ? mount.getBoundingClientRect() : null;

    cdCubes.forEach((cube, i) => {
        if (cdCurrentView === "GRID") {
            cube.position.lerp(cube.userData.gridPos, 0.1);
            cube.rotation.copy(cube.userData.fixedRotation); // Lock angle, no spin!

            const targetScale = (i === cdSelectedIndex) ? 1.16 : 1.0;
            cube.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12);
            cube.visible = true;

            // Keep the 3D Halo exactly under the active cube
            if (i === cdSelectedIndex && cdSelectionHalo) {
                cdSelectionHalo.visible = true;

                // Position it tightly underneath the cube's midpoint base
                cdSelectionHalo.position.copy(cube.position);
                cdSelectionHalo.position.z -= 0.38; // Brought forward slightly to stop geometry clipping

                // Boosted baseline scale from 1.6 to 2.4 to peak past the edges
                const pulse = 1.2 + Math.sin(t * 3.5) * 0.12;
                cdSelectionHalo.scale.set(pulse, pulse, pulse);

                // High-intensity white opacity shift
                cdSelectionHalo.material.opacity = 0.85 + Math.sin(t * 4.0) * 0.15;
            }

        } else {
            if (cdSelectionHalo) cdSelectionHalo.visible = false;

            if (i === cdPlayingIndex) {
                cube.position.lerp(cube.userData.playbackPos, 0.1);

                // Playback view: selected CD cube rolls gently in place.
                cube.rotation.x = cube.userData.fixedRotation.x + t * 1.05;
                cube.rotation.y = cube.userData.fixedRotation.y + Math.sin(t * 0.75) * 0.16;
                cube.rotation.z = cube.userData.fixedRotation.z + t * 0.48;

                cube.scale.lerp(new THREE.Vector3(1.8, 1.8, 1.8), 0.1);
                cube.visible = true;

                if (halo) halo.style.opacity = 0; // Hide halo during playback
            } else {
                cube.scale.lerp(new THREE.Vector3(0, 0, 0), 0.15);
                if (cube.scale.x < 0.01) cube.visible = false;
            }
        }
    });

    cdRenderer.render(cdScene, cdCamera);
    cdAnimationFrame = requestAnimationFrame(updateCDSceneLoop);
}

window.updateCDPlayerSelection = function () {
    const track = CD_TRACKS[cdSelectedIndex];
    document.getElementById("cd-track-indicator").textContent = track.title;
};

window.moveCDPlayerSelection = function (direction) {
    if (cdCurrentView !== "GRID") return;
    const total = CD_TRACKS.length;
    cdSelectedIndex = (cdSelectedIndex + direction + total) % total;
    window.updateCDPlayerSelection();
    window.AudioManager.playSFX("assets/audio/sfx/tick.mp3");
};

window.handleCDPlayerVertical = function (direction) {
    if (cdCurrentView === "GRID") {
        // Navigates the Grid up/down by rows of 4
        const total = CD_TRACKS.length;
        // Add (total * 4) to prevent negative modulo logic breaking
        cdSelectedIndex = (cdSelectedIndex + (direction * 4) + (total * 4)) % total;
        window.updateCDPlayerSelection();
        window.AudioManager.playSFX("assets/audio/sfx/tick.mp3");
    } else if (cdCurrentView === "PLAYBACK") {
        // UP input = -1 direction. We want UP to increase volume, so multiply by -1.
        window.adjustCDVolume(direction * -1);
    }
};

window.adjustCDVolume = function (delta) {
    cdVolumeLevel += delta * 0.1; // Adjust by 10% steps

    // Hard clamp to prevent audio API crashes
    if (cdVolumeLevel > 1.0) cdVolumeLevel = 1.0;
    if (cdVolumeLevel < 0.0) cdVolumeLevel = 0.0;

    if (cdHtmlAudio) {
        cdHtmlAudio.volume = cdVolumeLevel;
    }

    // Flash the OSD Bar
    const osd = document.getElementById("cd-volume-osd");
    const bar = document.getElementById("cd-volume-bar");

    if (osd && bar) {
        bar.style.width = (cdVolumeLevel * 100) + "%";
        osd.style.opacity = "1";

        clearTimeout(cdVolumeHideTimeout);
        cdVolumeHideTimeout = setTimeout(() => {
            osd.style.opacity = "0";
        }, 1500); // Fades back out after 1.5 seconds
    }

    window.AudioManager.playSFX("assets/audio/sfx/tick.mp3");
};

function formatCDTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m} min. ${s} sec.`;
}

function startCDTimer() {
    clearInterval(cdTimerInterval);
    cdTimerInterval = setInterval(() => {
        if (!cdIsPlaying || !cdHtmlAudio) return;

        // Sync the display exactly to the streaming audio timestamp
        const currentSeconds = Math.floor(cdHtmlAudio.currentTime);
        document.getElementById("cd-playback-time").textContent = formatCDTime(currentSeconds);
    }, 250); // Fast interval keeps UI snappy
}

window.confirmCDPlayerSelection = function () {
    window.AudioManager.playSFX("assets/audio/sfx/select.mp3");

    if (cdCurrentView === "GRID") {
        cdCurrentView = "PLAYBACK";
        cdPlayingIndex = cdSelectedIndex;
        cdIsPlaying = true;

        // Get the track data once
        const track = CD_TRACKS[cdPlayingIndex];

        // 0. Inject Dynamic Marquee Text BEFORE showing the panel
        document.getElementById("cd-playback-title").textContent = `${track.title} // ${track.game}`;

        // Transition UI
        document.getElementById("cd-playback-panel").style.display = "block";
        document.getElementById("cd-playback-time").textContent = formatCDTime(0);
        document.getElementById("cd-confirm-label").textContent = "Play / Pause";
        document.getElementById("cd-vol-hint").style.display = "flex"; // Reveal Volume Hint

        document.getElementById("ctrl-play").classList.add("active");
        document.getElementById("ctrl-pause").classList.remove("active");

        // 1. Mute background drone
        window.AudioManager.setBGMState("SILENCE");

        // 2. Clear old track if exists
        if (cdHtmlAudio) {
            cdHtmlAudio.pause();
            cdHtmlAudio.src = "";
        }

        // 3. Lazy Load and Play new track (Using the 'track' variable we defined above)
        cdHtmlAudio = new Audio("assets/audio/tracks/" + track.file);
        cdHtmlAudio.preload = "metadata";
        cdHtmlAudio.volume = cdVolumeLevel; // Applies the safe 25% starting volume

        cdHtmlAudio.play().catch(e => console.warn("Audio blocked by browser policy:", e));

        // Auto-pause UI when song naturally ends
        cdHtmlAudio.onended = () => {
            cdIsPlaying = false;
            document.getElementById("ctrl-play").classList.remove("active");
            document.getElementById("ctrl-pause").classList.add("active");
        };

        startCDTimer();
    } else {
        // Toggle Audio State within Playback view mode
        cdIsPlaying = !cdIsPlaying;
        if (cdIsPlaying) {
            if (cdHtmlAudio) cdHtmlAudio.play();
            document.getElementById("ctrl-play").classList.add("active");
            document.getElementById("ctrl-pause").classList.remove("active");
        } else {
            if (cdHtmlAudio) cdHtmlAudio.pause();
            document.getElementById("ctrl-play").classList.remove("active");
            document.getElementById("ctrl-pause").classList.add("active");
        }
    }
};

window.closeCDPlayerScreen = function () {
    window.AudioManager.playSFX("assets/audio/sfx/back.mp3");

    if (cdCurrentView === "PLAYBACK") {
        cdCurrentView = "GRID";
        clearInterval(cdTimerInterval);

        // Halt CD Audio and resume ambient hum
        if (cdHtmlAudio) {
            cdHtmlAudio.pause();
        }
        window.AudioManager.setBGMState("BIOS");

        document.getElementById("cd-playback-panel").style.display = "none";
        document.getElementById("cd-confirm-label").textContent = "Enter";
        document.getElementById("cd-vol-hint").style.display = "none"; // Hide Volume Hint
        return;
    }

    if (cdAnimationFrame) cancelAnimationFrame(cdAnimationFrame);
    clearInterval(cdTimerInterval);

    const screen = document.getElementById("cd-player-screen");
    if (screen) screen.classList.add("hidden");

    window.AppState.setScreen("VERSION_INFO");
};

window.openCDPlayerScreen = function () {
    window.AppState.setScreen("CD_PLAYER_GRID");
    cdCurrentView = "GRID";
    cdSelectedIndex = 0;

    const screen = window.createCDPlayerScreen();
    screen.classList.remove("hidden");

    const mount = document.getElementById("cd-three-mount");

    if (!cdRenderer || !cdCubes.length) {
        if (cdRenderer && cdRenderer.domElement && cdRenderer.domElement.parentElement) {
            cdRenderer.domElement.parentElement.removeChild(cdRenderer.domElement);
        }

        cdRenderer = null;
        cdScene = null;
        cdCamera = null;
        cdCubes = [];

        initCDThreeScene(mount);
    }

    window.updateCDPlayerSelection();
    updateCDSceneLoop();
};