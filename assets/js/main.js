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
  // Register the plugin
  gsap.registerPlugin(ScrollTrigger);

  /* ==========================================================================
     1. SMOOTH FADE-UP ANIMATIONS (For Non-Project Sections)
     ========================================================================== */
  // Target headers, paragraphs, and cards outside of the pinned projects
  const fadeElements = gsap.utils.toArray('.hero-content > *, .philosophy-grid > div, .service-card, .investment-card, .contact-section h1, .contact-section p, .contact-grid a');

  fadeElements.forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 85%", // Triggers when the top of the element hits 85% down the viewport
        toggleActions: "play none none reverse" // Plays on scroll down, reverses on scroll up
      },
      y: 40, // Slides up from 40px below
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.1 // If multiple items trigger at once, stagger them slightly
    });
  });

  /* ==========================================================================
     2. PROJECT STACKING EFFECT (Desktop Only)
     ========================================================================== */
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

        // --- THE SENSITIVITY FIXES ---

        // 1. Inertia: Adds a 1.2 second smoothing delay. 
        // Increase this number to make it require more deliberate scrolling.
        scrub: 1.2,

        // 2. Magnetic Snapping: Prevents the need for constant micro-adjustments
        snap: {
          snapTo: [0, 1], // Snaps to either the start (0) or end (1) of the animation
          duration: { min: 0.2, max: 0.6 }, // How fast the magnetic snap happens
          delay: 0.15, // Waits 0.15s after the user stops scrolling before snapping
          ease: "power2.inOut" // Buttery ease for the snap
        }
      });
    });
  });
});