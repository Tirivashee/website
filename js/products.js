// Product Interactions
// Handles product card interactions for cart and wishlist

class ProductInteractions {
  constructor() {
    this.init();
  }

  init() {
    // Add wishlist and cart buttons to all product cards
    this.enhanceProductCards();
    
    // Set up event listeners
    this.setupEventListeners();
  }

  enhanceProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach((card, index) => {
      // Extract product data
      const productId = `product-${index + 1}`;
      const productName = card.querySelector('.card-title')?.textContent || 'Product';
      const productPrice = parseFloat(
        card.querySelector('.card-price')?.textContent.replace('$', '') || '0'
      );
      const productImage = card.querySelector('.card-image')?.src || '';

      // Store product data
      card.dataset.productId = productId;
      card.dataset.productName = productName;
      card.dataset.productPrice = productPrice;
      card.dataset.productImage = productImage;

      // Find or create overlay
      let overlay = card.querySelector('.product-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'product-overlay';
        const imageWrapper = card.querySelector('.card-image-wrapper');
        if (imageWrapper) {
          imageWrapper.appendChild(overlay);
        }
      }

      // Clear existing content but keep VIEW button if present
      const viewBtn = overlay.querySelector('.btn');
      overlay.innerHTML = '';

      // Add action buttons container
      const actionsContainer = document.createElement('div');
      actionsContainer.className = 'product-actions';
      actionsContainer.style.cssText = `
        display: flex;
        gap: 10px;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
      `;

      // Add wishlist button (bookmark icon)
      if (window.authManager?.isAuthenticated()) {
        const wishlistBtn = document.createElement('button');
        wishlistBtn.className = 'wishlist-btn';
        wishlistBtn.dataset.productId = productId;
        wishlistBtn.innerHTML = '🔖';
        wishlistBtn.title = 'Add to Wishlist';
        wishlistBtn.style.cssText = `
          width: 45px;
          height: 45px;
          background: white;
          border: 3px solid black;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        `;
        
        // Check if already in wishlist
        if (window.wishlistManager?.isInWishlist(productId)) {
          wishlistBtn.classList.add('active');
          wishlistBtn.style.background = '#000';
          wishlistBtn.style.color = '#fff';
        }

        actionsContainer.appendChild(wishlistBtn);
      }

      // Add to cart button - only for authenticated users
      if (window.authManager?.isAuthenticated()) {
        const cartBtn = document.createElement('button');
        cartBtn.className = 'add-to-cart-btn btn btn-primary';
        cartBtn.dataset.productId = productId;
        cartBtn.textContent = 'ADD TO CART';
        cartBtn.style.cssText = `
          padding: 12px 20px;
          font-size: 14px;
        `;
        
        actionsContainer.appendChild(cartBtn);
      }

      // Keep original VIEW button if it exists
      if (viewBtn) {
        actionsContainer.appendChild(viewBtn);
      }

      overlay.appendChild(actionsContainer);
    });
  }

  setupEventListeners() {
    // Wishlist button clicks
    document.addEventListener('click', async (e) => {
      if (e.target.classList.contains('wishlist-btn') || e.target.closest('.wishlist-btn')) {
        const btn = e.target.classList.contains('wishlist-btn') ? e.target : e.target.closest('.wishlist-btn');
        const card = btn.closest('.product-card');
        
        if (!card || !window.wishlistManager) return;

        const product = {
          product_id: card.dataset.productId,
          product_name: card.dataset.productName,
          price: parseFloat(card.dataset.productPrice),
          product_image: card.dataset.productImage
        };

        const isAdded = await window.wishlistManager.toggleItem(product);
        
        // Update button appearance
        if (isAdded) {
          btn.classList.add('active');
          btn.style.background = '#000';
          btn.style.color = '#fff';
        } else {
          btn.classList.remove('active');
          btn.style.background = '#fff';
          btn.style.color = '#000';
        }
      }
    });

    // Add to cart button clicks
    document.addEventListener('click', async (e) => {
      if (e.target.classList.contains('add-to-cart-btn')) {
        const btn = e.target;
        const card = btn.closest('.product-card');
        
        if (!card || !window.cartManager) return;

        const product = {
          product_id: card.dataset.productId,
          product_name: card.dataset.productName,
          price: parseFloat(card.dataset.productPrice),
          product_image: card.dataset.productImage,
          quantity: 1
        };

        const originalText = btn.textContent;
        btn.textContent = 'ADDING...';
        btn.disabled = true;

        await window.cartManager.addItem(product);

        btn.textContent = '✓ ADDED';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
        }, 1500);
      }
    });
  }

  // Refresh product cards when auth state changes
  refresh() {
    this.enhanceProductCards();
  }
}

// Initialize when DOM is ready and auth is loaded
if (typeof window !== 'undefined') {
  // Wait for auth manager to be ready
  const initProducts = () => {
    if (window.authManager) {
      window.productInteractions = new ProductInteractions();
    } else {
      setTimeout(initProducts, 100);
    }
  };
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProducts);
  } else {
    initProducts();
  }
}
