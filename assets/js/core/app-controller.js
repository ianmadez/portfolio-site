// App controller module. Initializes the application and boot sequence.
(function () {
    function setupBootSequence() {
        const powerBtn = document.getElementById("power-button");
        const textContainer = document.getElementById("boot-text-container");
        const heroText = window.createBootHeroText();

        window.createBrowserMenu();

        const introSkipHint = window.createIntroSkipHint();

        let bootSkipped = false;
        let browserRevealCall = null;

        textContainer.classList.remove("hidden");
        gsap.set(textContainer, {
            autoAlpha: 0,
            scale: 2,
            y: 0,
            force3D: true,
            transformOrigin: "50% 50%"
        });

        let bootStarted = false;

        if (typeof window.initTowers === "function") {
            window.initTowers();
        }

        const bootTimeline = gsap.timeline({
            paused: true,
            defaults: { overwrite: "auto" }
        });

        bootTimeline
            .to(powerBtn, {
                opacity: 0,
                scale: 0.75,
                duration: 0.25,
                ease: "power2.out",
                onComplete: () => powerBtn.classList.add("hidden")
            }, 0)

            .add(() => {
                window.AudioManager.playBootNoise();

                if (typeof window.triggerBootSequence === "function") {
                    window.triggerBootSequence();
                }
            }, 0)

            .add(() => {
                heroText.classList.remove("hidden");
            }, 0.8)

            .fromTo(heroText,
                { opacity: 0, scale: 0.96, filter: "blur(8px)" },
                { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.8, ease: "power2.out" },
                0.8
            )

            .to(heroText, {
                opacity: 0,
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

                browserRevealCall = gsap.delayedCall(8.5, () => {
                    if (!bootSkipped) {
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

        function skipIntroToBrowser() {
            if (bootSkipped) return;

            bootSkipped = true;

            if (browserRevealCall) {
                browserRevealCall.kill();
                browserRevealCall = null;
            }

            if (bootTimeline) {
                bootTimeline.kill();
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

        document.addEventListener("keydown", event => {
            if (!bootStarted) return;
            if (window.AppState.screen !== "BOOT") return;

            if (event.key === "Enter") {
                event.preventDefault();
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

            window.AudioManager.init();

            if (window.AudioManager.ctx && window.AudioManager.ctx.state === "suspended") {
                await window.AudioManager.ctx.resume();
            }

            window.AudioManager.playSFX("assets/audio/sfx/select.mp3");
            bootTimeline.play(0);
            introSkipHint.classList.remove("hidden");

            gsap.fromTo(introSkipHint,
                { autoAlpha: 0 },
                { autoAlpha: 0.38, duration: 0.8, ease: "power2.out" }
            );
        }, { once: true });
    }

    document.addEventListener("DOMContentLoaded", setupBootSequence);
})();
