// App controller module. Initializes the application and boot sequence.
(function () {
    let bootSessionId = 0;
    let bootTimeline = null;
    let browserRevealCall = null;

    function createBootTimeline(sessionId) {
        const powerBtn = document.getElementById("power-button");
        const textContainer = document.getElementById("boot-text-container");
        const heroText = window.createBootHeroText();
        const introSkipHint = document.getElementById("intro-skip-hint");

        textContainer.classList.remove("hidden");
        gsap.set(textContainer, {
            autoAlpha: 0,
            scale: 2,
            y: 0,
            force3D: true,
            transformOrigin: "50% 50%"
        });

        gsap.set(heroText, {
            autoAlpha: 0,
            scale: 0.96,
            filter: "blur(8px)"
        });
        heroText.classList.add("hidden");

        if (introSkipHint) {
            gsap.set(introSkipHint, { autoAlpha: 0 });
            introSkipHint.classList.add("hidden");
        }

        const tl = gsap.timeline({
            paused: true,
            defaults: { overwrite: "auto" }
        });

        tl
            .set(powerBtn, { autoAlpha: 0, scale: 0.75 }, 0)

            // 1. SHOW LEGAL WARNING FIRST (0.0s to 3.5s)
            .add(() => {
                const warning = document.getElementById("legal-warning");
                if (warning) warning.classList.remove("hidden");
            }, 0)
            .fromTo("#legal-warning", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 0)
            
            .to("#legal-warning", { autoAlpha: 0, duration: 0.5, onComplete: () => {
                const warning = document.getElementById("legal-warning");
                if (warning) warning.classList.add("hidden");
            }}, 3.5)

            // 2. TRIGGER ORIGINAL PS2 BOOT (Shifted to start at 4.0s)
            .add(() => {
                window.AudioManager.playBootNoise();
                if (typeof window.triggerBootSequence === "function") window.triggerBootSequence();
            }, 4.0)

            .add(() => {
                heroText.classList.remove("hidden");
                gsap.set(heroText, { visibility: "visible" });
            }, 4.8)

            .fromTo(heroText,
                { autoAlpha: 0, scale: 0.96, filter: "blur(8px)" },
                { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 0.8, ease: "power2.out" },
                4.8
            )

            .to(heroText, {
                autoAlpha: 0, filter: "blur(8px)", duration: 0.9, ease: "power2.inOut",
                onComplete: () => heroText.classList.add("hidden")
            }, 9.0)

            // Towers run for their exact original 16.3s duration
            .to(window.PS2BootScene, {
                towerSpeed: 0.35, duration: 16.3, ease: "power2.in"
            }, 4.0)

            // 3. WOOMP CAMERA AND HERO TEXT SLAM (4.0s start + 16.3s delay = 20.3s)
            .add(() => {
                if (typeof window.hideBootTowers === "function") window.hideBootTowers();
                if (typeof window.triggerWoompCamera === "function") window.triggerWoompCamera();
            }, 20.3)

            .fromTo(textContainer,
                { autoAlpha: 0, scale: 2.15, y: 0, filter: "blur(6px)" },
                { autoAlpha: 1, scale: 1, y: 0, filter: "blur(0px)", duration: 0.22, ease: "power4.out", force3D: true },
                20.3
            )

            .to(textContainer, {
                y: 8, duration: 2.5, repeat: -1, yoyo: true, ease: "sine.inOut"
            }, 20.5)

            // 4. TRANSITION TO PHASE 2 BROWSER HUB
            .add(() => {
                if (typeof window.transitionToPhase2 === "function") window.transitionToPhase2();
                window.AudioManager.setBGMState("BIOS");

                const thisSession = bootSessionId;
                browserRevealCall = gsap.delayedCall(8.5, () => {
                    if (!window.__bootSessionSkipped && bootSessionId === thisSession) {
                        window.showBrowserMenu();
                        
                        // Fire the Controls Toast
                        const toast = document.getElementById("controls-toast");
                        if (toast) {
                            toast.classList.remove("hidden");
                            gsap.fromTo(toast, 
                                { autoAlpha: 0, y: 10 }, 
                                { autoAlpha: 1, y: 0, duration: 0.8, delay: 0.5 }
                            );
                            gsap.to(toast, { 
                                autoAlpha: 0, y: 10, duration: 0.8, delay: 8.5, /* Stays 2 seconds longer */
                                onComplete: () => toast.classList.add("hidden") 
                            });
                        }
                    }
                });
            }, 22.0)

            .to(textContainer, {
                opacity: 0, duration: 1.2, ease: "power2.inOut",
                onComplete: () => textContainer.classList.add("hidden")
            }, 25.8);

        return tl;
    }

    function loadAndApplySettings() {
        const saved = localStorage.getItem("ps2_system_config");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (!window.AppState) window.AppState = {};
                window.AppState.systemConfigValues = parsed;

                const screen = parsed["screen"];
                const container = document.getElementById("boot-container");
                if (container && screen) {
                    if (screen === "Standard (4:3)") {
                        container.style.position = "fixed";
                        container.style.left = "50%";
                        container.style.top = "0";
                        container.style.transform = "translateX(-50%)";
                        container.style.width = "100%";
                        container.style.height = "100%";
                        container.style.maxWidth = "calc(100dvh * (4/3))";
                        container.style.maxHeight = "100dvh";
                        container.style.aspectRatio = "4 / 3";
                    } else if (screen === "Full Screen (16:9)") {
                        container.style.position = "fixed";
                        container.style.left = "50%";
                        container.style.top = "0";
                        container.style.transform = "translateX(-50%)";
                        container.style.width = "100%";
                        container.style.height = "100%";
                        container.style.maxWidth = "calc(100dvh * (16/9))";
                        container.style.maxHeight = "100dvh";
                        container.style.aspectRatio = "16 / 9";
                    }
                }
            } catch (e) { console.error("Memory Card corrupted:", e); }
        }
    }

    function setupBootSequence() {
        loadAndApplySettings();
        const powerBtn = document.getElementById("power-button");
        const textContainer = document.getElementById("boot-text-container");
        const heroText = window.createBootHeroText();
        const introSkipHint = window.createIntroSkipHint();

        window.createBrowserMenu();

        textContainer.classList.remove("hidden");
        gsap.set(textContainer, {
            autoAlpha: 0,
            scale: 2,
            y: 0,
            force3D: true,
            transformOrigin: "50% 50%"
        });

        gsap.set(heroText, {
            autoAlpha: 0,
            scale: 0.96,
            filter: "blur(8px)"
        });
        heroText.classList.add("hidden");

        gsap.set(introSkipHint, { autoAlpha: 0 });
        introSkipHint.classList.add("hidden");

        let bootStarted = false;
        let bootSkipped = false;

        if (typeof window.initTowers === "function") {
            window.initTowers();
        }

        function skipIntroToBrowser() {
            if (bootSkipped) return;
            bootSkipped = true;
            window.__bootSessionSkipped = true;

            if (browserRevealCall) {
                browserRevealCall.kill();
                browserRevealCall = null;
            }

            if (bootTimeline) {
                bootTimeline.pause(0);
            }

            gsap.killTweensOf([
                heroText, textContainer, introSkipHint, "#boot-canvas", "#browser-menu", 
                "#legal-warning", "#controls-toast"
            ]);

            if (window.AudioManager.bootNoise) {
                window.AudioManager.bootNoise.pause();
                window.AudioManager.bootNoise.currentTime = 0;
            }

            if (typeof window.hideBootTowers === "function") {
                window.hideBootTowers();
            }

            if (typeof window.transitionToPhase2 === "function") {
                window.transitionToPhase2();
            }

            gsap.set(heroText, { autoAlpha: 0 });
            gsap.set(textContainer, { autoAlpha: 0 });
            heroText.classList.add("hidden");
            textContainer.classList.add("hidden");

            gsap.to(introSkipHint, {
                autoAlpha: 0,
                duration: 0.25,
                ease: "power2.out",
                onComplete: () => introSkipHint.classList.add("hidden")
            });

            window.AudioManager.setBGMState("BIOS");
            window.showBrowserMenu();
            
            // Fire the Controls Toast when skipping straight to menu
            const toast = document.getElementById("controls-toast");
            if (toast) {
                toast.classList.remove("hidden");
                gsap.fromTo(toast, 
                    { autoAlpha: 0, y: 10 }, 
                    { autoAlpha: 1, y: 0, duration: 0.8, delay: 0.5 }
                );
                gsap.to(toast, { 
                    autoAlpha: 0, y: 10, duration: 0.8, delay: 8.5, 
                    onComplete: () => toast.classList.add("hidden") 
                });
            }
        }

        function resetBootForPowerButton() {
            bootStarted = false;
            bootSkipped = false;
            window.__bootSessionSkipped = false;

            if (browserRevealCall) {
                browserRevealCall.kill();
                browserRevealCall = null;
            }

            gsap.killTweensOf([
                heroText, textContainer, introSkipHint, powerBtn, "#boot-canvas", "#browser-menu", 
                "#memory-card-screen", "#project-detail-screen", "#legal-warning", "#controls-toast"
            ]);

            bootTimeline = null;

            window.PS2BootScene.towerSpeed = 0.004;

            if (typeof window.resetBootSceneForReplay === "function") {
                window.resetBootSceneForReplay();
            }

            // Hide all secondary screens and toasts
            const toast = document.getElementById("controls-toast");
            if (toast) {
                toast.classList.add("hidden");
                gsap.set(toast, { autoAlpha: 0, y: 10, clearProps: "all" });
            }

            const browserMenu = document.getElementById("browser-menu");
            if (browserMenu) {
                browserMenu.classList.add("hidden");
                gsap.set(browserMenu, { autoAlpha: 0, filter: "blur(0px)" });
            }

            const memoryScreen = document.getElementById("memory-card-screen");
            if (memoryScreen) {
                memoryScreen.classList.add("hidden");
                memoryScreen.classList.remove("grid-active");
                gsap.set(memoryScreen, { autoAlpha: 1 });
            }

            const detailScreen = document.getElementById("project-detail-screen");
            if (detailScreen) {
                detailScreen.classList.add("hidden");
                gsap.set(detailScreen, { autoAlpha: 1 });
            }

            gsap.set(heroText, {
                autoAlpha: 0,
                scale: 0.96,
                filter: "blur(8px)"
            });
            gsap.set(textContainer, {
                autoAlpha: 0,
                scale: 2,
                y: 0,
                filter: "blur(0px)"
            });

            heroText.classList.add("hidden");
            textContainer.classList.remove("hidden");
            introSkipHint.classList.add("hidden");

            gsap.set("#boot-canvas", {
                autoAlpha: 0,
                filter: "blur(0px)"
            });
        }

        window.resetBootForPowerButton = resetBootForPowerButton;

        document.addEventListener("keydown", event => {
            if (!bootStarted) return;
            if (window.AppState.screen !== "BOOT") return;

            if (event.key === "Enter") {
                event.preventDefault();
                event.stopImmediatePropagation();
                skipIntroToBrowser();
            }
        });

        introSkipHint.addEventListener("pointerdown", event => {
            event.preventDefault();
            if (!bootStarted) return;
            if (window.AppState.screen !== "BOOT") return;
            skipIntroToBrowser();
        });

        powerBtn.addEventListener("pointerdown", async event => {
            event.preventDefault();
            if (bootStarted) return;
            bootStarted = true;
            bootSessionId++;

            window.__bootSessionSkipped = false;
            // Request fullscreen on touch devices (non-blocking)
            if (window.matchMedia("(pointer: coarse)").matches && document.documentElement.requestFullscreen) {
                try { await document.documentElement.requestFullscreen(); }
                catch (e) { /* fullscreen not supported or denied, continue boot */ }
            }
            if (typeof window.resetBootSceneForReplay === "function") {
                window.resetBootSceneForReplay();
            }

            gsap.killTweensOf(powerBtn);
            powerBtn.classList.add("hidden");
            gsap.set(powerBtn, {
                autoAlpha: 0,
                scale: 0.75,
                clearProps: "filter"
            });

            gsap.set("#boot-canvas", {
                autoAlpha: 1,
                filter: "blur(0px)"
            });

            window.AudioManager.init();

            // Load memory card audio preference
            if (window.AppState && window.AppState.systemConfigValues && window.AppState.systemConfigValues["digital"] === "Off") {
                window.AudioManager.setMuted(true);
            }

            try {
                if (window.AudioManager.ctx && window.AudioManager.ctx.state === "suspended") {
                    await window.AudioManager.ctx.resume();
                }
            } catch (error) {
                console.warn("Audio resume failed, continuing boot without blocking animation:", error);
            }

            window.AudioManager.playSFX("assets/audio/sfx/select.mp3");

            bootTimeline = createBootTimeline(bootSessionId);
            bootTimeline.play(0);

            introSkipHint.classList.remove("hidden");
            gsap.fromTo(introSkipHint,
                { autoAlpha: 0 },
                { autoAlpha: 0.38, duration: 0.8, ease: "power2.out" }
            );
        });
    }

    document.addEventListener("DOMContentLoaded", setupBootSequence);
})();
