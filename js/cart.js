// Cart Management System
// Handles shopping cart functionality with Supabase integration

class CartManager {
  constructor() {
    this.cart = [];
    this.init();
  }

  async init() {
    if (window.authManager?.isAuthenticated()) {
      // Load cart from Supabase
      await this.loadFromDatabase();
    } else {
      // Load cart from localStorage for guests
      this.loadFromLocalStorage();
    }
    this.updateCartUI();
  }

  async loadFromDatabase() {
    try {
      const userId = window.authManager.getUserId();
      const { data, error } = await supabaseClient
        .from('cart_items')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      this.cart = data || [];
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
      
      // Delete existing cart items
      await supabaseClient
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

      // Insert new cart items
      if (this.cart.length > 0) {
        const cartItems = this.cart.map(item => ({
          user_id: userId,
          product_id: item.product_id,
          product_name: item.product_name,
          product_image: item.product_image,
          price: item.price,
          quantity: item.quantity,
          size: item.size || null,
          color: item.color || null
        }));

        const { error } = await supabaseClient
          .from('cart_items')
          .insert(cartItems);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error saving cart:', error);
      this.saveToLocalStorage();
    }
  }

  saveToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  async addItem(product) {
    const existingItemIndex = this.cart.findIndex(
      item => item.product_id === product.product_id && 
              item.size === product.size && 
              item.color === product.color
    );

    if (existingItemIndex > -1) {
      this.cart[existingItemIndex].quantity += product.quantity || 1;
    } else {
      this.cart.push({
        product_id: product.product_id,
        product_name: product.product_name,
        product_image: product.product_image,
        price: product.price,
        quantity: product.quantity || 1,
        size: product.size || null,
        color: product.color || null,
        added_at: new Date().toISOString()
      });
    }

    await this.saveToDatabase();
    this.updateCartUI();
    this.showNotification('Item added to cart!');
  }

  async removeItem(index) {
    this.cart.splice(index, 1);
    await this.saveToDatabase();
    this.updateCartUI();
  }

  async updateQuantity(index, quantity) {
    if (quantity <= 0) {
      await this.removeItem(index);
      return;
    }
    
    this.cart[index].quantity = quantity;
    await this.saveToDatabase();
    this.updateCartUI();
  }

  async clearCart() {
    this.cart = [];
    await this.saveToDatabase();
    this.updateCartUI();
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
    const cartBadges = document.querySelectorAll('.cart-count');
    const itemCount = this.getItemCount();
    
    cartBadges.forEach(badge => {
      badge.textContent = itemCount;
      badge.style.display = itemCount > 0 ? 'inline-block' : 'none';
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

    if (!cartContainer) return;

    if (this.cart.length === 0) {
      if (emptyMessage) emptyMessage.style.display = 'block';
      if (cartSummary) cartSummary.style.display = 'none';
      if (cartContent) cartContent.classList.add('hidden');
      cartContainer.innerHTML = '';
      return;
    }

    if (emptyMessage) emptyMessage.style.display = 'none';
    if (cartSummary) cartSummary.style.display = 'block';
    if (cartContent) cartContent.classList.remove('hidden');

    cartContainer.innerHTML = this.cart.map((item, index) => `
      <div class="cart-item" data-index="${index}">
        <img src="${item.product_image}" alt="${item.product_name}" class="cart-item-image">
        <div class="cart-item-details">
          <h3 class="cart-item-name">${item.product_name}</h3>
          ${item.size ? `<p class="cart-item-variant">Size: ${item.size}</p>` : ''}
          ${item.color ? `<p class="cart-item-variant">Color: ${item.color}</p>` : ''}
          <p class="cart-item-price">$${item.price.toFixed(2)}</p>
        </div>
        <div class="cart-item-quantity">
          <button class="qty-btn" onclick="cartManager.updateQuantity(${index}, ${item.quantity - 1})">-</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn" onclick="cartManager.updateQuantity(${index}, ${item.quantity + 1})">+</button>
        </div>
        <div class="cart-item-subtotal">
          $${(item.price * item.quantity).toFixed(2)}
        </div>
        <button class="cart-item-remove" onclick="cartManager.removeItem(${index})">×</button>
      </div>
    `).join('');

    if (cartTotal) {
      cartTotal.textContent = `$${this.getTotal().toFixed(2)}`;
    }
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
