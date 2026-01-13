# Products Database Migration Guide

This guide explains how to migrate from hardcoded products to database-driven products.

## ✅ What Was Changed

### 1. **Database Schema** ([supabase-schema.sql](supabase-schema.sql))
Added three new tables:
- `products` - Main product information (name, description, price, images, etc.)
- `product_variants` - Size/color variants with individual pricing and inventory
- `product_categories` - Hierarchical category system

### 2. **Updated Tables**
- `cart_items` - Now references `products.id` and `product_variants.id` instead of storing product details
- `wishlist_items` - Simplified to only store `product_id` (details fetched via JOIN)
- `order_items` - Added foreign keys to `products` and `product_variants`

### 3. **New JavaScript** ([js/products-loader.js](js/products-loader.js))
- Dynamically loads products from database
- Handles filtering, sorting, and pagination
- Validates products when adding to cart/wishlist
- Checks inventory levels

### 4. **Updated JavaScript**
- [js/cart.js](js/cart.js) - Validates products exist, checks inventory, fetches current prices
- [js/wishlist.js](js/wishlist.js) - Fetches product details via JOINs
- [js/products.js](js/products.js) - Works with both hardcoded and database products

## 📋 Migration Steps

### Step 1: Run Database Migration

1. Open your Supabase SQL Editor
2. Copy the entire [supabase-schema.sql](supabase-schema.sql) file
3. Execute it in Supabase

**Note:** This will:
- Create new product tables
- Modify existing cart/wishlist/order tables
- Add indexes for performance
- Set up Row Level Security policies

### Step 2: Seed Initial Products

You have two options:

#### Option A: Manual Entry (Recommended for Testing)
```sql
-- Insert a test product
INSERT INTO public.products (
  sku, name, slug, description, category,
  base_price, is_active, is_featured, main_image
) VALUES (
  'BCS-001',
  'BLACK CANVAS SHOULDER BAG',
  'black-canvas-shoulder-bag',
  'Durable canvas shoulder bag with utility design',
  'shoulder-bags',
  14.99,
  true,
  true,
  'assets/images/products/prod-bcs.jpg'
);

-- Insert a variant
INSERT INTO public.product_variants (
  product_id, sku, size, price, inventory_quantity, is_active
) VALUES (
  (SELECT id FROM public.products WHERE sku = 'BCS-001'),
  'BCS-001-OS',
  'One Size',
  14.99,
  50,
  true
);
```

#### Option B: Bulk Import Script
Create a script to import your existing products. See [PRODUCT-IMPORT-TEMPLATE.md](PRODUCT-IMPORT-TEMPLATE.md) for examples.

### Step 3: Update Shop Page

The shop page will automatically load products from the database. The [js/products-loader.js](js/products-loader.js) script:
- Replaces hardcoded products with dynamic loading
- Maintains the same UI/styling
- Works with existing filters

**To test:**
1. Add products to database
2. Refresh [shop.html](shop.html)
3. Products should load dynamically

### Step 4: Clear Old Cart/Wishlist Data (Optional)

Since the data structure changed, you may want to clear existing cart/wishlist items:

```sql
-- Clear all cart items (users will need to re-add items)
DELETE FROM public.cart_items;

-- Clear all wishlist items
DELETE FROM public.wishlist_items;
```

**Alternative:** Keep items but they won't display until products are added with matching IDs.

## 🎯 Benefits

### Before (Hardcoded):
- ❌ Products in HTML files
- ❌ Product IDs generated from DOM position (`product-1`, `product-2`)
- ❌ No inventory tracking
- ❌ Prices can become stale in cart
- ❌ No product validation

### After (Database):
- ✅ Products managed in database
- ✅ Real UUID product IDs
- ✅ Inventory tracking per variant
- ✅ Prices always current
- ✅ Product validation (exists, active, in stock)
- ✅ Easy to add/edit/delete products
- ✅ Support for product variants (size/color)

## 🧪 Testing Checklist

- [ ] Database migration runs without errors
- [ ] Products display on shop page
- [ ] Can add product to cart
- [ ] Can add product to wishlist
- [ ] Cart shows correct product details
- [ ] Wishlist shows correct product details
- [ ] Out of stock products can't be added to cart
- [ ] Filters work (if configured)
- [ ] Product prices update when changed in database

## 🔧 Admin Product Management

You'll need to create an admin interface to manage products. For now, use:

1. **Supabase Dashboard** - Table Editor for direct database access
2. **SQL Editor** - For bulk operations
3. **Future:** Build admin panel in [system/system.html](system/system.html)

## 📊 Product Data Structure

### Products Table
```typescript
{
  id: UUID
  sku: string (unique)
  name: string
  slug: string (unique, for URLs)
  description: text
  category: string
  base_price: decimal
  main_image: string (URL)
  additional_images: string[] (array)
  is_active: boolean
  is_featured: boolean
  track_inventory: boolean
  created_at: timestamp
}
```

### Product Variants Table
```typescript
{
  id: UUID
  product_id: UUID (foreign key)
  sku: string (unique)
  size: string
  color: string
  price: decimal (overrides base_price)
  inventory_quantity: integer
  is_active: boolean
}
```

## 🚨 Troubleshooting

### Products not loading?
1. Check browser console for errors
2. Verify products exist in database with `is_active = true`
3. Check Supabase RLS policies allow anonymous SELECT on products

### Cart/Wishlist errors?
1. Clear localStorage: `localStorage.clear()`
2. Clear database items (see Step 4)
3. Check that product IDs in cart/wishlist match database UUIDs

### Images not showing?
1. Verify image paths in `main_image` field
2. Check images exist in `assets/images/products/`
3. Use relative paths: `assets/images/products/prod-name.jpg`

## 🔄 Rolling Back

If you need to revert:

1. Remove `<script src="js/products-loader.js"></script>` from shop.html
2. The hardcoded products will still work for guests
3. Database products won't break existing functionality

## 📞 Support

For issues or questions about the migration, check:
- Database logs in Supabase
- Browser console for JavaScript errors
- Network tab for failed API calls
