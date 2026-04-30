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