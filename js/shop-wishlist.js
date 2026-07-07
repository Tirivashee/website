// Shop Page Wishlist Integration
// Add wishlist buttons to product cards and handle wishlist interactions

document.addEventListener('DOMContentLoaded', function() {
  // Initialize wishlist buttons on product cards
  initializeWishlistButtons();

  // Badge count is owned by nav-badges.js (window.updateWishlistBadge)
  window.updateWishlistBadge?.();
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
    btn.classList.toggle('active', window.wishlistManager.isInWishlist(productId));
  });
}

// Export functions for use in other scripts
window.shopWishlistFunctions = {
  updateWishlistButtonStates,
  updateWishlistBadge: () => window.updateWishlistBadge?.()
};
