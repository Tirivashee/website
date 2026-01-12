// Modal Wishlist and Cart Button Handler
// Handles wishlist and cart functionality in the product modal

// Initialize modal buttons safely
function initModalButtons() {
  const modalWishlistBtn = document.getElementById('modalWishlistBtn');
  const modalCartBtn = document.getElementById('modalCartBtn');
  
  // Retry if elements or managers not ready yet
  if (!modalWishlistBtn || !modalCartBtn || !window.wishlistManager || !window.cartManager) {
    requestAnimationFrame(initModalButtons);
    return;
  }
  
  // Wishlist Button Handler
  if (modalWishlistBtn) {
    modalWishlistBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Get current product data from modal
      const modalTitle = document.getElementById('modalTitle')?.textContent || '';
      const modalPrice = document.getElementById('modalPrice')?.textContent || '$0';
      const modalImages = document.querySelectorAll('.modal-main-image');
      const modalImage = modalImages.length > 0 ? modalImages[0].src : '';
      
      // Generate product ID from title
      const productId = modalTitle.toLowerCase().replace(/\s+/g, '-');
      
      const rawPrice = modalPrice.replace('$', '').replace(/[^0-9.]/g, '');
      const price = parseFloat(rawPrice);
      
      if (isNaN(price) || price < 0) {
        console.error('Invalid product price:', rawPrice);
        window.notificationManager?.error('Invalid product price');
        return;
      }
      
      const productData = {
        product_id: productId,
        product_name: modalTitle,
        product_image: modalImage,
        price: price
      };
      
      if (window.wishlistManager) {
        window.wishlistManager.toggleItem(productData);
        
        // Update button state
        const isInWishlist = window.wishlistManager.wishlist.some(item => 
          item.product_id === productId
        );
        
        const svg = this.querySelector('svg');
        const textSpan = this.querySelector('span');
        
        if (isInWishlist) {
          this.classList.add('active');
          if (svg) svg.setAttribute('fill', 'currentColor');
          if (textSpan) textSpan.textContent = 'REMOVE FROM WISHLIST';
        } else {
          this.classList.remove('active');
          if (svg) svg.setAttribute('fill', 'none');
          if (textSpan) textSpan.textContent = 'ADD TO WISHLIST';
        }
        
        // Update card wishlist buttons
        if (window.shopWishlistFunctions) {
          window.shopWishlistFunctions.updateWishlistButtonStates();
        }
      }
    });
  }
  
  // Cart Button Handler
  if (modalCartBtn) {
    modalCartBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Get current product data from modal
      const modalTitle = document.getElementById('modalTitle')?.textContent || '';
      const modalPrice = document.getElementById('modalPrice')?.textContent || '$0';
      const modalImages = document.querySelectorAll('.modal-main-image');
      const modalImage = modalImages.length > 0 ? modalImages[0].src : '';
      
      // Get selected size and color if available
      const selectedSize = document.querySelector('.modal-size-option.active')?.textContent || null;
      const selectedColorElement = document.querySelector('.modal-color-option.active');
      const selectedColor = selectedColorElement ? selectedColorElement.dataset.color || null : null;
      
      // Generate product ID from title
      const productId = modalTitle.toLowerCase().replace(/\s+/g, '-');
      
      const rawPrice = modalPrice.replace('$', '').replace(/[^0-9.]/g, '');
      const price = parseFloat(rawPrice);
      
      if (isNaN(price) || price < 0) {
        console.error('Invalid product price:', rawPrice);
        window.notificationManager?.error('Invalid product price');
        return;
      }
      
      const productData = {
        product_id: productId,
        product_name: modalTitle,
        product_image: modalImage,
        price: price,
        quantity: 1,
        size: selectedSize,
        color: selectedColor
      };
      
      if (window.cartManager) {
        window.cartManager.addItem(productData);
      }
    });
  }
}

// Start initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initModalButtons);
} else {
  initModalButtons();
}
