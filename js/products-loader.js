// Products Loader - Fetch and Display Products from Database
// Handles dynamic product loading and rendering

class ProductsLoader {
  constructor() {
    this.products = [];
    this.categories = [];
    this.currentFilter = 'all';
    this.currentSort = 'featured';
    this.loading = false;
  }

  async init() {
    await this.loadCategories();
    await this.loadProducts();
    this.renderProducts();
    this.setupFilterListeners();
  }

  async loadCategories() {
    try {
      const { data, error } = await supabaseClient
        .from('product_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      this.categories = data || [];
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

  async loadProducts() {
    this.loading = true;
    this.showLoadingState();

    try {
      // Load products with their variants
      let query = supabaseClient
        .from('products')
        .select(`
          *,
          variants:product_variants(*)
        `)
        .eq('is_active', true);

      // Apply sorting
      switch (this.currentSort) {
        case 'featured':
          query = query.order('is_featured', { ascending: false })
                      .order('featured_order', { ascending: true });
          break;
        case 'price-asc':
          query = query.order('base_price', { ascending: true });
          break;
        case 'price-desc':
          query = query.order('base_price', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        default:
          query = query.order('name', { ascending: true });
      }

      const { data, error } = await query;

      if (error) throw error;
      this.products = data || [];
      
      // Filter products by category if needed
      if (this.currentFilter !== 'all') {
        this.products = this.products.filter(p => p.category === this.currentFilter);
      }

    } catch (error) {
      console.error('Error loading products:', error);
      this.showErrorState();
    } finally {
      this.loading = false;
    }
  }

  renderProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    if (this.products.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
          <h3 style="font-size: 1.5rem; margin-bottom: 16px;">NO PRODUCTS FOUND</h3>
          <p style="color: #666;">Try adjusting your filters or check back later.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = this.products.map(product => this.renderProductCard(product)).join('');

    // Re-initialize product interactions after rendering
    if (window.ProductInteractions) {
      window.productInteractions = new window.ProductInteractions();
    }
  }

  renderProductCard(product) {
    const hasVariants = product.variants && product.variants.length > 0;
    const inStock = hasVariants 
      ? product.variants.some(v => v.inventory_quantity > 0)
      : !product.track_inventory || product.continue_selling_when_out_of_stock;

    const displayPrice = hasVariants && product.variants[0]?.price 
      ? product.variants[0].price 
      : product.base_price;

    const comparePrice = product.compare_at_price;
    const onSale = comparePrice && comparePrice > displayPrice;

    return `
      <div class="card product-card" 
           data-category="${product.category || ''}"
           data-product-id="${product.id}"
           data-product-name="${product.name}"
           data-product-price="${displayPrice}"
           data-product-image="${product.main_image || ''}"
           data-product-slug="${product.slug}">
        <div class="card-image-wrapper">
          ${product.is_featured ? '<div class="card-badge">FEATURED</div>' : ''}
          ${onSale ? '<div class="card-badge" style="background: #FF6600;">SALE</div>' : ''}
          ${!inStock ? '<div class="card-badge" style="background: #999;">OUT OF STOCK</div>' : ''}
          <img src="${product.main_image || 'assets/images/placeholder.jpg'}" 
               alt="${product.name}" 
               class="card-image"
               loading="lazy">
          <div class="product-overlay">
            <button class="btn btn-secondary" onclick="window.productModal?.open('${product.id}')">VIEW</button>
          </div>
        </div>
        <div class="card-content">
          <h3 class="card-title">${product.name}</h3>
          ${product.description ? `<p class="card-description">${this.truncate(product.description, 50)}</p>` : ''}
          <div class="card-price-wrapper">
            ${onSale ? `<span class="card-price-original">$${comparePrice.toFixed(2)}</span>` : ''}
            <p class="card-price">$${displayPrice.toFixed(2)}</p>
          </div>
        </div>
      </div>
    `;
  }

  truncate(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  }

  showLoadingState() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
        <div style="display: inline-block; width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #000; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        <p style="margin-top: 20px; font-size: 1.1rem;">Loading products...</p>
      </div>
    `;
  }

  showErrorState() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
        <h3 style="font-size: 1.5rem; margin-bottom: 16px; color: #d32f2f;">ERROR LOADING PRODUCTS</h3>
        <p style="color: #666; margin-bottom: 20px;">Unable to load products. Please try again later.</p>
        <button onclick="location.reload()" class="btn btn-primary">RELOAD PAGE</button>
      </div>
    `;
  }

  setupFilterListeners() {
    // Category filter
    const filterButtons = document.querySelectorAll('[data-filter]');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentFilter = btn.dataset.filter;
        
        // Update active state
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Reload and render
        this.loadProducts().then(() => this.renderProducts());
      });
    });

    // Sort dropdown
    const sortSelect = document.getElementById('product-sort');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.currentSort = e.target.value;
        this.loadProducts().then(() => this.renderProducts());
      });
    }
  }

  // Get product by ID for cart/wishlist
  async getProduct(productId) {
    try {
      const { data, error } = await supabaseClient
        .from('products')
        .select(`
          *,
          variants:product_variants(*)
        `)
        .eq('id', productId)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  // Get variant by ID
  async getVariant(variantId) {
    try {
      const { data, error } = await supabaseClient
        .from('product_variants')
        .select('*')
        .eq('id', variantId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching variant:', error);
      return null;
    }
  }
}

// Initialize on page load
if (typeof window !== 'undefined') {
  window.productsLoader = new ProductsLoader();
  
  // Auto-init on shop page
  if (window.location.pathname.includes('shop.html')) {
    document.addEventListener('DOMContentLoaded', () => {
      window.productsLoader.init();
    });
  }
}

// Add loading spinner animation
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .card-price-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .card-price-original {
    text-decoration: line-through;
    color: #999;
    font-size: 0.9rem;
  }
`;
document.head.appendChild(style);
