// Cart Management System
// Handles shopping cart functionality with Supabase integration

// Cart Configuration
const CART_LIMITS = {
  MAX_QUANTITY_PER_ITEM: 99,
  MAX_TOTAL_ITEMS: 100,
  MAX_UNIQUE_PRODUCTS: 50
};

class CartManager {
  constructor() {
    this.cart = [];
    this.init();
  }

  async init() {
    // Wait for auth to be ready
    await this.waitForAuth();
    
    if (window.authManager?.isAuthenticated()) {
      // If guest cart exists in localStorage, merge it into the user's database cart
      const guestCart = localStorage.getItem('cart');
      if (guestCart && guestCart !== '[]') {
        await this.mergeLocalToDatabase();
      } else {
        // Load cart from Supabase
        await this.loadFromDatabase();
      }
    } else {
      // Load cart from localStorage for guests
      this.loadFromLocalStorage();
    }
    this.updateCartUI();
  }

  // Merge localStorage cart into Supabase for authenticated user
  async mergeLocalToDatabase() {
    try {
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const userId = window.authManager.getUserId();

      // Fetch existing DB items for user
      const { data: dbItems, error } = await supabaseClient
        .from('cart_items')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      const db = dbItems || [];

      // Merge by product_id + size + color
      const key = (it) => `${it.product_id}||${it.size || ''}||${it.color || ''}`;
      const map = new Map();

      db.forEach(it => {
        map.set(key(it), Object.assign({}, it));
      });

      localCart.forEach(it => {
        const k = key(it);
        if (map.has(k)) {
          map.get(k).quantity = (parseInt(map.get(k).quantity, 10) || 0) + (parseInt(it.quantity, 10) || 1);
        } else {
          map.set(k, {
            user_id: userId,
            product_id: it.product_id,
            product_name: it.product_name,
            product_image: it.product_image,
            price: it.price,
            quantity: it.quantity || 1,
            size: it.size || null,
            color: it.color || null,
            added_at: it.added_at || new Date().toISOString()
          });
        }
      });

      // Convert merged map into this.cart format (no DB ids)
      this.cart = Array.from(map.values()).map(it => ({
        product_id: it.product_id,
        product_name: it.product_name,
        product_image: it.product_image,
        price: it.price,
        quantity: it.quantity,
        size: it.size || null,
        color: it.color || null,
        added_at: it.added_at || new Date().toISOString()
      }));

      // Persist merged cart to database
      await this.saveToDatabase();

      // Clear guest cart
      localStorage.removeItem('cart');
    } catch (err) {
      console.error('Error merging local cart into database:', err);
      // Fallback: load DB and then append local items via addItem
      await this.loadFromDatabase();
      const fallbackLocal = JSON.parse(localStorage.getItem('cart') || '[]');
      if (fallbackLocal.length > 0) {
        for (const it of fallbackLocal) {
          await this.addItem(it);
        }
        localStorage.removeItem('cart');
      }
    }
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
        .from('cart_items')
        .select(`
          *,
          product:products(*),
          variant:product_variants(*)
        `)
        .eq('user_id', userId);

      if (error) throw error;
      
      // Transform data to include product details
      this.cart = (data || []).map(item => ({
        id: item.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        product_name: item.product?.name || 'Unknown Product',
        product_image: item.product?.main_image || '',
        price: item.variant?.price || item.product?.base_price || 0,
        quantity: item.quantity,
        size: item.variant?.size || null,
        color: item.variant?.color || null,
        added_at: item.created_at,
        in_stock: item.variant 
          ? item.variant.inventory_quantity > 0 
          : !item.product?.track_inventory || item.product?.continue_selling_when_out_of_stock
      }));
    } catch (error) {
      console.error('Error loading cart:', error);
      this.loadFromLocalStorage();
    }
  }

  loadFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    this.cart = savedCart ? JSON.parse(savedCart) : [];
  }

  async saveToDatabase() {
    if (!window.authManager?.isAuthenticated()) {
      this.saveToLocalStorage();
      return;
    }

    try {
      const userId = window.authManager.getUserId();

      // Fetch existing cart items from database
      const { data: existingItems, error: fetchErr } = await supabaseClient
        .from('cart_items')
        .select('id, product_id, variant_id, quantity')
        .eq('user_id', userId);

      if (fetchErr) throw fetchErr;

      const existing = existingItems || [];

      // Create lookup key for cart items (product_id + variant_id)
      const itemKey = (item) => `${item.product_id}||${item.variant_id || 'null'}`;

      // Build maps for comparison
      const currentMap = new Map(this.cart.map(item => [itemKey(item), item]));
      const existingMap = new Map(existing.map(item => [itemKey(item), item]));

      // Determine operations needed
      const toInsert = [];
      const toUpdate = [];
      const toDelete = [];

      // Check current cart items - insert new or update existing
      for (const [key, item] of currentMap) {
        const existingItem = existingMap.get(key);
        
        if (existingItem) {
          // Item exists - update if quantity changed
          if (existingItem.quantity !== item.quantity) {
            toUpdate.push({
              id: existingItem.id,
              quantity: item.quantity
            });
          }
        } else {
          // New item - insert
          toInsert.push({
            user_id: userId,
            product_id: item.product_id,
            variant_id: item.variant_id || null,
            quantity: item.quantity
          });
        }
      }

      // Check for items to delete (in DB but not in current cart)
      for (const [key, item] of existingMap) {
        if (!currentMap.has(key)) {
          toDelete.push(item.id);
        }
      }

      // Execute operations
      const operations = [];

      // Insert new items
      if (toInsert.length > 0) {
        operations.push(
          supabaseClient.from('cart_items').insert(toInsert)
        );
      }

      // Update existing items
      for (const update of toUpdate) {
        operations.push(
          supabaseClient
            .from('cart_items')
            .update({ quantity: update.quantity })
            .eq('id', update.id)
        );
      }

      // Delete removed items
      if (toDelete.length > 0) {
        operations.push(
          supabaseClient
            .from('cart_items')
            .delete()
            .in('id', toDelete)
        );
      }

      // Execute all operations
      if (operations.length > 0) {
        const results = await Promise.all(operations);
        
        // Check for errors
        const errors = results.filter(r => r.error);
        if (errors.length > 0) {
          console.error('Cart save errors:', errors);
          throw new Error('Failed to save cart changes');
        }
      }
    } catch (error) {
      console.error('Error saving cart:', error);
      // Fallback to localStorage on error
      this.saveToLocalStorage();
      throw error;
    }
  }

  saveToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  async addItem(product) {
    // Validate product data
    if (!product || !product.product_id) {
      console.error('Invalid cart item - missing product_id:', product);
      window.notificationManager?.error('Failed to add item to cart');
      return;
    }

    // For database products, fetch full product details if needed
    if (window.productsLoader && !product.product_name) {
      const fullProduct = await window.productsLoader.getProduct(product.product_id);
      if (!fullProduct) {
        window.notificationManager?.error('Product not found');
        return;
      }

      // Check variant if specified
      let variant = null;
      if (product.variant_id) {
        variant = await window.productsLoader.getVariant(product.variant_id);
        if (!variant || !variant.is_active) {
          window.notificationManager?.error('Product variant not available');
          return;
        }

        // Check inventory
        if (variant.inventory_policy === 'deny' && variant.inventory_quantity < 1) {
          window.notificationManager?.error('This item is out of stock');
          return;
        }
      } else {
        // Check base product inventory
        if (fullProduct.track_inventory && !fullProduct.continue_selling_when_out_of_stock) {
          const totalInventory = fullProduct.variants?.reduce((sum, v) => sum + (v.inventory_quantity || 0), 0) || 0;
          if (totalInventory < 1) {
            window.notificationManager?.error('This item is out of stock');
            return;
          }
        }
      }

      // Enrich product data
      product = {
        product_id: fullProduct.id,
        variant_id: variant?.id || null,
        product_name: fullProduct.name,
        product_image: fullProduct.main_image,
        price: variant?.price || fullProduct.base_price,
        quantity: product.quantity || 1,
        size: variant?.size || null,
        color: variant?.color || null,
        in_stock: true
      };
    }
    
    // Validate price
    const price = parseFloat(product.price);
    if (isNaN(price) || price < 0) {
      console.error('Invalid product price:', product.price);
      window.notificationManager?.error('Invalid product price');
      return;
    }

    // Validate quantity
    const quantity = parseInt(product.quantity, 10) || 1;
    if (quantity <= 0 || quantity > CART_LIMITS.MAX_QUANTITY_PER_ITEM) {
      window.notificationManager?.error(`Quantity must be between 1 and ${CART_LIMITS.MAX_QUANTITY_PER_ITEM}`);
      return;
    }
    
    const existingItemIndex = this.cart.findIndex(
      item => item.product_id === product.product_id && 
              item.variant_id === product.variant_id
    );

    if (existingItemIndex > -1) {
      // Check if adding would exceed per-item limit
      const newQuantity = this.cart[existingItemIndex].quantity + quantity;
      if (newQuantity > CART_LIMITS.MAX_QUANTITY_PER_ITEM) {
        window.notificationManager?.error(`Cannot add more. Maximum ${CART_LIMITS.MAX_QUANTITY_PER_ITEM} per item`);
        return;
      }
      this.cart[existingItemIndex].quantity = newQuantity;
    } else {
      // Check unique products limit
      if (this.cart.length >= CART_LIMITS.MAX_UNIQUE_PRODUCTS) {
        window.notificationManager?.error(`Cart is full. Maximum ${CART_LIMITS.MAX_UNIQUE_PRODUCTS} different items`);
        return;
      }

      this.cart.push({
        product_id: product.product_id,
        variant_id: product.variant_id || null,
        product_name: product.product_name,
        product_image: product.product_image,
        price: price,
        quantity: quantity,
        size: product.size || null,
        color: product.color || null,
        added_at: new Date().toISOString(),
        in_stock: product.in_stock !== false
      });
    }

    // Check total items limit
    const totalItems = this.getItemCount();
    if (totalItems > CART_LIMITS.MAX_TOTAL_ITEMS) {
      // Revert the change
      if (existingItemIndex > -1) {
        this.cart[existingItemIndex].quantity -= quantity;
      } else {
        this.cart.pop();
      }
      window.notificationManager?.error(`Cart limit reached. Maximum ${CART_LIMITS.MAX_TOTAL_ITEMS} total items`);
      return;
    }

    try {
      await this.saveToDatabase();
      this.updateCartUI();
      this.showNotification('Item added to cart!');
    } catch (error) {
      console.error('Failed to save cart:', error);
      window.notificationManager?.error('Failed to add item. Please try again.');
    }
  }

  async removeItem(index) {
    if (index < 0 || index >= this.cart.length) {
      console.error('Invalid cart item index:', index);
      return;
    }

    this.cart.splice(index, 1);
    
    try {
      await this.saveToDatabase();
      this.updateCartUI();
    } catch (error) {
      console.error('Failed to remove item:', error);
      window.notificationManager?.error('Failed to remove item. Please try again.');
    }
  }

  async updateQuantity(index, quantity) {
    if (quantity <= 0) {
      await this.removeItem(index);
      return;
    }

    // Validate quantity limits
    if (quantity > CART_LIMITS.MAX_QUANTITY_PER_ITEM) {
      window.notificationManager?.error(`Maximum quantity is ${CART_LIMITS.MAX_QUANTITY_PER_ITEM}`);
      return;
    }

    // Check total items limit
    const currentTotal = this.getItemCount();
    const difference = quantity - this.cart[index].quantity;
    if (currentTotal + difference > CART_LIMITS.MAX_TOTAL_ITEMS) {
      window.notificationManager?.error(`Cart limit reached. Maximum ${CART_LIMITS.MAX_TOTAL_ITEMS} total items`);
      return;
    }
    
    this.cart[index].quantity = quantity;
    
    try {
      await this.saveToDatabase();
      this.updateCartUI();
    } catch (error) {
      console.error('Failed to update quantity:', error);
      window.notificationManager?.error('Failed to update quantity. Please try again.');
    }
  }

  async clearCart() {
    this.cart = [];
    
    try {
      await this.saveToDatabase();
      this.updateCartUI();
    } catch (error) {
      console.error('Failed to clear cart:', error);
      // Still clear UI even if save fails
      this.updateCartUI();
    }
  }

  getTotal() {
    return this.cart.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  getItemCount() {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }

  updateCartUI() {
    // Update cart count badges
    const cartBadges = document.querySelectorAll('.cart-count, #cartCount');
    const itemCount = this.getItemCount();
    
    cartBadges.forEach(badge => {
      badge.textContent = itemCount;
      badge.style.display = itemCount > 0 ? 'flex' : 'none';
    });

    // Update cart page if on cart page
    if (window.location.pathname.includes('cart.html')) {
      this.renderCartPage();
    }
  }

  renderCartPage() {
    const cartContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const emptyMessage = document.getElementById('emptyCart');
    const cartSummary = document.getElementById('cartSummary');
    const cartContent = document.querySelector('.cart-content');
    const authMessage = document.getElementById('cartAuthMessage');

    if (!cartContainer) return;

    // Show/hide auth message for non-authenticated users
    if (authMessage) {
      const isAuthenticated = window.authManager?.isAuthenticated();
      authMessage.style.display = isAuthenticated ? 'none' : 'block';
    }

    // Handle empty cart state
    if (this.cart.length === 0) {
      if (emptyMessage) {
        emptyMessage.style.display = 'block';
      }
      if (cartSummary) {
        cartSummary.style.display = 'none';
      }
      if (cartContent) {
        cartContent.style.display = 'none';
      }
      cartContainer.innerHTML = '';
      console.log('Cart is empty - showing empty state');
      return;
    }

    // Handle cart with items
    if (emptyMessage) {
      emptyMessage.style.display = 'none';
    }
    if (cartSummary) {
      cartSummary.style.display = 'block';
    }
    if (cartContent) {
      cartContent.style.display = 'grid';
    }

    // Render cart with event delegation instead of inline onclick
    cartContainer.innerHTML = this.cart.map((item, index) => {
      const price = parseFloat(item.price) || 0;
      return `
      <div class="cart-item" data-index="${index}">
        <div class="cart-item-image-wrapper">
          <img src="${item.product_image || ''}" alt="${item.product_name || 'Product'}" class="cart-item-image">
        </div>
        <div class="cart-item-details">
          <h3>${item.product_name || 'Unknown Product'}</h3>
          ${item.size ? `<p class="cart-item-variant">Size: ${item.size}</p>` : ''}
          ${item.color ? `<p class="cart-item-variant">Color: ${item.color}</p>` : ''}
          <p class="cart-item-price">$${price.toFixed(2)}</p>
        </div>
        <div class="cart-item-actions">
          <div class="cart-item-quantity">
            <button class="qty-btn" data-action="decrease" data-index="${index}" data-quantity="${item.quantity}">-</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn" data-action="increase" data-index="${index}" data-quantity="${item.quantity}">+</button>
          </div>
          <button class="cart-item-remove" data-action="remove" data-index="${index}">×</button>
        </div>
      </div>
    `;
    }).join('');

    const total = this.getTotal() || 0;
    const subtotalElement = document.getElementById('cartSubtotal');
    const totalElement = document.getElementById('cartTotal');
    
    if (subtotalElement) {
      subtotalElement.textContent = `$${total.toFixed(2)}`;
    }
    if (totalElement) {
      totalElement.textContent = `$${total.toFixed(2)}`;
    }
    
    // Add event delegation for cart actions
    this.attachCartEventListeners(cartContainer);
  }
  
  attachCartEventListeners(container) {
    if (!container) return;
    
    // Remove existing listener if it exists
    if (container._cartListenerAttached) return;
    container._cartListenerAttached = true;
    
    // Use event delegation to handle all button clicks
    container.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action]');
      if (!target) return;
      
      const action = target.dataset.action;
      const index = parseInt(target.dataset.index, 10);
      
      if (isNaN(index)) return;
      
      if (action === 'increase') {
        e.preventDefault();
        const currentQty = parseInt(target.dataset.quantity, 10) || 0;
        this.updateQuantity(index, currentQty + 1);
      } else if (action === 'decrease') {
        e.preventDefault();
        const currentQty = parseInt(target.dataset.quantity, 10) || 0;
        this.updateQuantity(index, currentQty - 1);
      } else if (action === 'remove') {
        e.preventDefault();
        this.removeItem(index);
      }
    });
  }

  showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
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

// Initialize Cart Manager
if (typeof window !== 'undefined') {
  window.cartManager = new CartManager();
}
