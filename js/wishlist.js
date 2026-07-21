// Wishlist Management System
// Handles wishlist functionality with Supabase integration

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
    this._warnedSkippedIds = new Set();
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
      logWishlistError('Error merging local wishlist into database:', err);
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
    // Guard against re-registering on every init() (e.g. on each auth state change)
    if (this._storageListenerAttached) return;
    this._storageListenerAttached = true;

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
      logWishlistError('Error loading wishlist:', error);
      this.loadFromLocalStorage();
    }
  }

  loadFromLocalStorage() {
    const savedWishlist = localStorage.getItem('wishlist');
    this.wishlist = savedWishlist ? JSON.parse(savedWishlist) : [];
  }

  // Warn (once per product) when an item can't be synced to the account instead
  // of only logging to the console, so guests-turned-users don't silently lose items.
  warnSkippedItems(items) {
    const skipped = items.filter(item => !isValidProductUUID(item.product_id));
    if (skipped.length === 0) return;

    console.warn(`${skipped.length} wishlist item(s) not synced to your account - missing a valid product ID`);

    const newlySkipped = skipped.filter(item => !this._warnedSkippedIds.has(item.product_id));
    if (newlySkipped.length > 0) {
      newlySkipped.forEach(item => this._warnedSkippedIds.add(item.product_id));
      window.notificationManager?.warning("Some items can't be saved to your account and will only be kept for this browsing session.");
    }
  }

  async saveToDatabase() {
    if (!window.authManager?.isAuthenticated()) {
      this.saveToLocalStorage();
      return;
    }

    try {
      const userId = window.authManager.getUserId();

      // Only items with a real product UUID can be persisted to Supabase
      // (wishlist_items.product_id has an FK to products.id). Catalog items
      // that don't have a matching database record yet stay session-only
      // rather than corrupting the user's saved wishlist.
      const persistable = this.wishlist.filter(item => isValidProductUUID(item.product_id));
      this.warnSkippedItems(this.wishlist);

      const { data: existing, error: fetchErr } = await supabaseClient
        .from('wishlist_items')
        .select('id, product_id')
        .eq('user_id', userId);

      if (fetchErr) throw fetchErr;

      const existingItems = existing || [];
      const currentIds = new Set(persistable.map(item => item.product_id));
      const existingIds = new Set(existingItems.map(item => item.product_id));

      const toInsert = persistable
        .filter(item => !existingIds.has(item.product_id))
        .map(item => ({ user_id: userId, product_id: item.product_id }));

      const toDeleteIds = existingItems
        .filter(item => !currentIds.has(item.product_id))
        .map(item => item.id);

      const operations = [];
      if (toInsert.length > 0) {
        operations.push(supabaseClient.from('wishlist_items').insert(toInsert));
      }
      if (toDeleteIds.length > 0) {
        operations.push(supabaseClient.from('wishlist_items').delete().in('id', toDeleteIds));
      }

      if (operations.length > 0) {
        const results = await Promise.all(operations);
        const errors = results.filter(r => r.error);
        if (errors.length > 0) {
          errors.forEach((r, i) => logWishlistError(`Wishlist save error (operation ${i}):`, r.error));
          throw new Error('Failed to save wishlist changes');
        }
      }
    } catch (error) {
      logWishlistError('Error saving wishlist:', error);
      // Fallback to localStorage so nothing is lost locally, but let the
      // caller know the account-level save failed so it can inform the user
      // instead of showing a false "success" message.
      this.saveToLocalStorage();
      throw error;
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
    if (window.productsLoader && !product.product_name) {
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
    const wasInWishlist = index > -1;
    const removedItem = wasInWishlist ? this.wishlist[index] : null;

    if (wasInWishlist) {
      this.wishlist.splice(index, 1);
    } else {
      this.wishlist.push({
        product_id: product.product_id,
        product_name: product.product_name || 'Unknown Product',
        product_image: product.product_image || '',
        price: price,
        added_at: new Date().toISOString(),
        in_stock: product.in_stock !== false
      });
    }

    try {
      await this.saveToDatabase();
    } catch (error) {
      // Revert the optimistic change so in-memory state matches what's actually
      // persisted, instead of showing a success toast for a write that failed.
      if (wasInWishlist) {
        this.wishlist.splice(index, 0, removedItem);
      } else {
        this.wishlist.pop();
      }
      this.updateWishlistUI();
      window.notificationManager?.error('Failed to update wishlist. Please try again.');
      return wasInWishlist;
    }

    this.updateWishlistUI();
    window.notificationManager?.success(wasInWishlist ? 'Removed from wishlist' : 'Added to wishlist!');
    return !wasInWishlist;
  }

  isInWishlist(productId) {
    return this.wishlist.some(item => item.product_id === productId);
  }

  async removeItem(productId) {
    const index = this.wishlist.findIndex(item => item.product_id === productId);
    if (index === -1) return;

    const removedItem = this.wishlist[index];
    this.wishlist.splice(index, 1);

    try {
      await this.saveToDatabase();
    } catch (error) {
      this.wishlist.splice(index, 0, removedItem);
      this.updateWishlistUI();
      window.notificationManager?.error('Failed to remove item. Please try again.');
      return;
    }

    this.updateWishlistUI();
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
    // ".html" from the real browser URL (e.g. "/wishlist", not
    // "/wishlist.html"), which made that check always false in production
    // and silently skipped this render entirely. renderWishlistPage() already
    // no-ops safely when #wishlistItems isn't on the page.
    this.renderWishlistPage();

    // Badge count is owned by nav-badges.js, which listens for this event -
    // keeping a single place that touches #wishlistCount avoids two code
    // paths disagreeing about the DOM.
    window.dispatchEvent(new CustomEvent('wishlist:updated', { detail: { count: this.wishlist.length } }));
  }

  renderWishlistPage() {
    const wishlistContainer = document.getElementById('wishlistItems');
    const emptyMessage = document.getElementById('emptyWishlist');
    const authMessage = document.getElementById('wishlistAuthMessage');
    const sortContainer = document.getElementById('wishlistSort');

    if (!wishlistContainer) return;

    // Show/hide auth message for non-authenticated users
    if (authMessage) {
      const isAuthenticated = window.authManager?.isAuthenticated();
      authMessage.style.display = isAuthenticated ? 'none' : 'block';
    }

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
    const movedProductIds = [];

    // Sequential on purpose: saveToDatabase() (called by cartManager.addItem)
    // reads the current DB state, diffs, then writes - running these in
    // parallel would race and could silently drop items.
    for (const item of itemsCopy) {
      try {
        const added = await window.cartManager.addItem({
          product_id: item.product_id,
          product_name: item.product_name,
          product_image: item.product_image,
          price: item.price,
          quantity: 1
        });
        if (added) movedProductIds.push(item.product_id);
      } catch (error) {
        logWishlistError('Error moving item to cart:', error);
      }
    }

    // Only remove the items that were actually moved - leave the rest
    // in the wishlist instead of silently discarding them.
    if (movedProductIds.length > 0) {
      const previousWishlist = [...this.wishlist];
      this.wishlist = this.wishlist.filter(item => !movedProductIds.includes(item.product_id));

      try {
        await this.saveToDatabase();
      } catch (error) {
        this.wishlist = previousWishlist;
        this.updateWishlistUI();
        window.notificationManager?.error('Items were added to cart, but the wishlist could not be updated. Please refresh.');
        return;
      }

      this.updateWishlistUI();
      window.notificationManager?.success(`Moved ${movedProductIds.length} item${movedProductIds.length > 1 ? 's' : ''} to cart!`);
    } else {
      window.notificationManager?.error('Could not move items to cart');
    }
  }
}

// Initialize Wishlist Manager
if (typeof window !== 'undefined') {
  window.wishlistManager = new WishlistManager();
}
