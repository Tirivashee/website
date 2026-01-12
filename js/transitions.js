// Page Transitions

// Create transition overlay
const createTransitionOverlay = () => {
  if (document.getElementById('page-transition-overlay')) return;
  
  const overlay = document.createElement('div');
  overlay.id = 'page-transition-overlay';
  overlay.className = 'page-transition-overlay';
  
  // Create SVG with liquid morphing path
  overlay.innerHTML = `
    <svg viewBox="0 0 100 100" preserveAspectRatio="none">
      <path d="M 0 100 V 100 Q 50 100 100 100 V 100 z" vector-effect="non-scaling-stroke" />
    </svg>
  `;
  
  document.body.appendChild(overlay);
};

// Page load animation
window.addEventListener('load', () => {
  document.body.classList.add('page-loaded');
  const overlay = document.getElementById('page-transition-overlay');
  if (overlay) {
    setTimeout(() => {
      overlay.classList.remove('active');
    }, 50);
  }
});

// Smooth page transitions on navigation
const setupPageTransitions = () => {
  const links = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href$=".html"], a[href^="index.html"], a[href^="shop.html"], a[href^="about.html"], a[href^="cart.html"], a[href^="checkout.html"], a[href^="account.html"], a[href^="wishlist.html"], a[href^="gallery.html"], a[href^="quiz.html"], a[href^="explore.html"], a[href^="faithmeter.html"], a[href^="fitcheck.html"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // Skip if it's an external link or has target="_blank"
      if (link.target === '_blank' || href.startsWith('http')) {
        return;
      }
      
      // Skip if it's an anchor link
      if (href.startsWith('#')) {
        return;
      }
      
      // Skip if it's a modal or popup trigger
      if (link.hasAttribute('data-modal') || link.classList.contains('modal-trigger')) {
        return;
      }
      
      e.preventDefault();
      
      // Get or create overlay
      let overlay = document.getElementById('page-transition-overlay');
      if (!overlay) {
        createTransitionOverlay();
        overlay = document.getElementById('page-transition-overlay');
      }
      
      // Trigger transition
      document.body.classList.add('transitioning-out');
      overlay.classList.add('active');
      document.body.classList.remove('page-loaded');
      
      // Navigate after animation completes (shorter, subtler)
      setTimeout(() => {
        window.location.href = href;
      }, 350);
    });
  });
};

// Initialize page transitions on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    createTransitionOverlay();
    setupPageTransitions();
  });
} else {
  createTransitionOverlay();
  setupPageTransitions();
}

// Optimized Section Transitions
const sectionTransitionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      requestAnimationFrame(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translate3d(0, 0, 0)';
      });
      // Stop observing after transition
      sectionTransitionObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -80px 0px'
});

const sections = document.querySelectorAll('section');
sections.forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translate3d(0, 20px, 0)';
  section.style.transition = 'opacity var(--transition-base), transform var(--transition-base)';
  section.style.willChange = 'opacity, transform';
  sectionTransitionObserver.observe(section);
});

// Initialize body for smooth transitions
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('page-ready');
  });
} else {
  document.body.classList.add('page-ready');
}

// Prevent flash on back/forward navigation
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    // Page was loaded from cache (back/forward button)
    document.body.classList.add('page-loaded');
    const overlay = document.getElementById('page-transition-overlay');
    if (overlay) {
      overlay.classList.remove('active');
    }
  }
});
 
