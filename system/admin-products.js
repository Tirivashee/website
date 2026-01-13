// Admin Products Management
// Handles CRUD operations for products

class AdminProducts {
  constructor() {
    this.products = [];
    this.categories = [];
    this.currentFilter = 'all';
    this.searchTerm = '';
    this.editingProductId = null;
    this.variants = [];
    this.init();
  }

  async init() {
    // Check admin authentication
    await this.checkAuth();
    
    // Load products and categories
    await this.loadCategories();
    await this.loadProducts();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Render products
    this.renderProducts();
  }

  async checkAuth() {
    if (!window.authManager) {
      await this.waitForAuth();
    }

    if (!window.authManager?.isAuthenticated()) {
      window.location.href = '../users/login.html';
      return;
    }

    if (!window.authManager.isAdmin()) {
      alert('Access denied. Admin privileges required.');
      window.location.href = '../index.html';
      return;
    }
  }

  async waitForAuth() {
    let attempts = 0;
    while (!window.authManager && attempts < 50) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
  }

  async loadCategories() {
    try {
      const { data, error } = await supabaseClient
        .from('product_categories')
        .select('*')
        .order('display_order');

      if (error) throw error;
      this.categories = data || [];
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

  async loadProducts() {
    try {
      const { data, error } = await supabaseClient
        .from('products')
        .select(`
          *,
          variants:product_variants(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      this.products = data || [];
      console.log('Loaded products:', this.products.length);
    } catch (error) {
      console.error('Error loading products:', error);
      this.showError('Failed to load products');
    }
  }

  setupEventListeners() {
    // Search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchTerm = e.target.value.toLowerCase();
        this.renderProducts();
      });
    }

    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.dataset.filter;
        this.renderProducts();
      });
    });

    // Product form
    const form = document.getElementById('productForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveProduct();
      });
    }

    // Auto-generate slug from product name
    const nameInput = document.getElementById('productName');
    const slugInput = document.getElementById('productSlug');
    if (nameInput && slugInput) {
      nameInput.addEventListener('input', (e) => {
        if (!this.editingProductId) {
          slugInput.value = this.generateSlug(e.target.value);
        }
      });
    }
  }

  generateSlug(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  filterProducts() {
    let filtered = this.products;

    // Apply search filter
    if (this.searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(this.searchTerm) ||
        p.sku.toLowerCase().includes(this.searchTerm) ||
        (p.category && p.category.toLowerCase().includes(this.searchTerm))
      );
    }

    // Apply status filter
    switch (this.currentFilter) {
      case 'active':
        filtered = filtered.filter(p => p.is_active);
        break;
      case 'inactive':
        filtered = filtered.filter(p => !p.is_active);
        break;
      case 'featured':
        filtered = filtered.filter(p => p.is_featured);
        break;
      case 'low-stock':
        filtered = filtered.filter(p => {
          const totalStock = (p.variants || []).reduce((sum, v) => sum + (v.inventory_quantity || 0), 0);
          return totalStock < 10;
        });
        break;
    }

    return filtered;
  }

  renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    const filtered = this.filterProducts();

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1;">
          <div class="empty-state-icon">📦</div>
          <h3>NO PRODUCTS FOUND</h3>
          <p>No products match your current filters.</p>
          <button class="btn btn-primary" onclick="adminProducts.openProductModal()">ADD YOUR FIRST PRODUCT</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(product => this.renderProductCard(product)).join('');
  }

  renderProductCard(product) {
    const totalStock = (product.variants || []).reduce((sum, v) => sum + (v.inventory_quantity || 0), 0);
    const variantCount = (product.variants || []).length;
    const isLowStock = totalStock < 10;

    return `
      <div class="product-card">
        <img src="../${product.main_image || 'assets/images/placeholder.jpg'}" 
             alt="${product.name}" 
             class="product-image"
             onerror="this.src='../assets/images/placeholder.jpg'">
        <div class="product-info">
          <div class="product-name">${product.name}</div>
          <div class="product-sku">SKU: ${product.sku}</div>
          <div class="product-price">$${(product.base_price || 0).toFixed(2)}</div>
          <div class="product-meta">
            <span class="badge ${product.is_active ? 'active' : 'inactive'}">
              ${product.is_active ? 'ACTIVE' : 'INACTIVE'}
            </span>
            ${product.is_featured ? '<span class="badge featured">FEATURED</span>' : ''}
            ${isLowStock ? '<span class="badge low-stock">LOW STOCK</span>' : ''}
          </div>
          <div class="stock-info">
            ${variantCount} variant${variantCount !== 1 ? 's' : ''} • ${totalStock} in stock
          </div>
          <div class="product-actions">
            <button onclick="adminProducts.editProduct('${product.id}')">EDIT</button>
            <button onclick="adminProducts.duplicateProduct('${product.id}')">COPY</button>
            <button class="delete-btn" onclick="adminProducts.deleteProduct('${product.id}', '${product.name}')">DELETE</button>
          </div>
        </div>
      </div>
    `;
  }

  openProductModal(productId = null) {
    const modal = document.getElementById('productModal');
    const title = document.getElementById('modalTitle');
    
    this.editingProductId = productId;
    this.variants = [];

    if (productId) {
      title.textContent = 'EDIT PRODUCT';
      this.loadProductData(productId);
    } else {
      title.textContent = 'ADD NEW PRODUCT';
      this.resetForm();
      this.addVariant(); // Add one default variant
    }

    modal.classList.add('show');
  }

  closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('show');
    this.resetForm();
    this.editingProductId = null;
    this.variants = [];
  }

  resetForm() {
    document.getElementById('productForm').reset();
    document.getElementById('productActive').checked = true;
    document.getElementById('productTrackInventory').checked = true;
    document.getElementById('variantsContainer').innerHTML = '';
    this.variants = [];
  }

  async loadProductData(productId) {
    try {
      const product = this.products.find(p => p.id === productId);
      if (!product) throw new Error('Product not found');

      // Fill form
      document.getElementById('productSku').value = product.sku;
      document.getElementById('productName').value = product.name;
      document.getElementById('productSlug').value = product.slug;
      document.getElementById('productDescription').value = product.description || '';
      document.getElementById('productCategory').value = product.category || '';
      document.getElementById('productSubcategory').value = product.subcategory || '';
      document.getElementById('productPrice').value = product.base_price;
      document.getElementById('productComparePrice').value = product.compare_at_price || '';
      document.getElementById('productImage').value = product.main_image || '';
      document.getElementById('productActive').checked = product.is_active;
      document.getElementById('productFeatured').checked = product.is_featured;
      document.getElementById('productTrackInventory').checked = product.track_inventory;

      // Load variants
      this.variants = product.variants || [];
      this.renderVariants();
    } catch (error) {
      console.error('Error loading product:', error);
      this.showError('Failed to load product data');
    }
  }

  addVariant() {
    const variant = {
      id: `temp_${Date.now()}`,
      sku: '',
      size: '',
      color: '',
      price: null,
      inventory_quantity: 0,
      is_active: true
    };
    this.variants.push(variant);
    this.renderVariants();
  }

  removeVariant(variantId) {
    this.variants = this.variants.filter(v => v.id !== variantId);
    this.renderVariants();
  }

  renderVariants() {
    const container = document.getElementById('variantsContainer');
    if (!container) return;

    if (this.variants.length === 0) {
      container.innerHTML = '<p style="color: #666; text-align: center;">No variants added yet.</p>';
      return;
    }

    container.innerHTML = this.variants.map((variant, index) => `
      <div class="variant-item">
        <button type="button" class="variant-remove" onclick="adminProducts.removeVariant('${variant.id}')">&times;</button>
        <div class="form-row">
          <div class="form-group">
            <label>Variant SKU *</label>
            <input type="text" 
                   value="${variant.sku || ''}" 
                   onchange="adminProducts.updateVariant('${variant.id}', 'sku', this.value)"
                   required>
          </div>
          <div class="form-group">
            <label>Size</label>
            <input type="text" 
                   value="${variant.size || ''}"
                   onchange="adminProducts.updateVariant('${variant.id}', 'size', this.value)">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Color</label>
            <input type="text" 
                   value="${variant.color || ''}"
                   onchange="adminProducts.updateVariant('${variant.id}', 'color', this.value)">
          </div>
          <div class="form-group">
            <label>Price ($)</label>
            <input type="number" 
                   step="0.01" 
                   value="${variant.price || ''}"
                   onchange="adminProducts.updateVariant('${variant.id}', 'price', this.value)">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Inventory Quantity *</label>
            <input type="number" 
                   value="${variant.inventory_quantity || 0}"
                   onchange="adminProducts.updateVariant('${variant.id}', 'inventory_quantity', this.value)"
                   required>
          </div>
          <div class="form-group">
            <label>Status</label>
            <select onchange="adminProducts.updateVariant('${variant.id}', 'is_active', this.value === 'true')">
              <option value="true" ${variant.is_active ? 'selected' : ''}>Active</option>
              <option value="false" ${!variant.is_active ? 'selected' : ''}>Inactive</option>
            </select>
          </div>
        </div>
      </div>
    `).join('');
  }

  updateVariant(variantId, field, value) {
    const variant = this.variants.find(v => v.id === variantId);
    if (variant) {
      if (field === 'price' || field === 'inventory_quantity') {
        variant[field] = value ? parseFloat(value) : (field === 'inventory_quantity' ? 0 : null);
      } else {
        variant[field] = value;
      }
    }
  }

  async saveProduct() {
    try {
      // Validate form
      const form = document.getElementById('productForm');
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Validate variants
      if (this.variants.length === 0) {
        alert('Please add at least one product variant');
        return;
      }

      for (const variant of this.variants) {
        if (!variant.sku) {
          alert('All variants must have a SKU');
          return;
        }
      }

      // Gather product data
      const productData = {
        sku: document.getElementById('productSku').value.trim(),
        name: document.getElementById('productName').value.trim(),
        slug: document.getElementById('productSlug').value.trim(),
        description: document.getElementById('productDescription').value.trim(),
        category: document.getElementById('productCategory').value,
        subcategory: document.getElementById('productSubcategory').value.trim() || null,
        base_price: parseFloat(document.getElementById('productPrice').value),
        compare_at_price: document.getElementById('productComparePrice').value ? 
                          parseFloat(document.getElementById('productComparePrice').value) : null,
        main_image: document.getElementById('productImage').value.trim(),
        is_active: document.getElementById('productActive').checked,
        is_featured: document.getElementById('productFeatured').checked,
        track_inventory: document.getElementById('productTrackInventory').checked
      };

      if (this.editingProductId) {
        await this.updateProduct(this.editingProductId, productData);
      } else {
        await this.createProduct(productData);
      }

      this.closeProductModal();
      await this.loadProducts();
      this.renderProducts();
      this.showSuccess(this.editingProductId ? 'Product updated!' : 'Product created!');
    } catch (error) {
      console.error('Error saving product:', error);
      this.showError(error.message || 'Failed to save product');
    }
  }

  async createProduct(productData) {
    // Insert product
    const { data: product, error: productError } = await supabaseClient
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (productError) throw productError;

    // Insert variants
    const variantsData = this.variants.map(v => ({
      product_id: product.id,
      sku: v.sku,
      size: v.size || null,
      color: v.color || null,
      price: v.price,
      inventory_quantity: v.inventory_quantity || 0,
      is_active: v.is_active
    }));

    const { error: variantsError } = await supabaseClient
      .from('product_variants')
      .insert(variantsData);

    if (variantsError) throw variantsError;
  }

  async updateProduct(productId, productData) {
    // Update product
    const { error: productError } = await supabaseClient
      .from('products')
      .update(productData)
      .eq('id', productId);

    if (productError) throw productError;

    // Delete existing variants
    await supabaseClient
      .from('product_variants')
      .delete()
      .eq('product_id', productId);

    // Insert new variants
    const variantsData = this.variants.map(v => {
      const data = {
        product_id: productId,
        sku: v.sku,
        size: v.size || null,
        color: v.color || null,
        price: v.price,
        inventory_quantity: v.inventory_quantity || 0,
        is_active: v.is_active
      };
      
      // Keep existing variant ID if it's not a temp ID
      if (v.id && !v.id.startsWith('temp_')) {
        data.id = v.id;
      }
      
      return data;
    });

    const { error: variantsError } = await supabaseClient
      .from('product_variants')
      .insert(variantsData);

    if (variantsError) throw variantsError;
  }

  async editProduct(productId) {
    this.openProductModal(productId);
  }

  async duplicateProduct(productId) {
    try {
      const product = this.products.find(p => p.id === productId);
      if (!product) throw new Error('Product not found');

      const confirmed = confirm(`Duplicate "${product.name}"?`);
      if (!confirmed) return;

      // Create copy with new SKU
      const newSku = `${product.sku}-COPY`;
      const newSlug = `${product.slug}-copy`;

      const productCopy = {
        ...product,
        sku: newSku,
        slug: newSlug,
        name: `${product.name} (Copy)`,
        is_active: false
      };
      delete productCopy.id;
      delete productCopy.created_at;
      delete productCopy.updated_at;
      delete productCopy.variants;

      // Insert product
      const { data: newProduct, error: productError } = await supabaseClient
        .from('products')
        .insert([productCopy])
        .select()
        .single();

      if (productError) throw productError;

      // Copy variants
      if (product.variants && product.variants.length > 0) {
        const variantsCopy = product.variants.map(v => ({
          product_id: newProduct.id,
          sku: `${v.sku}-COPY`,
          size: v.size,
          color: v.color,
          price: v.price,
          inventory_quantity: 0, // Start with 0 inventory
          is_active: v.is_active
        }));

        const { error: variantsError } = await supabaseClient
          .from('product_variants')
          .insert(variantsCopy);

        if (variantsError) throw variantsError;
      }

      await this.loadProducts();
      this.renderProducts();
      this.showSuccess('Product duplicated!');
    } catch (error) {
      console.error('Error duplicating product:', error);
      this.showError('Failed to duplicate product');
    }
  }

  async deleteProduct(productId, productName) {
    const confirmed = confirm(`Are you sure you want to delete "${productName}"?\n\nThis will also delete all variants and cannot be undone.`);
    if (!confirmed) return;

    try {
      const { error } = await supabaseClient
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      await this.loadProducts();
      this.renderProducts();
      this.showSuccess('Product deleted');
    } catch (error) {
      console.error('Error deleting product:', error);
      this.showError('Failed to delete product');
    }
  }

  showSuccess(message) {
    alert('✓ ' + message);
  }

  showError(message) {
    alert('✗ ' + message);
  }
}

// Initialize
let adminProducts;
window.addEventListener('DOMContentLoaded', () => {
  adminProducts = new AdminProducts();
});

// Global functions for onclick handlers
function openProductModal(productId = null) {
  if (adminProducts) adminProducts.openProductModal(productId);
}

function closeProductModal() {
  if (adminProducts) adminProducts.closeProductModal();
}

function addVariant() {
  if (adminProducts) adminProducts.addVariant();
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeProductModal();
  }
});

// Close modal on backdrop click
document.addEventListener('click', (e) => {
  if (e.target.id === 'productModal') {
    closeProductModal();
  }
});
