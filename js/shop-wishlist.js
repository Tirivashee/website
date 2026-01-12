// Shop Page Wishlist Integration
// Add wishlist buttons to product cards and handle wishlist interactions

document.addEventListener('DOMContentLoaded', function() {
  // Initialize wishlist buttons on product cards
  initializeWishlistButtons();
  
  // Update wishlist badge count
  updateWishlistBadge();
  
  // Listen for wishlist updates
  if (window.wishlistManager) {
    const originalToggle = window.wishlistManager.toggleItem.bind(window.wishlistManager);
    window.wishlistManager.toggleItem = async function(product) {
      await originalToggle(product);
      updateWishlistBadge();
      updateWishlistButtonStates();
    };
  }
});

function initializeWishlistButtons() {
  const productCards = document.querySelectorAll('.product-card');
  
  productCards.forEach((card, index) => {
    const priceElement = card.querySelector('.card-price');
    if (!priceElement) return;
    
    // Skip if wishlist button already exists
    if (priceElement.querySelector('.product-wishlist-btn')) return;
    
    const productTitle = card.querySelector('.card-title')?.textContent || '';
    const productPrice = priceElement.textContent || '$0';
    const productImage = card.querySelector('.card-image')?.src || '';
    
    // Create wishlist button
    const wishlistBtn = document.createElement('button');
    wishlistBtn.className = 'product-wishlist-btn';
    wishlistBtn.setAttribute('aria-label', 'Add to wishlist');
    wishlistBtn.setAttribute('data-product-id', 'product-' + index);
    wishlistBtn.setAttribute('data-product-name', productTitle);
    wishlistBtn.setAttribute('data-product-price', productPrice.replace('$', ''));
    wishlistBtn.setAttribute('data-product-image', productImage);
    wishlistBtn.innerHTML = `
      <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
      </svg>
    `;
    
    // Append wishlist button to price element
    priceElement.appendChild(wishlistBtn);
    
    // Handle wishlist button click
    wishlistBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      
      const rawPrice = this.getAttribute('data-product-price') || '0';
      const price = parseFloat(rawPrice);
      
      // Validate price
      if (isNaN(price) || price < 0) {
        console.error('Invalid product price:', rawPrice);
        window.notificationManager?.error('Invalid product price');
        return;
      }
      
      const productData = {
        product_id: this.getAttribute('data-product-id'),
        product_name: this.getAttribute('data-product-name'),
        product_image: this.getAttribute('data-product-image'),
        price: price
      };
      
      if (window.wishlistManager) {
        window.wishlistManager.toggleItem(productData);
      } else {
        console.warn('Wishlist manager not initialized');
      }
    });
  });
  
  // Update button states based on current wishlist
  updateWishlistButtonStates();
}

function updateWishlistButtonStates() {
  if (!window.wishlistManager) return;
  
  const wishlistButtons = document.querySelectorAll('.product-wishlist-btn');
  
  wishlistButtons.forEach(btn => {
    const productId = btn.getAttribute('data-product-id');
    const isInWishlist = window.wishlistManager.wishlist.some(item => 
      item.product_id === productId
    );
    
    const svg = btn.querySelector('svg');
    if (isInWishlist) {
      btn.classList.add('active');
      if (svg) svg.setAttribute('fill', 'currentColor');
    } else {
      btn.classList.remove('active');
      if (svg) svg.setAttribute('fill', 'none');
    }
  });
}

function updateWishlistBadge() {
  const wishlistBadge = document.getElementById('wishlistCount');
  if (wishlistBadge && window.wishlistManager) {
    const count = window.wishlistManager.wishlist.length;
    wishlistBadge.textContent = count;
    wishlistBadge.style.display = count > 0 ? 'flex' : 'none';
  }
}

// Export functions for use in other scripts
window.shopWishlistFunctions = {
  updateWishlistButtonStates,
  updateWishlistBadge
};
