// Global Navigation Badge Updates
// Updates cart and wishlist badge counts across all pages

document.addEventListener('DOMContentLoaded', function() {
  updateCartBadge();
  updateWishlistBadge();
  
  // Update badges periodically
  setInterval(() => {
    updateCartBadge();
    updateWishlistBadge();
  }, 5000);
});

function updateCartBadge() {
  const cartBadge = document.getElementById('cartCount');
  if (cartBadge && window.cartManager) {
    const count = window.cartManager.getItemCount();
    cartBadge.textContent = count;
    cartBadge.style.display = count > 0 ? 'flex' : 'none';
  }
}

function updateWishlistBadge() {
  const wishlistBadge = document.getElementById('wishlistCount');
  if (wishlistBadge && window.wishlistManager) {
    const count = window.wishlistManager.wishlist.length;
    wishlistBadge.textContent = count;
    wishlistBadge.style.display = count > 0 ? 'flex' : 'none';
  }
}

// Export for use in other scripts
window.updateCartBadge = updateCartBadge;
window.updateWishlistBadge = updateWishlistBadge;
