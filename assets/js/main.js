// Main JS for portfolio
// Add scripts here as needed

document.addEventListener('DOMContentLoaded', () => {
  console.log('Main JS loaded');
});

/* ==========================================================================
   MOBILE MENU LOGIC
   ========================================================================== */
const burgerMenu = document.getElementById('burger-menu');
const mobileNav = document.getElementById('mobile-nav');
const closeMenu = document.getElementById('close-menu');
const mobileLinks = document.querySelectorAll('.mobile-link'); // Grab all mobile links

if (burgerMenu && mobileNav && closeMenu) {
  // Open Menu
  burgerMenu.addEventListener('click', () => {
    mobileNav.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  // Close Menu via 'X'
  closeMenu.addEventListener('click', () => {
    mobileNav.classList.remove('active');
    document.body.style.overflow = 'auto';
  });

  // Close Menu when a link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  });
}

/* ========================
   TESTIMONIAL CAROUSEL
========================== */
document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.carousel-track');
  if (!track) return; // Guard clause in case the section isn't on the page

  const slides = Array.from(track.children);
  const nextButton = document.querySelector('.next-btn');
  const prevButton = document.querySelector('.prev-btn');
  const dotsNav = document.querySelector('.carousel-dots');

  // Create navigation dots dynamically based on the number of slides
  slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.dataset.slide = index;
    dotsNav.appendChild(dot);
  });

  const dots = Array.from(dotsNav.children);
  let currentIndex = 0;
  let autoPlayInterval;

  // Function to move the slide
  const updateCarousel = (index) => {
    track.style.transform = `translateX(-${index * 100}%)`;

    // Update active dot
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
  };

  const moveToNextSlide = () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel(currentIndex);
  };

  const moveToPrevSlide = () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel(currentIndex);
  };

  // Event Listeners for arrow buttons
  nextButton.addEventListener('click', () => {
    moveToNextSlide();
    resetAutoPlay(); // Pause timer if user clicks manually
  });

  prevButton.addEventListener('click', () => {
    moveToPrevSlide();
    resetAutoPlay();
  });

  // Event Listeners for dot navigation
  dotsNav.addEventListener('click', e => {
    const targetDot = e.target.closest('.dot');
    if (!targetDot) return;

    currentIndex = parseInt(targetDot.dataset.slide);
    updateCarousel(currentIndex);
    resetAutoPlay();
  });

  // Auto-play functionality
  const startAutoPlay = () => {
    autoPlayInterval = setInterval(moveToNextSlide, 6000); // Slides every 6 seconds
  };

  const resetAutoPlay = () => {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  };

  // Initialize Autoplay
  startAutoPlay();
});

document.addEventListener("DOMContentLoaded", (event) => {
  // 1. Initialize GSAP instantly so elements don't stay hidden
  gsap.registerPlugin(ScrollTrigger);

  // Smooth Fade-ups
  const fadeElements = gsap.utils.toArray('.hero-content > *, .philosophy-grid > div, .service-card, .investment-card, .contact-section h1, .contact-section p, .contact-grid a');

  fadeElements.forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none reverse"
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.1
    });
  });

  // Project Stacking
  let mm = gsap.matchMedia();
  mm.add("(min-width: 769px)", () => {
    const projects = gsap.utils.toArray('.project');

    projects.forEach((project, i) => {
      const isLast = i === projects.length - 1;

      ScrollTrigger.create({
        trigger: project,
        start: "top top",
        pin: !isLast,
        pinSpacing: false,
        animation: gsap.to(project, {
          opacity: 0.4,
          scale: 0.92,
          yPercent: -5,
          ease: "none"
        }),
        scrub: 1.2,
        snap: {
          snapTo: [0, 1],
          duration: { min: 0.2, max: 0.6 },
          delay: 0.15,
          ease: "power2.inOut"
        }
      });
    });
  });

  /* ==========================================================================
     THE IFRAME FIX: Recalculate ScrollTrigger without delaying initialization
     ========================================================================== */
  // Refresh the math when the heavy iframes and fonts finally finish loading
  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
  });

  // Failsafe: Force a background refresh after 1 second and 3 seconds 
  // just in case an iframe gets stuck or lazy-loads late.
  setTimeout(() => ScrollTrigger.refresh(), 1000);
  setTimeout(() => ScrollTrigger.refresh(), 3000);
});