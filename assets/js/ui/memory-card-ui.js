// Memory card UI module. Exposes memory card UI functions.
window.createMemoryCardScreen = function () {
    let screen = document.getElementById("memory-card-screen");
    if (screen) return screen;

    screen = document.createElement("section");
    screen.id = "memory-card-screen";
    screen.className = "memory-card-screen hidden";

    screen.innerHTML = `
    <div class="memory-card-panel">
      <div class="memory-card-title-left">PS2</div>
      <div class="memory-card-title-right">Memory Card (PS2)/1</div>

      <div class="memory-save-meta">
        <div id="memory-save-title">Memory Card (PS2)/1</div>
        <div id="memory-save-subtitle">7,911 KB Free</div>
      </div>

      <div id="memory-loading-text" class="memory-loading-text hidden">
        Now loading<span class="loading-dots">...</span>
      </div>

      <div id="memory-save-grid-wrapper" class="memory-save-grid-wrapper hidden">
        <div id="memory-save-grid" class="memory-save-grid" aria-label="Project saves"></div>
      </div>

      <div class="memory-card-center">
      <img
        src="assets/images/ui/halo.png"
        class="memory-card-halo"
        alt=""
        aria-hidden="true"
      >

      <div class="memory-card-glow"></div>

      <img
        src="assets/images/ui/memory-card.png"
        class="memory-card-icon"
        alt="Memory Card"
      >
    </div>

      <div class="memory-card-footer">
        <button class="memory-footer-item" data-command="CONFIRM" type="button">
          <img src="assets/images/ui/ex.png" class="footer-button-icon" alt="Cross">
          <span>Enter</span>
        </button>

        <button class="memory-footer-item" data-command="BACK" type="button">
          <img src="assets/images/ui/circle.png" class="footer-button-icon" alt="Circle">
          <span>Back</span>
        </button>
      </div>
    </div>
  `;

    document.getElementById("boot-container").appendChild(screen);
    return screen;
};

window.createScreenFadeOverlay = function () {
    let overlay = document.getElementById("screen-fade-overlay");
    if (overlay) return overlay;

    overlay = document.createElement("div");
    overlay.id = "screen-fade-overlay";
    overlay.className = "screen-fade-overlay";

    document.getElementById("boot-container").appendChild(overlay);
    return overlay;
};

window.renderMemorySaveGrid = function () {
    const grid = document.getElementById("memory-save-grid");
    if (!grid) return;

    grid.innerHTML = `
    <img
      src="assets/images/ui/halo.png"
      class="memory-save-selector"
      id="memory-save-selector"
      alt=""
      aria-hidden="true"
    >

    ${window.PROJECT_SAVES.map((save, index) => `
      <button
        class="memory-save-item"
        data-save-index="${index}"
        type="button"
        aria-label="${save.title}"
      >
        <img src="${save.icon}" class="memory-save-icon" alt="">
        <span class="memory-save-label">${save.title}</span>
      </button>
    `).join("")}
  `;

    window.AppState.selectedSaveIndex = 0;

    // Reset Grid Y offset on open
    const gridEl = document.getElementById("memory-save-grid");
    if (gridEl) {
        gridEl._gridYOffset = 0;
        gsap.set(gridEl, { y: 0 });
    }
};

window.updateMemorySaveSelection = function (playSound = true) {
    const items = [...document.querySelectorAll(".memory-save-item")];
    const selector = document.getElementById("memory-save-selector");
    if (!items.length || !selector) return;

    const active = items[window.AppState.selectedSaveIndex];
    const save = window.PROJECT_SAVES[window.AppState.selectedSaveIndex];

    items.forEach((item, index) => {
        const isActive = index === window.AppState.selectedSaveIndex;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    const gridRect = document.getElementById("memory-save-grid").getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();

    const x = activeRect.left - gridRect.left + activeRect.width / 2;
    const y = activeRect.top - gridRect.top + activeRect.height / 2;

    gsap.to(selector, {
        left: x,
        top: y,
        duration: 0.28,
        ease: "power3.out"
    });

    // GSAP translate-Y scroll for the grid (no web scrollbar)
    const gridWrapper = document.getElementById("memory-save-grid-wrapper");
    const gridContainer = document.getElementById("memory-save-grid");
    if (gridContainer && gridWrapper && active) {
        const containerHeight = gridWrapper.clientHeight;
        const itemTop = active.offsetTop;
        const itemHeight = active.offsetHeight;
        // Approximate scroll bounds
        const maxY = -(gridContainer.scrollHeight - containerHeight + 20);

        if (!gridContainer._gridYOffset) gridContainer._gridYOffset = 0;
        let targetY = gridContainer._gridYOffset;

        // If item goes below the bottom edge, shift grid up
        if (itemTop + itemHeight > containerHeight - gridContainer._gridYOffset - 20) {
            targetY = containerHeight - itemTop - itemHeight - 20;
        }

        // If item goes above the top edge, shift grid down
        if (itemTop < -gridContainer._gridYOffset + 20) {
            targetY = -itemTop + 20;
        }

        targetY = Math.min(0, Math.max(maxY, targetY));

        if (targetY !== gridContainer._gridYOffset) {
            gridContainer._gridYOffset = targetY;
            gsap.to(gridContainer, {
                y: targetY,
                duration: 0.28,
                ease: "power2.out"
            });
        }
    }

    const title = document.getElementById("memory-save-title");
    const subtitle = document.getElementById("memory-save-subtitle");

    if (title) title.textContent = "My Projects";
    if (subtitle) subtitle.textContent = `${save.title} / ${save.subtitle} / ${save.size}`;

    if (playSound) {
        window.AudioManager.playSFX("assets/audio/sfx/tick.mp3");
    }
};

window.moveMemorySaveSelection = function (direction) {
    const total = window.PROJECT_SAVES.length;

    window.AppState.selectedSaveIndex += direction;

    if (window.AppState.selectedSaveIndex < 0) {
        window.AppState.selectedSaveIndex = total - 1;
    }

    if (window.AppState.selectedSaveIndex >= total) {
        window.AppState.selectedSaveIndex = 0;
    }

    window.updateMemorySaveSelection(true);
};

window.openSelectedProjectPlaceholder = function() {
    const project = window.PROJECT_SAVES[window.AppState.selectedSaveIndex];
    
    if (project.id === "network-config") {
        if (typeof window.openNetworkConfigScreen === "function") {
            window.openNetworkConfigScreen();
        }
    } else {
        window.openProjectDetailScreen();
    }
}

window.openMemoryCardPhase = function () {
    if (window.AppState.screen !== "BIOS_BROWSER") return;

    const browserMenu = document.getElementById("browser-menu");
    const memoryScreen = window.createMemoryCardScreen();
    const fadeOverlay = window.createScreenFadeOverlay();

    window.AppState.setScreen("TRANSITIONING");

    window.AudioManager.playSFX("assets/audio/sfx/select.mp3");
    window.AudioManager.setBGMState("BROWSER_AREA");

    const transition = gsap.timeline({
        defaults: { overwrite: "auto" }
    });

    transition
        .to(browserMenu, {
            autoAlpha: 0,
            filter: "blur(12px)",
            duration: 1.25,
            ease: "power2.inOut",
            onComplete: () => browserMenu.classList.add("hidden")
        }, 0)

        .to("#boot-canvas", {
            autoAlpha: 0,
            filter: "blur(10px)",
            duration: 1.35,
            ease: "power2.inOut"
        }, 0)

        .to(fadeOverlay, {
            autoAlpha: 1,
            duration: 1.4,
            ease: "sine.inOut"
        }, 0.75)

        .add(() => {
            memoryScreen.classList.remove("hidden");

            gsap.set(memoryScreen, {
                autoAlpha: 1
            });

            gsap.set(".memory-card-panel", {
                autoAlpha: 0,
                filter: "brightness(0.35) blur(12px)",
                scale: 1.025
            });

            gsap.set(".memory-card-icon", {
                autoAlpha: 0,
                scale: 0.86,
                y: 8,
                filter: "brightness(0.45) grayscale(0.55) contrast(0.85)"
            });

            gsap.set(".memory-card-halo", {
                autoAlpha: 0,
                scale: 0.45,
                rotate: -8,
                filter: "invert(1) blur(8px) brightness(0.8)"
            });

            gsap.set(".memory-card-glow", {
                autoAlpha: 0,
                scale: 0.35
            });
        }, 2.05)

        .to(fadeOverlay, {
            autoAlpha: 0,
            duration: 1.75,
            ease: "sine.inOut"
        }, 2.25)

        .to(".memory-card-panel", {
            autoAlpha: 1,
            filter: "brightness(1) blur(0px)",
            scale: 1,
            duration: 1.8,
            ease: "power2.out"
        }, 2.35)

        .to(".memory-card-halo", {
            autoAlpha: 0.92,
            scale: 1,
            rotate: 0,
            filter: "invert(1) blur(0px) brightness(1.45)",
            duration: 0.85,
            ease: "power3.out"
        }, 2.15)

        .to(".memory-card-glow", {
            autoAlpha: 0.85,
            scale: 1,
            duration: 1.35,
            ease: "power2.out"
        }, 3.2)

        .to(".memory-card-icon", {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            filter: "brightness(0.78) grayscale(0.5) contrast(0.88)",
            duration: 1.35,
            ease: "power3.out"
        }, 3.3)

        .add(() => {
            window.AppState.setScreen("MEMORY_CARD_IDLE");
            gsap.killTweensOf([".memory-card-halo", ".memory-card-glow"]);

            gsap.to(".memory-card-halo", {
                scale: 1.04,
                duration: 1.4,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });

            gsap.to(".memory-card-glow", {
                autoAlpha: 0.55,
                scale: 1.05,
                duration: 1.4,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }, 4.75);
};

window.closeMemoryCardPhase = function () {
    if (window.AppState.screen !== "MEMORY_CARD_IDLE") return;

    const browserMenu = document.getElementById("browser-menu");
    const memoryScreen = document.getElementById("memory-card-screen");
    const fadeOverlay = window.createScreenFadeOverlay();

    window.AppState.setScreen("TRANSITIONING");
    window.AudioManager.playSFX("assets/audio/sfx/back.mp3");
    gsap.killTweensOf([".memory-card-halo", ".memory-card-glow"]);

    const transition = gsap.timeline({
        defaults: { overwrite: "auto" },
        onComplete: () => {
            memoryScreen.classList.add("hidden");

            if (browserMenu) {
                browserMenu.classList.remove("hidden");
                gsap.set(browserMenu, {
                    autoAlpha: 1,
                    filter: "blur(0px)"
                });
            }

            gsap.set("#boot-canvas", {
                autoAlpha: 1,
                filter: "blur(0px)"
            });

            window.AppState.setScreen("BIOS_BROWSER");
            window.AudioManager.setBGMState("BIOS");
        }
    });

    transition
        .to(".memory-card-halo", {
            autoAlpha: 0,
            scale: 0.72,
            filter: "invert(1) blur(8px) brightness(0.6)",
            duration: 0.65,
            ease: "power2.inOut"
        }, 0)

        .to(".memory-card-glow", {
            autoAlpha: 0,
            scale: 0.65,
            duration: 0.65,
            ease: "power2.inOut"
        }, 0)

        .to(".memory-card-icon", {
            autoAlpha: 0,
            scale: 0.9,
            y: 8,
            filter: "brightness(0.4) grayscale(0.7)",
            duration: 0.7,
            ease: "power2.inOut"
        }, 0.05)

        .to(".memory-card-panel", {
            autoAlpha: 0,
            filter: "brightness(0.35) blur(12px)",
            scale: 1.018,
            duration: 0.9,
            ease: "power2.inOut"
        }, 0.15)

        .to(fadeOverlay, {
            autoAlpha: 1,
            duration: 0.8,
            ease: "sine.inOut"
        }, 0.65)

        .add(() => {
            if (browserMenu) {
                browserMenu.classList.remove("hidden");
                gsap.set(browserMenu, {
                    autoAlpha: 0,
                    filter: "blur(8px)"
                });
            }

            gsap.set("#boot-canvas", {
                autoAlpha: 0,
                filter: "blur(8px)"
            });
        }, 1.35)

        .to(fadeOverlay, {
            autoAlpha: 0,
            duration: 1.15,
            ease: "sine.inOut"
        }, 1.55)

        .to("#boot-canvas", {
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 1.15,
            ease: "power2.out"
        }, 1.65)

        .to(browserMenu, {
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 1.15,
            ease: "power2.out"
        }, 1.72);
};

window.openMemorySaveGrid = function () {
    if (window.AppState.screen !== "MEMORY_CARD_IDLE") return;

    const cardCenter = document.querySelector(".memory-card-center");
    const loadingText = document.getElementById("memory-loading-text");
    const saveGrid = document.getElementById("memory-save-grid");

    document.getElementById("memory-card-screen").classList.add("grid-active");
    window.AppState.setScreen("MEMORY_CARD_LOADING");
    window.AudioManager.playSFX("assets/audio/sfx/select.mp3");

    window.renderMemorySaveGrid();

    const timeline = gsap.timeline({
        defaults: { overwrite: "auto" },
        onComplete: () => {
            window.AppState.setScreen("MEMORY_CARD_GRID");
            window.updateMemorySaveSelection(false);
        }
    });

    timeline
        .to(cardCenter, {
            autoAlpha: 0,
            scale: 0.72,
            filter: "blur(8px)",
            duration: 0.55,
            ease: "power2.inOut"
        }, 0)

        .add(() => {
            loadingText.classList.remove("hidden");
        }, 0.78)

        .fromTo(loadingText,
            {
                autoAlpha: 0,
                xPercent: -50,
                yPercent: -50,
                y: 8,
                filter: "blur(6px)"
            },
            {
                autoAlpha: 1,
                xPercent: -50,
                yPercent: -50,
                y: 0,
                filter: "blur(0px)",
                duration: 0.55,
                ease: "power2.out"
            },
            0.3
        )

        .add(() => {
            document.getElementById("memory-save-grid-wrapper").classList.remove("hidden");
            gsap.set(".memory-save-item", {
                autoAlpha: 0,
                scale: 0.72,
                y: 18,
                rotation: -6
            });

            gsap.set("#memory-save-selector", {
                autoAlpha: 0,
                scale: 0.55,
                left: 0,
                top: 0
            });
        }, 1.25)

        .to(".memory-save-item", {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            rotation: 0,
            duration: 0.45,
            stagger: 0.095,
            ease: "back.out(1.7)"
        }, 1.35)

        .to(loadingText, {
            autoAlpha: 0,
            xPercent: -50,
            yPercent: -50,
            y: -6,
            filter: "blur(6px)",
            duration: 0.45,
            ease: "power2.inOut",
            onComplete: () => loadingText.classList.add("hidden")
        }, 1.85)

        .add(() => {
            window.AppState.selectedSaveIndex = 0;

            requestAnimationFrame(() => {
                updateMemorySaveSelection(false);

                gsap.fromTo("#memory-save-selector",
                    {
                        autoAlpha: 0,
                        scale: 0.55
                    },
                    {
                        autoAlpha: 0.92,
                        scale: 1,
                        duration: 0.55,
                        ease: "power2.out"
                    }
                );
            });
        }, 2.12)
};

window.closeMemorySaveGrid = function () {
    if (window.AppState.screen !== "MEMORY_CARD_GRID") return;

    const cardCenter = document.querySelector(".memory-card-center");
    const saveGrid = document.getElementById("memory-save-grid");

    window.AppState.setScreen("MEMORY_CARD_LOADING");
    window.AudioManager.playSFX("assets/audio/sfx/back.mp3");

    const timeline = gsap.timeline({
        defaults: { overwrite: "auto" },
        onComplete: () => {
            document.getElementById("memory-save-grid-wrapper").classList.add("hidden");
            gsap.set(cardCenter, {
                autoAlpha: 1,
                scale: 1,
                rotationX: 0,
                rotationY: 0,
                rotationZ: 0,
                z: 0,
                filter: "blur(0px)",
                clearProps: "transform"
            });

            document.getElementById("memory-save-title").textContent = "My Projects";
            document.getElementById("memory-save-subtitle").textContent = "7,911 KB Free";
            document.getElementById("memory-card-screen").classList.remove("grid-active");
            window.AppState.setScreen("MEMORY_CARD_IDLE");
        }
    });

    timeline
        .to("#memory-save-selector", {
            autoAlpha: 0,
            scale: 0.55,
            duration: 0.28,
            ease: "power2.inOut"
        }, 0)

        .to(".memory-save-item", {
            autoAlpha: 0,
            scale: 0.76,
            y: 14,
            rotation: 5,
            duration: 0.32,
            stagger: 0.045,
            ease: "power2.inOut"
        }, 0.05)

        .to(cardCenter, {
            autoAlpha: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.5,
            ease: "power2.out"
        }, 0.45);
};
