// ==========================================
// PHASE 2D: PROJECT DETAIL / RAINBOW OPTIONS
// ==========================================

function createProjectDetailScreen() {
    let screen = document.getElementById("project-detail-screen");

    if (screen) return screen;

    screen = document.createElement("section");
    screen.id = "project-detail-screen";
    screen.className = "project-detail-screen hidden";

    screen.innerHTML = `
    <div class="project-detail-panel">
      <div class="project-preview-wrap">
        <div class="project-preview-glow"></div>
        <img id="project-detail-preview" class="project-detail-preview" alt="">
      </div>

      <div class="project-detail-copy">
        <div class="project-memory-label">Memory Card (PS2)/1</div>
        <h1 id="project-detail-title">Project</h1>
        <h2 id="project-detail-subtitle">Subtitle</h2>
        <div id="project-detail-meta" class="project-detail-meta">Status / Size</div>
        <p id="project-detail-description" class="project-detail-description"></p>

        <div id="project-detail-stack" class="project-detail-stack"></div>

        <div id="project-option-list" class="project-option-list"></div>
      </div>

      <div class="project-detail-footer">
        <button class="project-footer-item" data-command="CONFIRM" type="button">
          <img src="assets/images/ui/ex.png" class="footer-button-icon" alt="Cross">
          <span>Enter</span>
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
}

function getSelectedProject() {
    return window.PROJECT_SAVES[window.AppState.selectedSaveIndex];
}

function getProjectOptions(project) {
    if (project.options && project.options.length) {
        return project.options;
    }

    const options = ["Case Study"];

    if (project.liveUrl) options.push("Live Site");
    if (project.repoUrl) options.push("Repository");

    return options;
}

function renderProjectDetailScreen() {
    const project = getSelectedProject();
    const screen = createProjectDetailScreen();

    const preview = screen.querySelector("#project-detail-preview");
    const title = screen.querySelector("#project-detail-title");
    const subtitle = screen.querySelector("#project-detail-subtitle");
    const meta = screen.querySelector("#project-detail-meta");
    const description = screen.querySelector("#project-detail-description");
    const stack = screen.querySelector("#project-detail-stack");
    const optionList = screen.querySelector("#project-option-list");

    const imageSrc = project.screenshot || project.icon;

    preview.src = imageSrc;
    preview.alt = `${project.title} preview`;

    title.textContent = project.title;
    subtitle.textContent = project.subtitle;
    meta.textContent = `${project.status} / ${project.size}`;
    description.textContent = project.description;

    stack.innerHTML = project.stack
        .slice(0, 7)
        .map(item => `<span>${item}</span>`)
        .join("");

    const options = getProjectOptions(project);
    window.AppState.selectedProjectOptionIndex = 0;

    optionList.innerHTML = options
        .map((option, index) => `
      <button
        class="project-option ${index === 0 ? "active" : "muted"}"
        data-project-option-index="${index}"
        type="button"
      >
        ${option}
      </button>
    `)
        .join("");

    updateProjectOptionSelection(false);
}

function updateProjectOptionSelection(playSound = true) {
    const options = [...document.querySelectorAll("[data-project-option-index]")];

    if (!options.length) return;

    options.forEach((option, index) => {
        const isActive = index === window.AppState.selectedProjectOptionIndex;

        option.classList.toggle("active", isActive);
        option.classList.toggle("muted", !isActive);
        option.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    if (playSound) {
        window.AudioManager.playSFX("assets/audio/sfx/tick.mp3");
    }
}

function moveProjectOptionSelection(direction) {
    const project = getSelectedProject();
    const options = getProjectOptions(project);
    const total = options.length;

    window.AppState.selectedProjectOptionIndex += direction;

    if (window.AppState.selectedProjectOptionIndex < 0) {
        window.AppState.selectedProjectOptionIndex = total - 1;
    }

    if (window.AppState.selectedProjectOptionIndex >= total) {
        window.AppState.selectedProjectOptionIndex = 0;
    }

    updateProjectOptionSelection(true);
}

function openProjectDetailScreen() {
    if (window.AppState.screen !== "MEMORY_CARD_GRID") return;

    const memoryScreen = document.getElementById("memory-card-screen");
    const detailScreen = createProjectDetailScreen();

    window.AppState.setScreen("TRANSITIONING");
    window.AudioManager.playSFX("assets/audio/sfx/select.mp3");

    renderProjectDetailScreen();

    detailScreen.classList.remove("hidden");

    gsap.set(detailScreen, {
        autoAlpha: 0,
        filter: "blur(10px)"
    });

    gsap.set(".project-detail-panel", {
        autoAlpha: 0,
        scale: 1.04,
        filter: "brightness(0.85) blur(8px)"
    });

    gsap.set(".project-detail-preview", {
        autoAlpha: 0,
        scale: 0.82,
        y: 18
    });

    gsap.set(".project-detail-copy > *", {
        autoAlpha: 0,
        y: 12
    });

    const timeline = gsap.timeline({
        defaults: { overwrite: "auto" },
        onComplete: () => {
            window.AppState.setScreen("PROJECT_OPTIONS");
        }
    });

    timeline
        .to(memoryScreen, {
            autoAlpha: 0.18,
            filter: "blur(8px)",
            duration: 0.55,
            ease: "power2.inOut"
        }, 0)

        .to(detailScreen, {
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 0.55,
            ease: "power2.out"
        }, 0.1)

        .to(".project-detail-panel", {
            autoAlpha: 1,
            scale: 1,
            filter: "brightness(1) blur(0px)",
            duration: 0.8,
            ease: "power3.out"
        }, 0.15)

        .to(".project-detail-preview", {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 0.75,
            ease: "back.out(1.45)"
        }, 0.35)

        .to(".project-detail-copy > *", {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.055,
            ease: "power2.out"
        }, 0.45);
}

function closeProjectDetailScreen() {
    if (window.AppState.screen !== "PROJECT_OPTIONS") return;

    const memoryScreen = document.getElementById("memory-card-screen");
    const detailScreen = document.getElementById("project-detail-screen");

    window.AppState.setScreen("TRANSITIONING");
    window.AudioManager.playSFX("assets/audio/sfx/back.mp3");

    const timeline = gsap.timeline({
        defaults: { overwrite: "auto" },
        onComplete: () => {
            detailScreen.classList.add("hidden");

            gsap.set(memoryScreen, {
                autoAlpha: 1,
                filter: "blur(0px)"
            });

            window.AppState.setScreen("MEMORY_CARD_GRID");
        }
    });

    timeline
        .to(".project-detail-panel", {
            autoAlpha: 0,
            scale: 1.035,
            filter: "brightness(0.85) blur(8px)",
            duration: 0.45,
            ease: "power2.inOut"
        }, 0)

        .to(detailScreen, {
            autoAlpha: 0,
            filter: "blur(10px)",
            duration: 0.45,
            ease: "power2.inOut"
        }, 0.05)

        .to(memoryScreen, {
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 0.5,
            ease: "power2.out"
        }, 0.15);
}

function confirmProjectOption() {
    const project = getSelectedProject();
    const option = getProjectOptions(project)[window.AppState.selectedProjectOptionIndex];

    window.AudioManager.playSFX("assets/audio/sfx/select.mp3");

    if (option === "Live Site" && project.liveUrl) {
        window.open(project.liveUrl, "_blank", "noopener,noreferrer");
        return;
    }

    if (option === "Repository" && project.repoUrl) {
        window.open(project.repoUrl, "_blank", "noopener,noreferrer");
        return;
    }

    window.showTemporaryPhaseToast(`${project.title} ${option} phase soon`);
}

window.createProjectDetailScreen = createProjectDetailScreen;
window.renderProjectDetailScreen = renderProjectDetailScreen;
window.updateProjectOptionSelection = updateProjectOptionSelection;
window.moveProjectOptionSelection = moveProjectOptionSelection;
window.openProjectDetailScreen = openProjectDetailScreen;
window.closeProjectDetailScreen = closeProjectDetailScreen;
window.confirmProjectOption = confirmProjectOption;