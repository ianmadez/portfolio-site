// Developer toast module. Exposes window.showTemporaryPhaseToast.
window.showTemporaryPhaseToast = function (message) {
  let toast = document.getElementById("phase-dev-toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "phase-dev-toast";
    toast.className = "phase-dev-toast";
    document.getElementById("boot-container").appendChild(toast);
  }

  toast.textContent = message;

  gsap.killTweensOf(toast);

  gsap.fromTo(toast,
    { opacity: 0, y: 12, filter: "blur(8px)" },
    { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.35, ease: "power2.out" }
  );

  gsap.to(toast, {
    opacity: 0,
    y: -8,
    filter: "blur(8px)",
    duration: 0.55,
    delay: 1.2,
    ease: "power2.inOut"
  });
};
