// ==========================================
// PHASE 2D: PROJECT DETAIL / RAINBOW OPTIONS
// ==========================================

const CASE_STUDY_DB = {
    "clarifi": `
        <p><strong>MISSION:</strong> Stop renting your data. ClariFi was built to return financial sovereignty to independent creators and solo operators.</p>
        <h3>I. SYSTEM ARCHITECTURE</h3>
        <ul>
            <li><strong>Offline-First Paradigm:</strong> Utilizes a hardened <code>localStorage</code> wrapper, ensuring ledgers are accessible with zero latency and zero network dependency.</li>
            <li><strong>State Management:</strong> Driven by a robust, custom <code>useWorkspace</code> hook that handles business logic, state synchronization, and historical data persistence directly within the user’s browser environment.</li>
            <li><strong>Component Framework:</strong> Architected with React & Tailwind CSS for extreme portability across web and hybrid mobile environments (Expo roadmap integration).</li>
        </ul>
        <h3>II. UX PHILOSOPHY</h3>
        <p>Traditional finance apps obscure raw data behind locked, proprietary ecosystems and forced cloud dependencies. ClariFi exposes a raw, tactical ledger that users own outright, wrapped in a high-contrast, distraction-free UI built to provide immediate, actionable financial intelligence.</p>
    `,
    "dave": `
        <p><strong>MISSION:</strong> D.A.V.E. (Direct Agentic Versioning Engine) is a local-first autonomous coding agent governed by a deterministic, bimodal state machine that prevents infinite loops and hallucinations.</p>
        <h3>I. EXECUTION PIPELINE</h3>
        <ul>
            <li><strong>Model Infrastructure:</strong> Capable of running offline via Ollama or through proxy-based cloud API engines, optimized for token-efficient, local-first structural editing.</li>
            <li><strong>Code Manipulation:</strong> Combines LibCST for syntax-safe AST structural edits with regex-based primitives for non-Python file modification and terminal-level task execution.</li>
            <li><strong>State Machine:</strong> Enforces a strict Bimodal Unified State Machine across Scout, Plan, Execute, and Chat phases to decouple strategic reasoning from physical code mutation.</li>
            <li><strong>Memory Architecture:</strong> Features dynamic heat-map decay for context management and an on-demand memory router that injects dense, structural language schemas only when relevant.</li>
        </ul>
        <h3>II. FRONTEND GUI</h3>
        <p>Wrapped in a custom CustomTkinter observability suite, providing live telemetry, project tree visualization, and a collapsible accordion-style turn renderer for managing high-volume communication streams.</p>
    `,
    "dave_architecture": `
        <p><strong>SYSTEM SCHEMATIC:</strong> D.A.V.E. Core Engine Architecture.</p>
        <h3>I. BIMODAL STATE MACHINE</h3>
        <ul>
            <li><strong>State Matrix:</strong> Strict enforcement of [SCOUT] ➔ [PLAN] ➔ [EXECUTE] ➔ [VERIFY] phases using a deterministic bimodal state machine to prevent LLM hallucination cascades and infinite loops.</li>
            <li><strong>Context Manager:</strong> Rolling heat-map decay drops stale file frequencies, while an on-demand memory router injects dense, structural language schemas based on real-time prompt overlap.</li>
        </ul>
        <h3>II. DATA FLOW SCHEMATIC</h3>
        <pre>
[User Input] ➔ [Helmet Injector (System Prompt)]
                               │
            ┌──────────────────┴─────────────────────────┐
            │          Bimodal State Logic               │
            │  [Scout] ➔ [Plan] ➔ [Execute] ➔ [Verify] │
            └──────────┬──────────────────┬──────────────┘
                       │                  │
           ┌───────────▼──────┐  ┌────────▼────────┐
           │ AST Mutation Ops │  │ Tool Execution  │
           │ (LibCST Surgery) │  │ (Run/Rename/Del)│
           └───────────┬──────┘  └────────┬────────┘
                       │                  │
            ┌──────────▼──────────────────▼──────┐
            │       Workspace & File System      │
            └──────────┬─────────────────────────┘
                       │
            ┌──────────▼──────────┐
            │   Telemetry Stream  │ ➔ [GUI Accordion UI]
            └─────────────────────┘
        </pre>
        <h3>III. MUTATION ENGINE (LibCST)</h3>
        <ul>
            <li><strong>AST Surgery:</strong> Direct string replacement is restricted. All Python operations are parsed into Abstract Syntax Trees, surgically mutated at the node level, and re-compiled to guarantee syntax integrity.</li>
            <li><strong>Fallback Primitives:</strong> Standard Regex wrappers manage non-Python formats (CSS, HTML, JS) with strict dry-run validation guardrails executed prior to every disk write.</li>
        </ul>
        <h3>IV. ASYNC TELEMETRY GUI</h3>
        <p>A multi-threaded <code>CustomTkinter</code> GUI runs parallel to the asynchronous execution engine, mapping real-time reasoning JSON and tool outputs into an expandable accordion-card UI without blocking the agent’s core compute loop.</p>
    `,
    "deadspace / space the Menace": `
        <p><strong>MISSION:</strong> Create a deeply personal, digital sanctuary for intimate musical expression and a second social media for fans.</p>
        <h3>I. TECHNICAL DEPLOYMENT</h3>
        <ul>
            <li><strong>Core Stack:</strong> Built entirely on raw HTML5, CSS3, and vanilla JavaScript to avoid framework bloat and maintain a raw, unabstracted feel.</li>
            <li><strong>Audio Engine:</strong> Custom web-audio and video implementation prioritizing immediate playback and seamless track transitions without relying on external embed players.</li>
        </ul>
        <h3>II. AESTHETIC DESIGN</h3>
        <p>The UI strips away modern web conventions, utilizing stark contrasts and minimal typography to force the user's focus entirely onto the sonic experience.</p>
    `,
    "midnight-anarchy": `
        <p><strong>MISSION:</strong> Establish a digital home base and operational launchpad for a party thrower's collective, streamlining event access.</p>
        <h3>I. SYSTEM ARCHITECTURE</h3>
        <ul>
            <li><strong>Ticketing Engine:</strong> Integrated logic to handle user validation, RSVPs, and friction-free event entry flow directly from the browser.</li>
            <li><strong>Mobile Optimization:</strong> The vanilla JS/CSS3 stack ensures maximum reach and zero latency, crucial for users accessing the site on unreliable mobile networks at the door.</li>
        </ul>
        <h3>II. VISUAL IDENTITY</h3>
        <p>Designed to reflect underground nightlife aesthetics, balancing chaotic visual energy with highly structured, conversion-optimized call-to-actions.</p>
    `,
    "yt-intel": `
        <p><strong>MISSION:</strong> Extract actionable strategies and deep metrics from raw, unstructured YouTube platform noise.</p>
        <h3>I. DATA INGESTION</h3>
        <ul>
            <li><strong>Scraping Engine:</strong> Python-based extraction layer that securely pulls down channel metrics, engagement ratios, and comment sentiments.</li>
            <li><strong>Data Normalization:</strong> Raw CSV outputs are sanitized and structured using native Python libraries before being fed into the intelligence layer.</li>
        </ul>
        <h3>II. LLM ANALYTICS</h3>
        <p>Integrates with external API endpoints to contextualize the data, generating automated PDF reports via <code>fpdf</code> that highlight growth vectors and content gaps.</p>
    `,
    "the-nanny-union-agency": `
        <p><strong>MISSION:</strong> Project a premium, high-trust digital storefront for a discerning childcare agency targeting high-net-worth families.</p>
        <h3>I. INFRASTRUCTURE</h3>
        <ul>
            <li><strong>Deployment:</strong> Hosted on Vercel for optimal delivery speeds, backed by Truehost DNS routing for stable, global uptime.</li>
            <li><strong>Component Styling:</strong> Heavy utilization of custom CSS and Font Awesome to create a polished, reassuring, and highly professional user interface.</li>
        </ul>
        <h3>II. CONVERSION PIPELINE</h3>
        <p>The architecture maps a clear psychological journey for the user, moving from trust-building brand statements directly into a secure, frictionless inquiry flow.</p>
    `,
    "snack-squad": `
        <p><strong>MISSION:</strong> Build hype, drive engagement, and facilitate initial sales for a dynamic snack company startup.</p>
        <h3>I. INTERACTIVE ELEMENTS</h3>
        <ul>
            <li><strong>3D Integration:</strong> Incorporates <code>Spline</code> to render engaging, interactive 3D product showcases natively within the browser DOM.</li>
            <li><strong>Performance:</strong> Vanilla JavaScript orchestrates the heavy 3D assets to ensure they do not bottleneck the core purchasing flow or tank mobile performance.</li>
        </ul>
        <h3>II. BRAND UX</h3>
        <p>A highly playful, color-rich layout engineered to minimize bounce rates while guiding users seamlessly toward the checkout terminal.</p>
    `,
    "poblano-kl": `
        <p><strong>MISSION:</strong> Capture the vibrant warmth of Old Town Kuala Lumpur's Mexican culinary scene in a highly converting digital format.</p>
        <h3>I. TECHNICAL EXECUTION</h3>
        <ul>
            <li><strong>Lightweight Stack:</strong> Pure HTML/CSS/JS architecture ensures near-instant load times for hungry mobile users searching on the go.</li>
            <li><strong>Asset Management:</strong> Highly compressed visual assets and Font Awesome iconography keep the bandwidth footprint incredibly low.</li>
        </ul>
        <h3>II. USER FLOW</h3>
        <p>Prioritizes direct customer action, placing menus, geolocation data, and reservation triggers within a single thumb-scroll of the landing view.</p>
    `,
    "upperdeck-kl": `
        <p><strong>MISSION:</strong> Reflect the refined, upscale atmosphere of a premium Kuala Lumpur dining establishment through a minimalist web interface.</p>
        <h3>I. UI/UX ENGINEERING</h3>
        <ul>
            <li><strong>Typographic Hierarchy:</strong> Utilizes sophisticated font pairings and generous whitespace to communicate luxury and exclusivity.</li>
            <li><strong>Motion Design:</strong> Subtle, CSS-driven entrance animations guide the eye without overwhelming the sophisticated aesthetic.</li>
        </ul>
        <h3>II. ARCHITECTURE</h3>
        <p>Engineered entirely without heavy frontend frameworks to maintain a snappy, elegant user experience that seamlessly bridges the gap between viewing the menu and booking a table.</p>
    `,
    "default": `
        <p><strong>SYSTEM LOG ENTRY:</strong> Archival data retrieved.</p>
        <h3>I. OVERVIEW</h3>
        <p>This project was engineered to solve specific operational bottlenecks using targeted technical stacks. Focus was placed on rapid prototyping, clean component architecture, and high-performance delivery.</p>
        <h3>II. TECHNICAL HIGHLIGHTS</h3>
        <ul>
            <li>Frontend state manipulation and dynamic DOM updates.</li>
            <li>Responsive design protocols ensuring parity across mobile and desktop environments.</li>
            <li>Integration of modern build tools and deployment pipelines.</li>
        </ul>
        <p><em>* Further technical breakdowns are currently locked in archival storage. *</em></p>
    `
};

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

    // Only spin the specific System Profile CD
    if (project.id === "system-profile") {
        preview.classList.add("spin-disc");
    } else {
        preview.classList.remove("spin-disc");
    }

    title.textContent = project.title;
    subtitle.textContent = project.subtitle;
    meta.textContent = `${project.status} / ${project.size}`;

    // Wrap in an inner div for GSAP sliding, cleanly parsing <br> tags
    description.innerHTML = `<div id="desc-inner">${project.description}</div>`;

    // Reset inner scroll position on load
    const inner = document.getElementById("desc-inner");
    if (inner) {
        inner._bioOffset = 0;
        gsap.set(inner, { y: 0 });
    }

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

function confirmProjectOption() {
    const project = getSelectedProject();
    const options = getProjectOptions(project);
    const selected = options[window.AppState.selectedProjectOptionIndex];

    window.AudioManager.playSFX("assets/audio/sfx/select.mp3");

    // Handle GSAP sliding for the Bio Text (no native scrolling)
    if (selected === "Read More") {
        const descBox = document.getElementById("project-detail-description");
        const inner = document.getElementById("desc-inner");

        if (descBox && inner) {
            // Added a 15px buffer so the final descender letters aren't clipped by the box edge
            const maxShift = -(inner.scrollHeight - descBox.clientHeight) - 15;

            // Only engage if the text is actually longer than the box
            if (maxShift < 0) {
                if (typeof inner._bioOffset === "undefined") inner._bioOffset = 0;

                // If we are already resting at the very bottom, loop back to the top
                if (inner._bioOffset <= maxShift + 5) {
                    inner._bioOffset = 0;
                } else {
                    // Otherwise, scroll down by roughly 4-5 lines of text
                    inner._bioOffset -= 75;

                    // Clamp it exactly to the bottom if the jump exceeds the remaining text
                    if (inner._bioOffset < maxShift) {
                        inner._bioOffset = maxShift;
                    }
                }

                gsap.to(inner, {
                    y: inner._bioOffset,
                    duration: 0.45,
                    ease: "power2.inOut"
                });
            }
        }
        return;
    }

    // Both Case Study and Architecture use the retro Data Viewer terminal
    if (selected === "Case Study" || selected === "Architecture") {
        openCaseStudyViewer(project, selected);
    } else if (selected === "Live Site" && project.liveUrl) {
        window.open(project.liveUrl, "_blank", "noopener,noreferrer");
    } else if (selected === "Repository" && project.repoUrl) {
        window.open(project.repoUrl, "_blank", "noopener,noreferrer");
    }
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

// --- CASE STUDY VIEWER LOGIC ---

function injectCaseStudyDOM() {
    if (!document.getElementById("ps2-loading-screen")) {
        const loader = document.createElement("div");
        loader.id = "ps2-loading-screen";
        loader.innerHTML = `<div class="loading-text-blink">Now Loading...</div>`;
        document.body.appendChild(loader);
    }

    if (!document.getElementById("case-study-viewer")) {
        const viewer = document.createElement("div");
        viewer.id = "case-study-viewer";
        viewer.innerHTML = `
            <div class="case-study-container">
                <div class="cs-header">
                    <span id="cs-header-title">SYS.LOG :: </span>
                    <span style="opacity: 0.5;">[DATA VIEWER]</span>
                </div>
                <div class="cs-content-area" id="cs-content-area"></div>
                <div class="cs-footer">
                    <div class="v-footer-item">
                        <span style="color: #aaa; font-weight: bold; font-size: 1.2rem;">▲▼</span>
                        <span style="color: #ccc; margin-left: 5px;">Scroll</span>
                    </div>
                    <div class="v-footer-item" id="btn-close-cs">
                        <img src="assets/images/ui/circle.png" class="footer-button-icon" alt="Circle" style="width: 24px;">
                        <span style="color: #ccc; font-weight: bold;">Back</span>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(viewer);
    }
}

function openCaseStudyViewer(project, documentType) {
    injectCaseStudyDOM();
    window.AppState.setScreen("TRANSITIONING");

    const loadingScreen = document.getElementById("ps2-loading-screen");
    const viewer = document.getElementById("case-study-viewer");
    const contentArea = document.getElementById("cs-content-area");

    // Populate Data
    document.getElementById("cs-header-title").textContent = `SYS.LOG :: ${project.id.toUpperCase()} // ${documentType.toUpperCase()}`;
    
    // Create a targeted database key if they asked for Architecture (e.g., "dave_architecture")
    const dbKey = documentType === "Architecture" ? `${project.id}_architecture` : project.id;
    
    // Fetch targeted doc -> fallback to standard case study -> fallback to default log
    contentArea.innerHTML = CASE_STUDY_DB[dbKey] || CASE_STUDY_DB[project.id] || CASE_STUDY_DB["default"];
    contentArea.scrollTop = 0; // Reset scroll

    // PS2 Transition Timeline
    const tl = gsap.timeline({
        onComplete: () => {
            window.AppState.setScreen("CASE_STUDY_VIEWER");
            viewer.style.pointerEvents = "auto";
        }
    });

    tl.to(loadingScreen, { autoAlpha: 1, duration: 0.4, ease: "power1.inOut" })
        .set(".project-detail-panel", { autoAlpha: 0 }) // Hide rainbow panel while screen is black
        .to({}, { duration: 1.4 }) // Artificial classic loading hold
        .set(viewer, { autoAlpha: 1 })
        .to(loadingScreen, { autoAlpha: 0, duration: 0.6, ease: "power1.inOut" });
}

function closeCaseStudyViewer() {
    window.AudioManager.playSFX("assets/audio/sfx/back.mp3");
    window.AppState.setScreen("TRANSITIONING");

    const loadingScreen = document.getElementById("ps2-loading-screen");
    const viewer = document.getElementById("case-study-viewer");
    viewer.style.pointerEvents = "none";

    const tl = gsap.timeline({
        onComplete: () => {
            window.AppState.setScreen("PROJECT_OPTIONS"); // Return controls to the Rainbow screen
        }
    });

    // Reverse Transition
    tl.to(loadingScreen, { autoAlpha: 1, duration: 0.3, ease: "power1.inOut" })
        .set(viewer, { autoAlpha: 0 })
        .set(".project-detail-panel", { autoAlpha: 1 }) // Bring rainbow panel back
        .to({}, { duration: 0.4 }) // Shorter load returning to menu
        .to(loadingScreen, { autoAlpha: 0, duration: 0.5, ease: "power1.inOut" });
}

function scrollCaseStudyViewer(direction) {
    const area = document.getElementById("cs-content-area");
    if (!area) return;
    // Scroll ~40px per key press
    area.scrollBy({ top: direction * 40, behavior: "smooth" });
}

window.createProjectDetailScreen = createProjectDetailScreen;
window.renderProjectDetailScreen = renderProjectDetailScreen;
window.updateProjectOptionSelection = updateProjectOptionSelection;
window.moveProjectOptionSelection = moveProjectOptionSelection;
window.openProjectDetailScreen = openProjectDetailScreen;
window.closeProjectDetailScreen = closeProjectDetailScreen;
window.closeCaseStudyViewer = closeCaseStudyViewer;
window.scrollCaseStudyViewer = scrollCaseStudyViewer;
window.confirmProjectOption = confirmProjectOption;