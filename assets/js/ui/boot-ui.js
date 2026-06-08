// Boot UI module. Exposes window.createBootHeroText.
window.createBootHeroText = function () {
    let hero = document.getElementById("boot-hero-text");
    if (hero) return hero;

    hero = document.createElement("div");
    hero.id = "boot-hero-text";
    hero.className = "boot-hero-text hidden";
    hero.textContent = "IAN MADEZ INTERACTIVE PORTFOLIO";

    document.getElementById("boot-container").appendChild(hero);
    return hero;
};

function createIntroSkipHint() {
    let hint = document.getElementById("intro-skip-hint");

    if (hint) return hint;

    hint = document.createElement("button");
    hint.id = "intro-skip-hint";
    hint.className = "intro-skip-hint hidden";
    hint.type = "button";
    const isTouchDevice =
        window.matchMedia("(pointer: coarse)").matches ||
        "ontouchstart" in window;

    hint.textContent = isTouchDevice
        ? "Tap to skip intro"
        : "Press Enter to skip intro";

    document.getElementById("boot-container").appendChild(hint);

    const updateSkipHintText = () => {
        const isTouchDevice =
            window.matchMedia("(pointer: coarse)").matches ||
            "ontouchstart" in window;

        hint.textContent = isTouchDevice
            ? "Tap to skip intro"
            : "Press Enter to skip intro";
    };

    window.addEventListener("resize", updateSkipHintText);
    window.addEventListener("orientationchange", updateSkipHintText);

    return hint;
}

window.createIntroSkipHint = createIntroSkipHint;
