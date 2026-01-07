// Wishlist Management System
// Handles wishlist functionality with Supabase integration

class WishlistManager {
  constructor() {
    this.wishlist = [];
    this.init();
  }

  async init() {
    if (window.authManager?.isAuthenticated()) {
      await this.loadFromDatabase();
    } else {
      this.loadFromLocalStorage();
    }
    this.updateWishlistUI();
  }

  async loadFromDatabase() {
    try {
      const userId = window.authManager.getUserId();
      const { data, error } = await supabaseClient
        .from('wishlist_items')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      this.wishlist = data || [];
    } catch (error) {
      console.error('Error loading wishlist:', error);
      this.loadFromLocalStorage();
    }
  }

  loadFromLocalStorage() {
    const savedWishlist = localStorage.getItem('wishlist');
    this.wishlist = savedWishlist ? JSON.parse(savedWishlist) : [];
  }

  async saveToDatabase() {
    if (!window.authManager?.isAuthenticated()) {
      this.saveToLocalStorage();
      return;
    }

    try {
      const userId = window.authManager.getUserId();
      
      // Delete existing wishlist items
      await supabaseClient
        .from('wishlist_items')
        .delete()
        .eq('user_id', userId);

      // Insert new wishlist items
      if (this.wishlist.length > 0) {
        const wishlistItems = this.wishlist.map(item => ({
          user_id: userId,
          product_id: item.product_id,
          product_name: item.product_name,
          product_image: item.product_image,
          price: item.price
        }));

        const { error } = await supabaseClient
          .from('wishlist_items')
          .insert(wishlistItems);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error saving wishlist:', error);
      this.saveToLocalStorage();
    }
  }

  saveToLocalStorage() {
    localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
  }

  async toggleItem(product) {
    const index = this.wishlist.findIndex(item => item.product_id === product.product_id);

    if (index > -1) {
      this.wishlist.splice(index, 1);
      await this.saveToDatabase();
      this.updateWishlistUI();
      this.showNotification('Removed from wishlist');
      return false;
    } else {
      this.wishlist.push({
        product_id: product.product_id,
        product_name: product.product_name,
        product_image: product.product_image,
        price: product.price,
        added_at: new Date().toISOString()
      });
      await this.saveToDatabase();
      this.updateWishlistUI();
      this.showNotification('Added to wishlist!');
      return true;
    }
  }

  isInWishlist(productId) {
    return this.wishlist.some(item => item.product_id === productId);
  }

  async removeItem(productId) {
    const index = this.wishlist.findIndex(item => item.product_id === productId);
    if (index > -1) {
      this.wishlist.splice(index, 1);
      await this.saveToDatabase();
      this.updateWishlistUI();
    }
  }

  updateWishlistUI() {
    // Update wishlist count badges
    const wishlistBadges = document.querySelectorAll('.wishlist-count');
    const itemCount = this.wishlist.length;
    
    wishlistBadges.forEach(badge => {
      badge.textContent = itemCount;
      badge.style.display = itemCount > 0 ? 'inline-block' : 'none';
    });

    // Update bookmark icons on product cards
    const bookmarkButtons = document.querySelectorAll('.wishlist-btn');
    bookmarkButtons.forEach(btn => {
      const productId = btn.dataset.productId;
      if (this.isInWishlist(productId)) {
        btn.classList.add('active');
        btn.innerHTML = '🔖'; // Filled bookmark
      } else {
        btn.classList.remove('active');
        btn.innerHTML = '🔖'; // Outlined bookmark
      }
    });

    // Update wishlist page if on wishlist page
    if (window.location.pathname.includes('wishlist.html')) {
      this.renderWishlistPage();
    }
  }

  renderWishlistPage() {
    const wishlistContainer = document.getElementById('wishlistItems');
    const emptyMessage = document.getElementById('emptyWishlist');

    if (!wishlistContainer) return;

    if (this.wishlist.length === 0) {
      if (emptyMessage) emptyMessage.style.display = 'block';
      wishlistContainer.innerHTML = '';
      return;
    }

    if (emptyMessage) emptyMessage.style.display = 'none';

    wishlistContainer.innerHTML = this.wishlist.map(item => `
      <div class="wishlist-item">
        <div class="product-card">
          <div class="product-image-container">
            <img src="${item.product_image}" alt="${item.product_name}" class="product-image">
            <div class="product-overlay">
              <button class="btn btn-secondary" onclick="wishlistManager.moveToCart('${item.product_id}')">
                ADD TO CART
              </button>
            </div>
          </div>
          <div class="product-info">
            <h3 class="product-name">${item.product_name}</h3>
            <p class="product-price">$${item.price.toFixed(2)}</p>
            <button class="btn-remove" onclick="wishlistManager.removeItem('${item.product_id}')">
              Remove
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  async moveToCart(productId) {
    const item = this.wishlist.find(item => item.product_id === productId);
    if (item && window.cartManager) {
      await window.cartManager.addItem({
        product_id: item.product_id,
        product_name: item.product_name,
        product_image: item.product_image,
        price: item.price,
        quantity: 1
      });
      await this.removeItem(productId);
    }
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'wishlist-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: var(--color-black);
      color: var(--color-white);
      padding: 15px 25px;
      border: 3px solid var(--color-black);
      z-index: 10000;
      animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }
}

// Initialize Wishlist Manager
if (typeof window !== 'undefined') {
  window.wishlistManager = new WishlistManager();
}
