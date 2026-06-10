// ==========================================
// PHASE 2F: CD PLAYER UI WITH CORRECTED PS2 CUBES & ICONS
// ==========================================

const CD_TRACKS = [
    { title: "Track 1", game: "Crash Bandicoot - Theme", duration: 142 },
    { title: "Track 2", game: "Shadow of the Colossus - Revived Power", duration: 234 },
    { title: "Track 3", game: "Gran Turismo 4 - Moon Over the Castle", duration: 311 },
    { title: "Track 4", game: "Tomb Raider - Lara's Theme", duration: 185 },
    { title: "Track 5", game: "Quantum of Solace - Menu", duration: 164 },
    { title: "Track 6", game: "Mortal Kombat - Shaolin Monks", duration: 202 }
];

let cdRenderer = null, cdScene = null, cdCamera = null, cdAnimationFrame = null;
let cdCubes = [];
let cdCurrentView = "GRID"; // "GRID" or "PLAYBACK"
let cdSelectedIndex = 0;
let cdPlayingIndex = 0;
let cdIsPlaying = false;
let cdPlaybackTime = 0;
let cdTimerInterval = null;

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
        <div class="version-info-container" style="background: radial-gradient(circle at 52% 46%, rgba(255,255,255,0.18), transparent 38%), linear-gradient(to bottom, #8a8a86 0%, #5a5a56 100%);">
            <div id="cd-three-mount" style="position: absolute; inset: 0; z-index: 1; pointer-events: none;"></div>
            
            <img src="assets/images/ui/halo.png" id="cd-save-selector" class="memory-save-selector" alt="" aria-hidden="true" style="z-index: 10; position: absolute; transform: translate(-50%, -50%); opacity: 0; transition: opacity 0.2s ease;">

            <div style="position: absolute; top: 6%; left: 5%; z-index: 2; font-family: Helvetica, Arial, sans-serif; font-weight: bold; color: #fff; font-size: clamp(1.2rem, 2vw, 1.8rem); opacity: 0.85;">
                Audio CD
            </div>
            <div id="cd-track-indicator" style="position: absolute; top: 6%; right: 5%; z-index: 2; font-family: Helvetica, Arial, sans-serif; font-weight: bold; color: #d1b848; font-size: clamp(1.2rem, 2vw, 1.8rem);">
                Track 1
            </div>

            <div id="cd-playback-panel" style="position: absolute; left: 54%; top: 38%; z-index: 2; font-family: Helvetica, Arial, sans-serif; color: #fff; display: none;">
                <div id="cd-playback-title" style="font-size: clamp(2rem, 3.5vw, 3.5rem); font-weight: bold; color: #d1b848; margin-bottom: 2px;">Track 1</div>
                <div id="cd-playback-time" style="font-size: clamp(1.6rem, 2.5vw, 2.5rem); font-weight: normal; font-variant-numeric: tabular-nums; margin-bottom: 18px; color: #f2f2f2;">00 min. 00 sec.</div>
                
                <style>
                    .cd-icon { width: clamp(24px, 3.5vw, 36px); height: clamp(24px, 3.5vw, 36px); stroke: rgba(255,255,255,0.7); stroke-width: 2.5; fill: transparent; stroke-linejoin: round; stroke-linecap: round; transition: all 0.2s ease; }
                    .cd-icon.active { stroke: #62c3d0; filter: drop-shadow(0 0 8px rgba(98,195,208,0.6)); }
                </style>

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

            <div class="version-footer" style="z-index: 5;">
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
    const leftColors =  [0xa855f7, 0x3b82f6, 0x14b8a6, 0x22c55e];
    const rightColors = [0x3b82f6, 0x0ea5e9, 0x34d399, 0x10b981];

    CD_TRACKS.forEach((track, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);

        // Blends the colors perfectly from Purple on the left to Blue on the right
        const rowColorLeft = new THREE.Color(leftColors[row % 4]);
        const rowColorRight = new THREE.Color(rightColors[row % 4]);
        const derivedColor = rowColorLeft.clone().lerp(rowColorRight, col / 3);

        const texturMap = createPS2CubeTexture(i + 1, derivedColor.getHexString());
        const mat = new THREE.MeshStandardMaterial({
            map: texturMap,
            roughness: 0.3,
            metalness: 0.1,
            flatShading: true
        });

        const mesh = new THREE.Mesh(cubeGeo, mat);

        // User's exact requested viewing angle! No continuous spinning.
        mesh.userData = {
            gridPos: new THREE.Vector3((col - 1.5) * 1.45, (0.4 - row) * 1.35, 0),
            playbackPos: new THREE.Vector3(-1.8, 0.1, 1.8),
            fixedRotation: new THREE.Euler(-0.58, 0.52, -0.12) 
        };

        mesh.position.copy(mesh.userData.gridPos);
        mesh.rotation.copy(mesh.userData.fixedRotation);
        cdScene.add(mesh);
        cdCubes.push(mesh);
    });
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
            
            // 3D to 2D projection logic: perfectly maps the DOM halo over the 3D cube
            if (i === cdSelectedIndex && halo && rect) {
                const pos = cube.position.clone();
                pos.project(cdCamera);
                
                const x = (pos.x * 0.5 + 0.5) * rect.width;
                const y = -(pos.y * 0.5 - 0.5) * rect.height;
                
                halo.style.left = `${x}px`;
                halo.style.top = `${y}px`;
                halo.style.opacity = 1;
            }

        } else {
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

function formatCDTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m} min. ${s} sec.`;
}

function startCDTimer() {
    clearInterval(cdTimerInterval);
    cdTimerInterval = setInterval(() => {
        if (!cdIsPlaying) return;
        cdPlaybackTime++;
        const currentTrack = CD_TRACKS[cdPlayingIndex];
        if (cdPlaybackTime >= currentTrack.duration) {
            cdPlaybackTime = 0;
        }
        document.getElementById("cd-playback-time").textContent = formatCDTime(cdPlaybackTime);
    }, 1000);
}

window.confirmCDPlayerSelection = function () {
    window.AudioManager.playSFX("assets/audio/sfx/select.mp3");

    if (cdCurrentView === "GRID") {
        cdCurrentView = "PLAYBACK";
        cdPlayingIndex = cdSelectedIndex;
        cdIsPlaying = true;
        cdPlaybackTime = 0;

        document.getElementById("cd-playback-panel").style.display = "block";
        document.getElementById("cd-playback-title").textContent = CD_TRACKS[cdPlayingIndex].title;
        document.getElementById("cd-playback-time").textContent = formatCDTime(0);
        document.getElementById("cd-confirm-label").textContent = "Play / Pause";

        document.getElementById("ctrl-play").classList.add("active");
        document.getElementById("ctrl-pause").classList.remove("active");

        startCDTimer();
    } else {
        cdIsPlaying = !cdIsPlaying;
        if(cdIsPlaying) {
            document.getElementById("ctrl-play").classList.add("active");
            document.getElementById("ctrl-pause").classList.remove("active");
        } else {
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
        document.getElementById("cd-playback-panel").style.display = "none";
        document.getElementById("cd-confirm-label").textContent = "Enter";
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