// Input command mapper module. Exposes window.dispatchCommand and window.attachInputMapper.
window.dispatchCommand = function (command) {
    if (window.AppState.screen === "BIOS_BROWSER") {
        switch (command) {
            case "UP":
                window.moveBrowserSelection(-1);
                break;
            case "DOWN":
                window.moveBrowserSelection(1);
                break;
            case "CONFIRM":
                window.confirmBrowserSelection();
                break;
            case "VERSION":
                window.openVersionInformation();
                break;
            case "BACK":
                window.AudioManager.playSFX("assets/audio/sfx/back.MP3");
                console.log("Back pressed on Browser Hub");
                break;
            default:
                break;
        }

        return;
    }

    if (window.AppState.screen === "MEMORY_CARD_IDLE") {
        switch (command) {
            case "CONFIRM":
                window.openMemorySaveGrid();
                break;
            case "BACK":
                window.closeMemoryCardPhase();
                break;
            default:
                break;
        }

        return;
    }

    if (window.AppState.screen === "MEMORY_CARD_GRID") {
        switch (command) {
            case "UP":
            case "LEFT":
                window.moveMemorySaveSelection(-1);
                break;
            case "DOWN":
            case "RIGHT":
                window.moveMemorySaveSelection(1);
                break;
            case "CONFIRM":
                window.openSelectedProjectPlaceholder();
                break;
            case "BACK":
                window.closeMemorySaveGrid();
                break;
            default:
                break;
        }

        return;
    }

    if (window.AppState.screen === "PROJECT_OPTIONS") {
        switch (command) {
            case "UP":
            case "LEFT":
                window.moveProjectOptionSelection(-1);
                break;

            case "DOWN":
            case "RIGHT":
                window.moveProjectOptionSelection(1);
                break;

            case "CONFIRM":
                window.confirmProjectOption();
                break;

            case "BACK":
                window.closeProjectDetailScreen();
                break;

            default:
                break;
        }

        return;
    }
};

window.attachInputMapper = function () {
    if (window.__ps2InputMapperAttached) return;
    window.__ps2InputMapperAttached = true;

    document.addEventListener("keydown", event => {
        if (!["BIOS_BROWSER", "MEMORY_CARD_IDLE", "MEMORY_CARD_GRID", "PROJECT_OPTIONS"].includes(window.AppState.screen)) return;

        const key = event.key.toLowerCase();

        if (key === "arrowup" || key === "w") {
            event.preventDefault();
            window.dispatchCommand("UP");
        }

        if (key === "arrowdown" || key === "s") {
            event.preventDefault();
            window.dispatchCommand("DOWN");
        }

        if (key === "arrowleft" || key === "a") {
            event.preventDefault();
            window.dispatchCommand("LEFT");
        }

        if (key === "arrowright" || key === "d") {
            event.preventDefault();
            window.dispatchCommand("RIGHT");
        }

        if (key === "enter" || key === "x") {
            event.preventDefault();
            window.dispatchCommand("CONFIRM");
        }

        if (key === "triangle" || key === "t") {
            event.preventDefault();
            window.dispatchCommand("VERSION");
        }

        if (key === "escape" || key === "backspace" || key === "o") {
            event.preventDefault();
            window.dispatchCommand("BACK");
        }
    });

    document.addEventListener("pointerdown", event => {
        if (!["BIOS_BROWSER", "MEMORY_CARD_IDLE", "MEMORY_CARD_GRID", "PROJECT_OPTIONS"].includes(window.AppState.screen)) return;

        const commandButton = event.target.closest("[data-command]");
        if (commandButton) {
            event.preventDefault();
            window.dispatchCommand(commandButton.dataset.command);
            return;
        }

        const saveButton = event.target.closest("[data-save-index]");
        if (saveButton && window.AppState.screen === "MEMORY_CARD_GRID") {
            event.preventDefault();
            const nextIndex = Number(saveButton.dataset.saveIndex);

            if (window.AppState.selectedSaveIndex === nextIndex) {
                window.openSelectedProjectPlaceholder();
            } else {
                window.AppState.selectedSaveIndex = nextIndex;
                window.updateMemorySaveSelection(true);
            }

            return;
        }

        const projectOptionButton = event.target.closest("[data-project-option-index]");
        if (projectOptionButton && window.AppState.screen === "PROJECT_OPTIONS") {
            event.preventDefault();

            const nextIndex = Number(projectOptionButton.dataset.projectOptionIndex);

            if (window.AppState.selectedProjectOptionIndex === nextIndex) {
                window.confirmProjectOption();
            } else {
                window.AppState.selectedProjectOptionIndex = nextIndex;
                window.updateProjectOptionSelection(true);
            }

            return;
        }

        const optionButton = event.target.closest("[data-browser-option]");
        if (optionButton) {
            event.preventDefault();
            const selectedOption = optionButton.dataset.browserOption;

            if (window.AppState.browserSelection === selectedOption) {
                window.confirmBrowserSelection();
            } else {
                window.AppState.setBrowserSelection(selectedOption);
            }
        }
    });

    document.addEventListener("mouseover", event => {
        if (!["BIOS_BROWSER", "MEMORY_CARD_GRID"].includes(window.AppState.screen)) return;

        const projectOptionButton = event.target.closest("[data-project-option-index]");
        if (projectOptionButton && window.AppState.screen === "PROJECT_OPTIONS") {
            const nextIndex = Number(projectOptionButton.dataset.projectOptionIndex);

            if (window.AppState.selectedProjectOptionIndex !== nextIndex) {
                window.AppState.selectedProjectOptionIndex = nextIndex;
                window.updateProjectOptionSelection(true);
            }

            return;
        }

        if (window.AppState.screen === "MEMORY_CARD_GRID") {
            const saveButton = event.target.closest("[data-save-index]");
            if (!saveButton) return;

            const nextIndex = Number(saveButton.dataset.saveIndex);
            if (window.AppState.selectedSaveIndex !== nextIndex) {
                window.AppState.selectedSaveIndex = nextIndex;
                window.updateMemorySaveSelection(true);
            }

            return;
        }

        if (window.AppState.screen === "BIOS_BROWSER") {
            const optionButton = event.target.closest("[data-browser-option]");
            if (!optionButton) return;
            window.AppState.setBrowserSelection(optionButton.dataset.browserOption, true);
        }
    });
};
