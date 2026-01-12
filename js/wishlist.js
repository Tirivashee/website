// Wishlist Management System
// Handles wishlist functionality with Supabase integration

class WishlistManager {
  constructor() {
    this.wishlist = [];
    this.init();
  }

  async init() {
    // Wait for auth to be ready
    await this.waitForAuth();
    
    if (window.authManager?.isAuthenticated()) {
      await this.loadFromDatabase();
    } else {
      this.loadFromLocalStorage();
    }
    this.updateWishlistUI();
  }

  async waitForAuth() {
    // Wait for authManager to be initialized
    let attempts = 0;
    while (!window.authManager && attempts < 50) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    
    // If authManager exists, wait for it to finish initializing
    if (window.authManager) {
      let sessionChecks = 0;
      while (window.authManager.session === undefined && sessionChecks < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        sessionChecks++;
      }
    }
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

      // Fetch backup of existing items so we can rollback if insert fails
      let backup = [];
      try {
        const { data: existing, error: fetchErr } = await supabaseClient
          .from('wishlist_items')
          .select('*')
          .eq('user_id', userId);
        if (fetchErr) throw fetchErr;
        backup = existing || [];
      } catch (fetchErr) {
        console.warn('Could not fetch wishlist backup before save:', fetchErr);
      }

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

        if (error) {
          // Attempt rollback by reinserting backup (without original ids)
          try {
            if (backup.length > 0) {
              const rollbackItems = backup.map(b => ({
                user_id: b.user_id,
                product_id: b.product_id,
                product_name: b.product_name,
                product_image: b.product_image,
                price: b.price
              }));
              const { error: rbErr } = await supabaseClient
                .from('wishlist_items')
                .insert(rollbackItems);
              if (rbErr) console.error('Wishlist rollback failed:', rbErr);
            } else {
              // If no backup available, fallback to localStorage
              this.saveToLocalStorage();
            }
          } catch (rb) {
            console.error('Error during wishlist rollback:', rb);
          }

          throw error;
        }
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
    // Validate product data
    if (!product || !product.product_id || !product.product_name) {
      console.error('Invalid wishlist product:', product);
      window.notificationManager?.error('Failed to add item to wishlist');
      return;
    }
    
    // Validate and normalize price
    const price = parseFloat(product.price);
    if (isNaN(price) || price < 0) {
      console.error('Invalid product price:', product.price);
      window.notificationManager?.error('Invalid product price');
      return false;
    }

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
        price: price,
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
    const authMessage = document.getElementById('wishlistAuthMessage');

    if (!wishlistContainer) return;

    // Show/hide auth message for non-authenticated users
    if (authMessage) {
      const isAuthenticated = window.authManager?.isAuthenticated();
      authMessage.style.display = isAuthenticated ? 'none' : 'block';
    }

    if (this.wishlist.length === 0) {
      if (emptyMessage) emptyMessage.style.display = 'block';
      wishlistContainer.innerHTML = '';
      return;
    }

    if (emptyMessage) emptyMessage.style.display = 'none';

    // Render wishlist with event delegation instead of inline onclick
    wishlistContainer.innerHTML = this.wishlist.map((item, index) => `
      <div class="wishlist-item" data-index="${index}">
        <div class="product-card">
          <div class="product-image-container">
            <img src="${item.product_image}" alt="${item.product_name}" class="product-image">
            <div class="product-overlay">
              <button class="btn btn-secondary" data-action="move-to-cart" data-product-id="${item.product_id}">
                ADD TO CART
              </button>
            </div>
          </div>
          <div class="product-info">
            <h3 class="product-name">${item.product_name}</h3>
            <p class="product-price">$${(item.price || 0).toFixed(2)}</p>
            <button class="btn-remove" data-action="remove" data-product-id="${item.product_id}">
              Remove
            </button>
          </div>
        </div>
      </div>
    `).join('');
    
    // Add event delegation for wishlist actions
    this.attachWishlistEventListeners(wishlistContainer);
  }
  
  attachWishlistEventListeners(container) {
    if (!container) return;
    
    // Use event delegation to handle all button clicks
    container.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action]');
      if (!target) return;
      
      const action = target.dataset.action;
      const productId = target.dataset.productId;
      
      if (action === 'move-to-cart') {
        e.preventDefault();
        this.moveToCart(productId);
      } else if (action === 'remove') {
        e.preventDefault();
        this.removeItem(productId);
      }
    });
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
