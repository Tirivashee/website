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

// Section Transitions
const sectionTransitionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

const sections = document.querySelectorAll('section');
sections.forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(20px)';
  section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  sectionTransitionObserver.observe(section);
});

// Initialize body opacity for transitions
if (document.readyState === 'loading') {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
}
 
