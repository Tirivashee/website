// Animation Utilities

// Staggered Animation for Grid Items
const staggerAnimation = (selector, delay = 100) => {
  const elements = document.querySelectorAll(selector);
  
  elements.forEach((element, index) => {
    element.style.animationDelay = `${index * delay}ms`;
  });
};

// Apply staggered animations to grid items
staggerAnimation('.grid > .card', 150);
staggerAnimation('.grid > .collection-item', 150);
staggerAnimation('.grid > .performance-card', 150);

// Hover Effect Enhancement for Cards
const cards = document.querySelectorAll('.card');

cards.forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  });
});

// Text Animation on Scroll
const animateText = (element) => {
  const text = element.textContent;
  element.textContent = '';
  element.style.opacity = '1';
  
  let i = 0;
  const typing = setInterval(() => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(typing);
    }
  }, 50);
};

// Image Loading Animation
const images = document.querySelectorAll('img');

images.forEach(img => {
  img.addEventListener('load', function() {
    this.style.animation = 'fadeIn 0.5s ease-in';
  });
  
  // Add loading state
  if (!img.complete) {
    img.style.opacity = '0';
  }
});

// Button Click Ripple Effect
const createRipple = (event) => {
  const button = event.currentTarget;
  const ripple = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;
  
  ripple.style.width = ripple.style.height = `${diameter}px`;
  ripple.style.left = `${event.clientX - button.offsetLeft - radius}px`;
  ripple.style.top = `${event.clientY - button.offsetTop - radius}px`;
  ripple.classList.add('ripple');
  
  const existingRipple = button.querySelector('.ripple');
  if (existingRipple) {
    existingRipple.remove();
  }
  
  button.appendChild(ripple);
};

// Add ripple effect to buttons
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
  button.addEventListener('click', createRipple);
});

// Add ripple CSS dynamically
const style = document.createElement('style');
style.textContent = `
  .ripple {
    position: absolute;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
  }
  
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Cursor Follower (Optional - Advanced Effect)
const createCursorFollower = () => {
  const cursor = document.createElement('div');
  cursor.style.cssText = `
    width: 20px;
    height: 20px;
    border: 2px solid var(--color-primary);
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    transition: all 0.1s ease;
    transform: translate(-50%, -50%);
    opacity: 0;
  `;
  document.body.appendChild(cursor);
  
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
    cursor.style.opacity = '1';
  });
  
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });
  
  // Scale on hover over interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .card');
  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
    });
    element.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });
};

// Uncomment to enable custom cursor (works best on desktop)
// createCursorFollower();

// Performance: Reduce animations on low-end devices
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.setProperty('--transition-base', '0.01ms');
  document.documentElement.style.setProperty('--transition-slow', '0.01ms');
}

// Animate numbers (for counters, stats, etc.)
const animateNumber = (element, target, duration = 2000) => {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
};

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { animateNumber, animateText, createRipple };
}
 
