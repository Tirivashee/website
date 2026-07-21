// Wishlist Management System
// DB-backed only - saving to a wishlist requires an account, matching how
// likes/comments already work (js/gallery.js). There is no guest/localStorage
// mode: visitors who aren't logged in are prompted to sign up or log in.

const WISHLIST_UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidProductUUID(id) {
  return typeof id === 'string' && WISHLIST_UUID_RE.test(id);
}

// Supabase/PostgREST errors carry the useful detail in message/details/hint/code,
// not in the Error's own stack - log those explicitly instead of the generic object.
function logWishlistError(context, error) {
  console.error(context, {
    message: error?.message,
    details: error?.details,
    hint: error?.hint,
    code: error?.code,
    raw: error
  });
}

function requireWishlistLogin(message) {
  window.notificationManager?.warning(message);
  setTimeout(() => {
    window.location.href = '/users/login.html?redirect=' + encodeURIComponent(window.location.pathname);
  }, 1500);
}

const WISHLIST_SORTS = {
  newest: (a, b) => new Date(b.added_at) - new Date(a.added_at),
  oldest: (a, b) => new Date(a.added_at) - new Date(b.added_at),
  'price-asc': (a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0),
  'price-desc': (a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0),
  'name-asc': (a, b) => (a.product_name || '').localeCompare(b.product_name || '')
};

class WishlistManager {
  constructor() {
    this.wishlist = [];
    this.sortBy = 'newest';
    this._inFlight = new Set();
    this.init();
  }

  async init() {
    await this.waitForAuth();

    if (window.authManager?.isAuthenticated()) {
      await this.loadFromDatabase();
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
        .select(`
          id,
          product_id,
          created_at,
          product:products(*)
        `)
        .eq('user_id', userId);

      if (error) throw error;

      this.wishlist = (data || []).map(item => ({
        id: item.id,
        product_id: item.product_id,
        product_name: item.product?.name || 'Unknown Product',
        product_image: item.product?.main_image || '',
        price: item.product?.base_price || 0,
        added_at: item.created_at,
        in_stock: !item.product?.track_inventory || item.product?.continue_selling_when_out_of_stock
      }));
    } catch (error) {
      logWishlistError('Error loading wishlist:', error);
      this.wishlist = [];
    }
  }

  isInWishlist(productId) {
    return this.wishlist.some(item => item.product_id === productId);
  }

  async toggleItem(product) {
    if (!window.authManager?.isAuthenticated()) {
      requireWishlistLogin('Please login to save items to your wishlist');
      return false;
    }

    if (!product || !product.product_id) {
      console.error('Invalid wishlist product - missing product_id:', product);
      window.notificationManager?.error('Failed to update wishlist');
      return false;
    }

    if (!isValidProductUUID(product.product_id)) {
      window.notificationManager?.error('This item cannot be saved to your wishlist');
      return false;
    }

    // Guard against double-clicks firing overlapping requests for the same item.
    if (this._inFlight.has(product.product_id)) {
      return this.isInWishlist(product.product_id);
    }
    this._inFlight.add(product.product_id);

    try {
      const userId = window.authManager.getUserId();
      const existingIndex = this.wishlist.findIndex(item => item.product_id === product.product_id);

      if (existingIndex > -1) {
        const item = this.wishlist[existingIndex];
        const { error } = await supabaseClient
          .from('wishlist_items')
          .delete()
          .eq('id', item.id)
          .eq('user_id', userId);

        if (error) throw error;

        this.wishlist.splice(existingIndex, 1);
        this.updateWishlistUI();
        window.notificationManager?.success('Removed from wishlist');
        return false;
      }

      // For database products, fetch full product details if needed
      let productName = product.product_name;
      let productImage = product.product_image;
      let price = parseFloat(product.price);
      let inStock = product.in_stock !== false;

      if (window.productsLoader && !productName) {
        const fullProduct = await window.productsLoader.getProduct(product.product_id);
        if (!fullProduct || !fullProduct.is_active) {
          window.notificationManager?.error('Product not available');
          return false;
        }
        productName = fullProduct.name;
        productImage = fullProduct.main_image;
        price = fullProduct.base_price;
        inStock = !fullProduct.track_inventory || fullProduct.continue_selling_when_out_of_stock;
      }

      if (isNaN(price) || price < 0) {
        console.error('Invalid product price:', product.price);
        window.notificationManager?.error('Invalid product price');
        return false;
      }

      const { data, error } = await supabaseClient
        .from('wishlist_items')
        .insert([{ user_id: userId, product_id: product.product_id }])
        .select('id, created_at')
        .single();

      if (error) throw error;

      this.wishlist.push({
        id: data.id,
        product_id: product.product_id,
        product_name: productName || 'Unknown Product',
        product_image: productImage || '',
        price: price,
        added_at: data.created_at,
        in_stock: inStock
      });

      this.updateWishlistUI();
      window.notificationManager?.success('Added to wishlist!');
      return true;
    } catch (error) {
      logWishlistError('Error updating wishlist:', error);
      window.notificationManager?.error('Failed to update wishlist. Please try again.');
      return this.isInWishlist(product.product_id);
    } finally {
      this._inFlight.delete(product.product_id);
    }
  }

  async removeItem(productId) {
    if (!window.authManager?.isAuthenticated()) return;

    const index = this.wishlist.findIndex(item => item.product_id === productId);
    if (index === -1) return;

    const item = this.wishlist[index];

    try {
      const { error } = await supabaseClient
        .from('wishlist_items')
        .delete()
        .eq('id', item.id)
        .eq('user_id', window.authManager.getUserId());

      if (error) throw error;

      this.wishlist.splice(index, 1);
      this.updateWishlistUI();
    } catch (error) {
      logWishlistError('Error removing wishlist item:', error);
      window.notificationManager?.error('Failed to remove item. Please try again.');
    }
  }

  setSortOrder(sortBy) {
    if (!WISHLIST_SORTS[sortBy]) return;
    this.sortBy = sortBy;
    this.renderWishlistPage();
  }

  getSortedItems() {
    const comparator = WISHLIST_SORTS[this.sortBy] || WISHLIST_SORTS.newest;
    return [...this.wishlist].sort(comparator);
  }

  updateWishlistUI() {
    // Update bookmark icons on product cards (visual state lives in CSS via .active)
    const bookmarkButtons = document.querySelectorAll('.wishlist-btn');
    bookmarkButtons.forEach(btn => {
      const productId = btn.dataset.productId;
      btn.classList.toggle('active', this.isInWishlist(productId));
    });

    // Render the wishlist page grid if its container is present. Deliberately
    // not gated on window.location.pathname - Vercel's cleanUrls strips the
    // ".html" from the real browser URL, which would make a
    // pathname.includes('wishlist.html') check always false in production.
    this.renderWishlistPage();

    // Badge count is owned by nav-badges.js, which listens for this event -
    // keeping a single place that touches #wishlistCount avoids two code
    // paths disagreeing about the DOM.
    window.dispatchEvent(new CustomEvent('wishlist:updated', { detail: { count: this.wishlist.length } }));
  }

  renderWishlistPage() {
    const wishlistContainer = document.getElementById('wishlistItems');
    const emptyMessage = document.getElementById('emptyWishlist');
    const loginRequired = document.getElementById('wishlistLoginRequired');
    const sortContainer = document.getElementById('wishlistSort');

    if (!wishlistContainer) return;

    if (!window.authManager?.isAuthenticated()) {
      if (loginRequired) loginRequired.style.display = 'block';
      if (emptyMessage) emptyMessage.style.display = 'none';
      if (sortContainer) sortContainer.style.display = 'none';
      wishlistContainer.innerHTML = '';
      return;
    }

    if (loginRequired) loginRequired.style.display = 'none';

    if (this.wishlist.length === 0) {
      if (emptyMessage) emptyMessage.style.display = 'block';
      if (sortContainer) sortContainer.style.display = 'none';
      wishlistContainer.innerHTML = '';
      return;
    }

    if (emptyMessage) emptyMessage.style.display = 'none';
    if (sortContainer) sortContainer.style.display = 'flex';

    const sortSelect = document.getElementById('wishlistSortSelect');
    if (sortSelect && sortSelect.value !== this.sortBy) {
      sortSelect.value = this.sortBy;
    }

    const items = this.getSortedItems();

    // Render wishlist with event delegation instead of inline onclick
    wishlistContainer.innerHTML = items.map((item, index) => {
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
      const added = await window.cartManager.addItem({
        product_id: item.product_id,
        product_name: item.product_name,
        product_image: item.product_image,
        price: item.price,
        quantity: 1
      });
      if (added) {
        await this.removeItem(productId);
      }
    }
  }

  async moveAllToCart() {
    if (!window.cartManager || this.wishlist.length === 0) return;

    const itemsCopy = [...this.wishlist];
    const movedItems = [];

    // Sequential on purpose: cartManager.addItem() reads the current cart
    // state, diffs, then writes - running these in parallel would race and
    // could silently drop items.
    for (const item of itemsCopy) {
      try {
        const added = await window.cartManager.addItem({
          product_id: item.product_id,
          product_name: item.product_name,
          product_image: item.product_image,
          price: item.price,
          quantity: 1
        });
        if (added) movedItems.push(item);
      } catch (error) {
        logWishlistError('Error moving item to cart:', error);
      }
    }

    if (movedItems.length === 0) {
      window.notificationManager?.error('Could not move items to cart');
      return;
    }

    // Only remove the items that were actually moved - leave the rest
    // in the wishlist instead of silently discarding them.
    try {
      const userId = window.authManager.getUserId();
      const idsToRemove = movedItems.map(item => item.id);
      const { error } = await supabaseClient
        .from('wishlist_items')
        .delete()
        .in('id', idsToRemove)
        .eq('user_id', userId);

      if (error) throw error;

      const movedProductIds = new Set(movedItems.map(item => item.product_id));
      this.wishlist = this.wishlist.filter(item => !movedProductIds.has(item.product_id));

      this.updateWishlistUI();
      window.notificationManager?.success(`Moved ${movedItems.length} item${movedItems.length > 1 ? 's' : ''} to cart!`);
    } catch (error) {
      logWishlistError('Error clearing moved items from wishlist:', error);
      window.notificationManager?.error('Items were added to cart, but the wishlist could not be updated. Please refresh.');
    }
  }
}

// Initialize Wishlist Manager
if (typeof window !== 'undefined') {
  window.wishlistManager = new WishlistManager();
}
