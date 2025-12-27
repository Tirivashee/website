// BALLYLIKE AI Fit Check
// Image upload, AI analysis, and results display

(function() {
  'use strict';

  // DOM Elements
  const policyModal = document.getElementById('policyModal');
  const agreeCheckbox = document.getElementById('agreeCheckbox');
  const acceptBtn = document.getElementById('acceptBtn');
  const uploadArea = document.getElementById('uploadArea');
  const fileInput = document.getElementById('fileInput');
  const imagePreview = document.getElementById('imagePreview');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const loading = document.getElementById('loading');
  const results = document.getElementById('results');
  const ratingScore = document.getElementById('ratingScore');
  const ratingLabel = document.getElementById('ratingLabel');
  const ratingFeedback = document.getElementById('ratingFeedback');
  const productSuggestions = document.getElementById('productSuggestions');
  const shareBtn = document.getElementById('shareBtn');
  const tryAgainBtn = document.getElementById('tryAgainBtn');

  let uploadedImage = null;

  // Product database for suggestions
  const products = [
    { name: 'URBAN FASHION TEE', image: 'assets/images/products/prod-t.jpg', price: '$14.99' },
    { name: 'BLACK CANVAS SHOULDER BAG', image: 'assets/images/products/prod-bcs.jpg', price: '$14.99' },
    { name: 'PERFORMANCE CAP', image: 'assets/images/products/prod-c.jpg', price: '$11.99' },
    { name: 'CANVAS SHOULDER BAG', image: 'assets/images/products/prod-bcsb.jpg', price: '$14.99' },
    { name: 'BLACK HALO POUCH', image: 'assets/images/products/prod-hpb.jpg', price: '$7.99' }
  ];

  // Rating templates
  const ratingTemplates = {
    10: {
      label: 'ABSOLUTE FIRE 🔥',
      feedback: 'YOUR FIT IS IMMACULATE! The style, the confidence, the execution - everything is perfect. You\'re setting trends, not following them. Keep inspiring!'
    },
    9: {
      label: 'ELITE STATUS 🌟',
      feedback: 'This is what we call DRIP! Your outfit coordination is on point, and you clearly understand fashion. Minor tweaks could make it legendary, but you\'re already in the top tier.'
    },
    8: {
      label: 'CERTIFIED FRESH ✨',
      feedback: 'Strong fit! You\'ve got great taste and style sense. The pieces work well together, and you\'re rocking it with confidence. A few adjustments and you\'re reaching elite level.'
    },
    7: {
      label: 'SOLID VIBES 👌',
      feedback: 'Good foundation! Your outfit has potential and shows you understand basics of style. With some fine-tuning and maybe a statement piece, you\'ll level up significantly.'
    },
    6: {
      label: 'DECENT LOOK 👍',
      feedback: 'You\'re on the right track! The outfit is functional and presentable. Consider experimenting with bolder choices or adding accessories to make your style pop more.'
    },
    5: {
      label: 'MID TERRITORY 😐',
      feedback: 'It\'s alright, but there\'s room for improvement. Try mixing textures, playing with proportions, or adding a focal point. Don\'t be afraid to take some style risks!'
    },
    4: {
      label: 'NEEDS WORK 🤔',
      feedback: 'The foundation is there, but the execution needs attention. Consider the fit, color coordination, and overall cohesion. Small changes can make a big difference!'
    },
    3: {
      label: 'RETHINK IT 😬',
      feedback: 'Let\'s be real - this needs a makeover. Start with basics: proper fit, complementary colors, and one statement piece. Check out our collections for inspiration!'
    }
  };

  // Initialize
  function init() {
    checkPolicyConsent();
    setupEventListeners();
  }

  // Check if user has already consented
  function checkPolicyConsent() {
    const hasConsented = localStorage.getItem('ballylike_fitcheck_consent');
    
    if (hasConsented === 'true') {
      policyModal.classList.add('hidden');
    } else {
      policyModal.classList.remove('hidden');
    }
  }

  // Event Listeners
  function setupEventListeners() {
    // Policy modal
    agreeCheckbox.addEventListener('change', function() {
      acceptBtn.disabled = !this.checked;
    });

    acceptBtn.addEventListener('click', function() {
      if (agreeCheckbox.checked) {
        localStorage.setItem('ballylike_fitcheck_consent', 'true');
        policyModal.classList.add('hidden');
      }
    });

    // Upload area click
    uploadArea.addEventListener('click', () => {
      fileInput.click();
    });

    // File input change
    fileInput.addEventListener('change', handleFileSelect);

    // Drag and drop
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);

    // Analyze button
    analyzeBtn.addEventListener('click', analyzeFit);

    // Try again button
    tryAgainBtn.addEventListener('click', resetFitCheck);

    // Share button
    shareBtn.addEventListener('click', shareResults);
  }

  // Handle file selection
  function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
      processImage(file);
    }
  }

  // Drag over handler
  function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('dragover');
  }

  // Drag leave handler
  function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
  }

  // Drop handler
  function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processImage(file);
    }
  }

  // Process image
  function processImage(file) {
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      uploadedImage = e.target.result;
      imagePreview.src = uploadedImage;
      imagePreview.classList.add('show');
      analyzeBtn.classList.remove('hidden');
      
      // Hide upload prompt
      uploadArea.querySelector('.upload-icon').style.display = 'none';
      uploadArea.querySelector('.upload-text').style.display = 'none';
      uploadArea.querySelector('.upload-subtext').style.display = 'none';
    };
    reader.readAsDataURL(file);
  }

  // Analyze fit (AI simulation)
  async function analyzeFit() {
    if (!uploadedImage) return;

    // Hide upload section, show loading
    document.querySelector('.upload-section').style.display = 'none';
    loading.classList.add('show');

    // Simulate AI processing (2-3 seconds)
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Generate rating (simulated AI result)
    const rating = generateRating();
    
    // Hide loading, show results
    loading.classList.remove('show');
    displayResults(rating);
  }

  // Generate rating (simulated AI)
  function generateRating() {
    // In production, this would call actual AI API (OpenAI Vision, Google Cloud Vision, etc.)
    // For now, generate realistic-looking results
    
    // Random rating weighted toward middle-high scores (5-9)
    const weights = [1, 2, 5, 8, 10, 12, 15, 12, 10];
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    let rating = 3;
    
    for (let i = 0; i < weights.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        rating = i + 3;
        break;
      }
    }

    return Math.min(rating, 10);
  }

  // Display results
  function displayResults(rating) {
    const template = ratingTemplates[rating] || ratingTemplates[5];
    
    // Update rating display
    ratingScore.textContent = `${rating}/10`;
    ratingLabel.textContent = template.label;
    ratingFeedback.textContent = template.feedback;

    // Add color based on rating
    if (rating >= 8) {
      ratingScore.style.color = '#00ff00';
    } else if (rating >= 6) {
      ratingScore.style.color = '#FF6600';
    } else {
      ratingScore.style.color = '#ff0000';
    }

    // Show product suggestions
    displayProductSuggestions(rating);

    // Show results section
    results.classList.add('show');

    // Scroll to results
    results.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Display product suggestions
  function displayProductSuggestions(rating) {
    // Pick 3-4 random products
    const numSuggestions = rating < 6 ? 4 : 3;
    const shuffled = [...products].sort(() => Math.random() - 0.5);
    const suggestions = shuffled.slice(0, numSuggestions);

    productSuggestions.innerHTML = suggestions.map(product => `
      <a href="shop.html" class="suggestion-item">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <div class="suggestion-name">${product.name}</div>
        <div style="font-size: var(--font-size-xs); font-weight: bold; margin-top: var(--spacing-xs);">${product.price}</div>
      </a>
    `).join('');
  }

  // Reset fit check
  function resetFitCheck() {
    // Reset all elements
    uploadedImage = null;
    imagePreview.src = '';
    imagePreview.classList.remove('show');
    analyzeBtn.classList.add('hidden');
    results.classList.remove('show');
    document.querySelector('.upload-section').style.display = 'block';
    
    // Show upload prompt again
    uploadArea.querySelector('.upload-icon').style.display = 'block';
    uploadArea.querySelector('.upload-text').style.display = 'block';
    uploadArea.querySelector('.upload-subtext').style.display = 'block';
    
    // Reset file input
    fileInput.value = '';

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Share results
  function shareResults() {
    const rating = ratingScore.textContent;
    const label = ratingLabel.textContent;
    const text = `I got a ${rating} on BALLYLIKE AI Fit Check! ${label} 🔥\n\nCheck your fit at ballylike.co.zw/fitcheck.html`;
    
    // Try native share API first
    if (navigator.share) {
      navigator.share({
        title: 'BALLYLIKE AI Fit Check Result',
        text: text,
        url: window.location.href
      }).catch(err => {
        console.log('Share cancelled');
      });
    } else {
      // Fallback to copy to clipboard
      navigator.clipboard.writeText(text).then(() => {
        alert('Result copied to clipboard! Share it on social media 🔥');
      }).catch(() => {
        alert('Share: ' + text);
      });
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
