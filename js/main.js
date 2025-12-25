// Main JavaScript - Ballylike Website

// Mobile Navigation Toggle
const navbarToggle = document.getElementById('navbarToggle');
const navbarMenu = document.getElementById('navbarMenu');

if (navbarToggle && navbarMenu) {
  navbarToggle.addEventListener('click', () => {
    navbarToggle.classList.toggle('active');
    navbarMenu.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navbarMenu.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // Close menu when clicking on a link
  const navbarLinks = navbarMenu.querySelectorAll('.navbar-link');
  navbarLinks.forEach(link => {
    link.addEventListener('click', () => {
      navbarToggle.classList.remove('active');
      navbarMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navbarToggle.contains(e.target) && !navbarMenu.contains(e.target)) {
      navbarToggle.classList.remove('active');
      navbarMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  if (scrollTop > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  lastScrollTop = scrollTop;
});

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    
    // Skip if it's just "#" or if target doesn't exist
    if (href === '#' || !document.querySelector(href)) {
      return;
    }
    
    e.preventDefault();
    
    const target = document.querySelector(href);
    const navbarHeight = navbar.offsetHeight;
    const targetPosition = target.offsetTop - navbarHeight;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  });
});

// Add to Cart Button Interactions
const addToCartButtons = document.querySelectorAll('.product-overlay .btn');

addToCartButtons.forEach(button => {
  // Skip if it's a link (navigation element)
  if (button.tagName === 'A' && button.getAttribute('href')) {
    return;
  }
  
  button.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Visual feedback
    const originalText = button.textContent;
    button.textContent = 'Added!';
    button.style.backgroundColor = 'var(--color-black)';
    
    setTimeout(() => {
      button.textContent = originalText;
      button.style.backgroundColor = '';
    }, 1500);
    
    // You can add actual cart functionality here
    console.log('Product added to cart');
  });
});

// Page Load Animation
window.addEventListener('load', () => {
  document.body.classList.add('page-loaded');
});

// Console Brand Message
console.log(
  '%cBallylike',
  'font-size: 40px; font-weight: bold; color: #FF6600; text-shadow: 2px 2px 0px #000;'
);
console.log(
  '%cWhere Faith Meets Fashion',
  'font-size: 16px; color: #000; font-weight: 600;'
);
 
