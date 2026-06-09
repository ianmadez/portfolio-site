// Mobile orientation toast module. Exposes window.initMobileOrientationToast.
window.initMobileOrientationToast = function () {
  const toast = document.getElementById("orientation-toast");
  const dismissBtn = document.getElementById("dismiss-toast");

  if (!toast || window.__orientationToastReady) return;
  window.__orientationToastReady = true;

  const updateToast = () => {
    const isMobileWidth = window.innerWidth <= 820;
    const isPortrait = window.innerHeight > window.innerWidth;
    const dismissed = sessionStorage.getItem("ps2OrientationToastDismissed") === "true";

    if (isMobileWidth && isPortrait && !dismissed) {
      toast.classList.remove("hidden");
    } else {
      toast.classList.add("hidden");
    }
  };

  dismissBtn?.addEventListener("pointerdown", event => {
    event.preventDefault();
    sessionStorage.setItem("ps2OrientationToastDismissed", "true");
    toast.classList.add("hidden");
  });

  window.addEventListener("resize", updateToast);
  window.addEventListener("orientationchange", updateToast);

  updateToast();
};
