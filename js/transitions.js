// Page Transitions

// Fade in page on load
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
});

// Smooth page transitions on navigation
const setupPageTransitions = () => {
  const links = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href$=".html"]');
  
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
      
      e.preventDefault();
      
      // Fade out current page
      document.body.style.transition = 'opacity 0.3s ease';
      document.body.style.opacity = '0';
      
      // Navigate after fade out
      setTimeout(() => {
        window.location.href = href;
      }, 300);
    });
  });
};

// Initialize page transitions
// Uncomment to enable (can cause issues with some browsers)
// setupPageTransitions();

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
  section.style.transform = 'translate3d(0, 30px, 0)';
  section.style.transition = 'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  section.style.willChange = 'opacity, transform';
  sectionTransitionObserver.observe(section);
});

// Initialize body opacity for transitions
if (document.readyState === 'loading') {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
}
 
