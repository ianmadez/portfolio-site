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
            .set(powerBtn, {
                autoAlpha: 0,
                scale: 0.75
            }, 0)

            .add(() => {
                window.AudioManager.playBootNoise();

                if (typeof window.triggerBootSequence === "function") {
                    window.triggerBootSequence();
                }
            }, 0)

            .add(() => {
                heroText.classList.remove("hidden");
                gsap.set(heroText, { visibility: "visible" });
            }, 0.8)

            .fromTo(heroText,
                { autoAlpha: 0, scale: 0.96, filter: "blur(8px)" },
                { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 0.8, ease: "power2.out" },
                0.8
            )

            .to(heroText, {
                autoAlpha: 0,
                filter: "blur(8px)",
                duration: 0.9,
                ease: "power2.inOut",
                onComplete: () => heroText.classList.add("hidden")
            }, 5.0)

            .to(window.PS2BootScene, {
                towerSpeed: 0.35,
                duration: 16.3,
                ease: "power2.in"
            }, 0)

            .add(() => {
                if (typeof window.hideBootTowers === "function") {
                    window.hideBootTowers();
                }

                if (typeof window.triggerWoompCamera === "function") {
                    window.triggerWoompCamera();
                }
            }, 16.3)

            .fromTo(textContainer,
                {
                    autoAlpha: 0,
                    scale: 2.15,
                    y: 0,
                    filter: "blur(6px)"
                },
                {
                    autoAlpha: 1,
                    scale: 1,
                    y: 0,
                    filter: "blur(0px)",
                    duration: 0.22,
                    ease: "power4.out",
                    force3D: true
                },
                16.3
            )

            .to(textContainer, {
                y: 8,
                duration: 2.5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            }, 16.5)

            .add(() => {
                if (typeof window.transitionToPhase2 === "function") {
                    window.transitionToPhase2();
                }

                window.AudioManager.setBGMState("BIOS");

                const thisSession = bootSessionId;
                browserRevealCall = gsap.delayedCall(8.5, () => {
                    if (!window.__bootSessionSkipped && bootSessionId === thisSession) {
                        window.showBrowserMenu();
                    }
                });
            }, 18.0)

            .to(textContainer, {
                opacity: 0,
                duration: 1.2,
                ease: "power2.inOut",
                onComplete: () => textContainer.classList.add("hidden")
            }, 21.8);

        return tl;
    }

    function setupBootSequence() {
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
                heroText,
                textContainer,
                introSkipHint,
                "#boot-canvas",
                "#browser-menu"
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
                heroText,
                textContainer,
                introSkipHint,
                powerBtn,
                "#boot-canvas",
                "#browser-menu",
                "#memory-card-screen",
                "#project-detail-screen"
            ]);

            bootTimeline = null;

            window.PS2BootScene.towerSpeed = 0.004;

            if (typeof window.resetBootSceneForReplay === "function") {
                window.resetBootSceneForReplay();
            }

            // Hide all secondary screens
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
