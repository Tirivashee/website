// Shop Page Wishlist Integration
// Add wishlist buttons to product cards and handle wishlist interactions

document.addEventListener('DOMContentLoaded', function() {
  // Initialize wishlist buttons on product cards
  initializeWishlistButtons();
  
  // Update wishlist badge count
  updateWishlistBadge();
});

function initializeWishlistButtons() {
  // Wishlist buttons are now handled by products.js
  // This function is kept for backward compatibility but does nothing
  updateWishlistButtonStates();
}

function updateWishlistButtonStates() {
  if (!window.wishlistManager) return;
  
  // Update wishlist buttons managed by products.js
  const wishlistButtons = document.querySelectorAll('.wishlist-btn');
  
  wishlistButtons.forEach(btn => {
    const productId = btn.dataset.productId;
    const isInWishlist = window.wishlistManager.wishlist.some(item => 
      item.product_id === productId
    );
    
    if (isInWishlist) {
      btn.classList.add('active');
      btn.style.background = '#000';
      btn.style.color = '#fff';
    } else {
      btn.classList.remove('active');
      btn.style.background = '#fff';
      btn.style.color = '#000';
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
