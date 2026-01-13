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
      // If guest wishlist exists in localStorage, merge it into the user's database wishlist
      const guestWishlist = localStorage.getItem('wishlist');
      if (guestWishlist && guestWishlist !== '[]') {
        await this.mergeLocalToDatabase();
      } else {
        // Load wishlist from Supabase
        await this.loadFromDatabase();
      }
    } else {
      // Load wishlist from localStorage for guests
      this.loadFromLocalStorage();
    }
    this.updateWishlistUI();
    
    // Listen for cross-tab storage changes
    this.setupStorageListener();
  }

  // Merge localStorage wishlist into Supabase for authenticated user
  async mergeLocalToDatabase() {
    try {
      const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const userId = window.authManager.getUserId();

      // Fetch existing DB items for user
      const { data: dbItems, error } = await supabaseClient
        .from('wishlist_items')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      const db = dbItems || [];

      // Merge by product_id (wishlist doesn't have size/color variants)
      const map = new Map();

      db.forEach(it => {
        map.set(it.product_id, Object.assign({}, it));
      });

      localWishlist.forEach(it => {
        if (!map.has(it.product_id)) {
          map.set(it.product_id, {
            user_id: userId,
            product_id: it.product_id,
            product_name: it.product_name,
            product_image: it.product_image,
            price: it.price,
            added_at: it.added_at || new Date().toISOString()
          });
        }
      });

      // Convert merged map into this.wishlist format (no DB ids)
      this.wishlist = Array.from(map.values()).map(it => ({
        product_id: it.product_id,
        product_name: it.product_name,
        product_image: it.product_image,
        price: it.price,
        added_at: it.added_at || new Date().toISOString()
      }));

      // Persist merged wishlist to database
      await this.saveToDatabase();

      // Clear guest wishlist
      localStorage.removeItem('wishlist');
    } catch (err) {
      console.error('Error merging local wishlist into database:', err);
      // Fallback: load DB and then append local items via toggleItem
      await this.loadFromDatabase();
      const fallbackLocal = JSON.parse(localStorage.getItem('wishlist') || '[]');
      if (fallbackLocal.length > 0) {
        for (const it of fallbackLocal) {
          await this.toggleItem(it);
        }
        localStorage.removeItem('wishlist');
      }
    }
  }

  setupStorageListener() {
    // Listen for localStorage changes in other tabs
    window.addEventListener('storage', (e) => {
      if (e.key === 'wishlist' && !window.authManager?.isAuthenticated()) {
        this.loadFromLocalStorage();
        this.updateWishlistUI();
      }
    });
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
        .select(`
          *,
          product:products(*)
        `)
        .eq('user_id', userId);

      if (error) throw error;
      
      // Transform data to include product details
      this.wishlist = (data || []).map(item => ({
        product_id: item.product_id,
        product_name: item.product?.name || 'Unknown Product',
        product_image: item.product?.main_image || '',
        price: item.product?.base_price || 0,
        added_at: item.created_at,
        in_stock: !item.product?.track_inventory || item.product?.continue_selling_when_out_of_stock
      }));
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

      // Fetch backup of existing items
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

      // Insert new wishlist items (only product_id needed now)
      if (this.wishlist.length > 0) {
        const wishlistItems = this.wishlist.map(item => ({
          user_id: userId,
          product_id: item.product_id
        }));

        const { error } = await supabaseClient
          .from('wishlist_items')
          .insert(wishlistItems);

        if (error) {
          // Attempt rollback
          try {
            if (backup.length > 0) {
              const rollbackItems = backup.map(b => ({
                user_id: b.user_id,
                product_id: b.product_id
              }));
              const { error: rbErr } = await supabaseClient
                .from('wishlist_items')
                .insert(rollbackItems);
              if (rbErr) console.error('Wishlist rollback failed:', rbErr);
            } else {
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
    if (!product || !product.product_id) {
      console.error('Invalid wishlist product - missing product_id:', product);
      window.notificationManager?.error('Failed to add item to wishlist');
      return;
    }

    // For database products, fetch full product details if needed
    if (window.authManager?.isAuthenticated() && window.productsLoader && !product.product_name) {
      const fullProduct = await window.productsLoader.getProduct(product.product_id);
      if (!fullProduct || !fullProduct.is_active) {
        window.notificationManager?.error('Product not available');
        return false;
      }

      product = {
        product_id: fullProduct.id,
        product_name: fullProduct.name,
        product_image: fullProduct.main_image,
        price: fullProduct.base_price,
        in_stock: !fullProduct.track_inventory || fullProduct.continue_selling_when_out_of_stock
      };
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
        product_name: product.product_name || 'Unknown Product',
        product_image: product.product_image || '',
        price: price,
        added_at: new Date().toISOString(),
        in_stock: product.in_stock !== false
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
    const wishlistBadges = document.querySelectorAll('#wishlistCount, .wishlist-count');
    const itemCount = this.wishlist.length;
    
    wishlistBadges.forEach(badge => {
      badge.textContent = itemCount;
      badge.style.display = itemCount > 0 ? 'flex' : 'none';
    });

    // Update bookmark icons on product cards
    const bookmarkButtons = document.querySelectorAll('.wishlist-btn');
    bookmarkButtons.forEach(btn => {
      const productId = btn.dataset.productId;
      if (this.isInWishlist(productId)) {
        btn.classList.add('active');
        btn.style.background = '#000';
        btn.style.color = '#fff';
      } else {
        btn.classList.remove('active');
        btn.style.background = '#fff';
        btn.style.color = '#000';
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
    wishlistContainer.innerHTML = this.wishlist.map((item, index) => {
      const price = parseFloat(item.price) || 0;
      return `
      <div class="wishlist-item" data-index="${index}">
        <div class="product-card">
          <div class="product-image-container">
            <img src="${item.product_image || ''}" alt="${item.product_name || 'Product'}" class="product-image">
            <div class="product-overlay">
              <button class="btn btn-secondary" data-action="move-to-cart" data-product-id="${item.product_id}">
                ADD TO CART
              </button>
            </div>
          </div>
          <div class="product-info">
            <h3 class="product-name">${item.product_name || 'Unknown Product'}</h3>
            <p class="product-price">$${price.toFixed(2)}</p>
            <button class="btn-remove" data-action="remove" data-product-id="${item.product_id}">
              Remove
            </button>
          </div>
        </div>
      </div>
    `;
    }).join('');
    
    // Add event delegation for wishlist actions
    this.attachWishlistEventListeners(wishlistContainer);
  }
  
  attachWishlistEventListeners(container) {
    if (!container) return;
    
    // Remove existing listener if it exists
    if (container._wishlistListenerAttached) return;
    container._wishlistListenerAttached = true;
    
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

  async moveAllToCart() {
    if (!window.cartManager || this.wishlist.length === 0) return;
    
    const itemsCopy = [...this.wishlist];
    let successCount = 0;
    
    for (const item of itemsCopy) {
      try {
        await window.cartManager.addItem({
          product_id: item.product_id,
          product_name: item.product_name,
          product_image: item.product_image,
          price: item.price,
          quantity: 1
        });
        successCount++;
      } catch (error) {
        console.error('Error moving item to cart:', error);
      }
    }
    
    // Clear wishlist after moving all items
    this.wishlist = [];
    await this.saveToDatabase();
    this.updateWishlistUI();
    
    if (successCount > 0) {
      this.showNotification(`Moved ${successCount} item${successCount > 1 ? 's' : ''} to cart!`);
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
