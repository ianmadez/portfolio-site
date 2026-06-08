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
    menu.classList.remove("hidden");

    window.AppState.setScreen("BIOS_BROWSER");
    window.AppState.browserSelection = "browser";

    window.updateBrowserSelection();
    window.attachInputMapper();
    window.initMobileOrientationToast();

    window.AudioManager.setBGMState("BIOS");
    window.AudioManager.playSFX("assets/audio/sfx/whoosh.mp3");

    gsap.fromTo(menu,
        { opacity: 0, filter: "blur(8px)" },
        { opacity: 1, filter: "blur(0px)", duration: 1.2, ease: "power2.out" }
    );

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

window.openVersionInformation = function () {
    window.AudioManager.playSFX("assets/audio/sfx/select.mp3");
    console.log("PHASE NEXT: Open Version Information / About Me screen");
    window.showTemporaryPhaseToast("Version Information phase next");
};

window.openSystemConfigurationPhase = function () {
    console.log("PHASE NEXT: Open System Configuration");
    window.showTemporaryPhaseToast("System Configuration phase next");
};
