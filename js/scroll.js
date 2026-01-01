// Smooth Scroll Reveal Animations

const observerOptions = {
  root: null,
  rootMargin: '0px 0px -50px 0px',
  threshold: [0.1, 0.25]
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Add revealed class with slight delay for smoother effect
      requestAnimationFrame(() => {
        entry.target.classList.add('revealed');
      });
      
      // Stop observing after reveal for better performance
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all elements with scroll-reveal class
const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
scrollRevealElements.forEach(element => {
  observer.observe(element);
});

// Optimized Parallax Effect for Hero Section
const hero = document.querySelector('.hero');

if (hero) {
  let ticking = false;
  
  const updateParallax = () => {
    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.3;
    
    if (scrolled < window.innerHeight) {
      requestAnimationFrame(() => {
        hero.style.transform = `translate3d(0, ${scrolled * parallaxSpeed}px, 0)`;
      });
    }
    
    ticking = false;
  };
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}

// Optimized Progress Bar on Scroll
const createProgressBar = () => {
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: var(--color-primary);
    z-index: 9999;
    transform: translateZ(0);
    will-change: transform;
    transform-origin: 0 0;
    width: 100%;
    transform: scaleX(0);
    transition: transform 0.1s ease-out;
  `;
  document.body.appendChild(progressBar);
  
  let ticking = false;
  
  const updateProgress = () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = window.pageYOffset / windowHeight;
    
    requestAnimationFrame(() => {
      progressBar.style.transform = `scaleX(${scrolled}) translateZ(0)`;
    });
    
    ticking = false;
  };
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });
};

// Uncomment to enable progress bar
// createProgressBar();

// Scroll to Top Button
const createScrollToTopButton = () => {
  const button = document.createElement('button');
  button.innerHTML = '↑';
  button.setAttribute('aria-label', 'Scroll to top');
  button.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background-color: var(--color-primary);
    color: var(--color-white);
    border: none;
    font-size: 24px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  `;
  
  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.pageYOffset > 300) {
          button.style.opacity = '1';
          button.style.visibility = 'visible';
        } else {
          button.style.opacity = '0';
      button.style.visibility = 'hidden';
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  
  document.body.appendChild(button);
};

// Initialize scroll to top button
createScrollToTopButton();
 
