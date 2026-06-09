// Browser UI module. Exposes browser menu helpers.
window.createBrowserMenu = function () {
    let menu = document.getElementById("browser-menu");
    if (menu) return menu;

    menu = document.createElement("div");
    menu.id = "browser-menu";
    menu.className = "browser-menu hidden";

    menu.innerHTML = `
        <div class="browser-options">
            <button class="browser-option active" data-browser-option="browser" type="button">
                Browser
            </button>

            <button class="browser-option muted" data-browser-option="system" type="button">
                System Configuration
            </button>
        </div>

        <div class="browser-footer">
            <button class="footer-item" data-command="CONFIRM" type="button">
                <img src="assets/images/ui/ex.png" class="footer-button-icon" alt="Cross">
                <span>Enter</span>
            </button>

            <button class="footer-item version-item" data-command="VERSION" type="button">
                <img src="assets/images/ui/triangle.png" class="footer-button-icon" alt="Triangle">
                <span>Version</span>
            </button>
        </div>
    `;

    document.getElementById("boot-container").appendChild(menu);
    return menu;
};

window.showBrowserMenu = function () {
    const menu = window.createBrowserMenu();

    gsap.killTweensOf(menu);
    menu.classList.remove("hidden");

    gsap.set(menu, {
        autoAlpha: 0,
        opacity: 0,
        visibility: "visible",
        filter: "blur(8px)",
        pointerEvents: "auto"
    });

    window.AppState.setScreen("BIOS_BROWSER");
    window.AppState.browserSelection = "browser";

    window.updateBrowserSelection();
    window.attachInputMapper();
    window.initMobileOrientationToast();

    window.AudioManager.setBGMState("BIOS");
    window.AudioManager.playSFX("assets/audio/sfx/whoosh.mp3");

    gsap.to(menu, {
        autoAlpha: 1,
        opacity: 1,
        visibility: "visible",
        filter: "blur(0px)",
        duration: 1.2,
        ease: "power2.out"
    });

    const introSkipHint = document.getElementById("intro-skip-hint");

    if (introSkipHint) {
        gsap.to(introSkipHint, {
            autoAlpha: 0,
            duration: 0.25,
            ease: "power2.out",
            onComplete: () => introSkipHint.classList.add("hidden")
        });
    }
};

window.updateBrowserSelection = function () {
    const options = document.querySelectorAll("[data-browser-option]");

    options.forEach(option => {
        const isActive = option.dataset.browserOption === window.AppState.browserSelection;

        option.classList.toggle("active", isActive);
        option.classList.toggle("muted", !isActive);
        option.setAttribute("aria-selected", isActive ? "true" : "false");
    });
};

window.moveBrowserSelection = function (direction) {
    const order = ["browser", "system"];
    const currentIndex = order.indexOf(window.AppState.browserSelection);

    let nextIndex = currentIndex + direction;

    if (nextIndex < 0) nextIndex = order.length - 1;
    if (nextIndex >= order.length) nextIndex = 0;

    window.AppState.setBrowserSelection(order[nextIndex]);
};

window.confirmBrowserSelection = function () {
    window.AudioManager.playSFX("assets/audio/sfx/select.mp3");

    if (window.AppState.browserSelection === "browser") {
        window.openMemoryCardPhase();
        return;
    }

    if (window.AppState.browserSelection === "system") {
        window.openSystemConfigurationPhase();
    }
};

window.openSystemConfigurationPhase = function () {
    window.openSystemConfigScreen();
};

function returnToPowerButton() {
    const browserMenu = document.getElementById("browser-menu");
    const powerBtn = document.getElementById("power-button");

    window.AppState.setScreen("TRANSITIONING");

    window.AudioManager.playSFX("assets/audio/sfx/back.mp3");
    window.AudioManager.setBGMState("SILENCE");

    gsap.to([browserMenu, "#boot-canvas"], {
        autoAlpha: 0,
        filter: "blur(8px)",
        duration: 0.7,
        ease: "power2.inOut",
        onComplete: () => {
            if (browserMenu) {
                gsap.set(browserMenu, {
                    autoAlpha: 0,
                    opacity: 0,
                    visibility: "hidden",
                    filter: "blur(8px)",
                    pointerEvents: "none"
                });
                browserMenu.classList.add("hidden");
            }

            if (typeof window.resetBootForPowerButton === "function") {
                window.resetBootForPowerButton();
            }

            gsap.set("#boot-canvas", {
                autoAlpha: 0,
                filter: "blur(0px)"
            });

            if (powerBtn) {
                powerBtn.classList.remove("hidden");

                gsap.set(powerBtn, {
                    autoAlpha: 0,
                    scale: 0.85,
                    filter: "drop-shadow(0 0 15px rgba(100, 150, 255, 0.4))"
                });

                gsap.to(powerBtn, {
                    autoAlpha: 0.85,
                    scale: 1,
                    duration: 0.8,
                    ease: "power2.out"
                });
            }

            window.AppState.setScreen("BOOT");
        }
    });
}

window.returnToPowerButton = returnToPowerButton;