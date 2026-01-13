# Admin Products Management Guide

## Overview

A complete admin interface for managing your BALLYLIKE product catalog with full CRUD operations, variant management, and inventory tracking.

## Access

**URL:** `system/products.html`

**Requirements:**
- Must be logged in as admin
- Admin role set in database: `UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com'`

## Features

### 📦 Product Management

#### View Products
- **Grid view** with product images, prices, and status
- **Search** by name, SKU, or category
- **Filter** by: All, Active, Inactive, Featured, Low Stock
- **Real-time inventory** display per product

#### Add New Product
1. Click **"+ ADD PRODUCT"** button
2. Fill in product details:
   - **SKU** (unique identifier)
   - **Product Name** (auto-generates URL slug)
   - **Description** (optional but recommended)
   - **Category** (required)
   - **Base Price** (required)
   - **Compare at Price** (optional, for sales)
   - **Main Image** (URL path)
3. Configure settings:
   - ☑️ **Active** - Show on shop
   - ☑️ **Featured** - Highlight product
   - ☑️ **Track Inventory** - Enable stock management
4. Add **Variants** (at least one required):
   - Variant SKU
   - Size (optional)
   - Color (optional)
   - Price (overrides base price if set)
   - Inventory Quantity
   - Status (Active/Inactive)
5. Click **"SAVE PRODUCT"**

#### Edit Product
1. Find product in grid
2. Click **"EDIT"** button
3. Modify any fields
4. Update variants (add/remove/edit)
5. Click **"SAVE PRODUCT"**

#### Duplicate Product
1. Find product in grid
2. Click **"COPY"** button
3. Creates a copy with:
   - `-COPY` appended to SKU
   - `(Copy)` appended to name
   - **Inactive status** by default
   - **0 inventory** for all variants
4. Edit the copy to customize

#### Delete Product
1. Find product in grid
2. Click **"DELETE"** button
3. Confirm deletion
4. ⚠️ **Warning:** Permanently deletes product and all variants

### 🏷️ Product Variants

Variants allow you to sell the same product in different configurations (sizes, colors, etc.)

**Example: T-Shirt**
- Base Product: "Urban Fashion Tee"
- Variants:
  - Small - $14.99 - 15 in stock
  - Medium - $14.99 - 20 in stock
  - Large - $14.99 - 20 in stock
  - XL - $14.99 - 10 in stock

**Variant Fields:**
- **SKU** - Unique identifier (e.g., `UFT-001-M`)
- **Size** - Optional (S, M, L, XL, One Size)
- **Color** - Optional (Black, White, Blue)
- **Price** - Optional override of base price
- **Inventory** - Stock quantity
- **Status** - Active/Inactive

### 📊 Inventory Management

**Inventory Display:**
- Shows **total stock** across all variants
- **Low Stock warning** when < 10 items
- Track per-variant inventory levels

**Stock Control:**
- Set quantity when creating/editing variants
- Inventory prevents overselling (when tracked)
- Option to continue selling when out of stock

**Inventory Policies:**
- **Track Inventory** ON: Prevent sales when out of stock
- **Track Inventory** OFF: Allow unlimited sales

### 🔍 Search & Filters

**Search Box:**
- Search by product name
- Search by SKU
- Search by category
- Real-time filtering

**Filter Buttons:**
- **ALL** - Show all products
- **ACTIVE** - Only visible on shop
- **INACTIVE** - Hidden from shop
- **FEATURED** - Highlighted products
- **LOW STOCK** - Less than 10 units

### 🎨 Product Images

**Image Management:**
- Provide relative path: `assets/images/products/product-name.jpg`
- Images must exist in filesystem
- Recommended size: 800x800px minimum
- Format: JPG or PNG

**To Add Images:**
1. Upload image to `website/assets/images/products/`
2. In admin, enter path: `assets/images/products/your-image.jpg`
3. Image displays in product card

**Future:** Add image uploader to admin panel

### 📈 Product Status

**Status Badges:**
- 🟢 **ACTIVE** - Visible on shop, can be purchased
- 🔴 **INACTIVE** - Hidden from shop
- ⭐ **FEATURED** - Highlighted/promoted
- ⚠️ **LOW STOCK** - Less than 10 units total

**Best Practices:**
- Set **INACTIVE** for products being prepared
- Use **FEATURED** for promotions/new arrivals
- Monitor **LOW STOCK** to reorder

## Data Structure

### Product Table Schema
```sql
products {
  id: UUID (auto-generated)
  sku: TEXT (unique)
  name: TEXT
  slug: TEXT (URL-friendly)
  description: TEXT
  category: TEXT
  subcategory: TEXT
  base_price: DECIMAL
  compare_at_price: DECIMAL
  main_image: TEXT
  is_active: BOOLEAN
  is_featured: BOOLEAN
  track_inventory: BOOLEAN
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

### Variant Table Schema
```sql
product_variants {
  id: UUID (auto-generated)
  product_id: UUID (foreign key)
  sku: TEXT (unique)
  size: TEXT
  color: TEXT
  price: DECIMAL (optional)
  inventory_quantity: INTEGER
  is_active: BOOLEAN
  created_at: TIMESTAMP
}
```

## Integration

### Cart & Wishlist
- Cart items reference `product_id` and `variant_id`
- Products validate before adding to cart:
  - ✓ Product exists and is active
  - ✓ Variant exists and is active
  - ✓ Sufficient inventory available
- Prices fetched from database (always current)

### Shop Page
- Products load dynamically from database
- Filtering by category
- Sorting options
- Inventory status displayed

### Orders
- Order items store product/variant references
- Historical snapshot of name, price, image
- Track which products are popular

## Workflow Examples

### Adding a New T-Shirt
1. Click **"+ ADD PRODUCT"**
2. Enter:
   - SKU: `URBAN-TEE-001`
   - Name: `Urban Style Tee`
   - Category: `garments`
   - Base Price: `19.99`
   - Image: `assets/images/products/urban-tee.jpg`
3. Add variants:
   - `URBAN-TEE-001-S` - Small - 20 stock
   - `URBAN-TEE-001-M` - Medium - 30 stock
   - `URBAN-TEE-001-L` - Large - 25 stock
   - `URBAN-TEE-001-XL` - XL - 15 stock
4. Enable **Active** and **Featured**
5. Save

### Running a Sale
1. Edit product
2. Set **Compare at Price** to original price
3. Lower **Base Price** to sale price
4. Shop displays strikethrough original price
5. After sale, revert prices

### Managing Out of Stock
1. Use **LOW STOCK** filter to find products
2. Edit each product
3. Update variant inventory quantities
4. Or set **Track Inventory** OFF to allow backorders

## Troubleshooting

### Product Not Showing on Shop
- ✓ Check **is_active** is enabled
- ✓ Check at least one variant exists
- ✓ Check variant **is_active** is enabled
- ✓ Check image path is correct

### Can't Add to Cart
- ✓ Product must be **active**
- ✓ Variant must be **active**
- ✓ Inventory must be > 0 (if tracking enabled)
- ✓ Check browser console for errors

### Image Not Loading
- ✓ Verify file exists in `assets/images/products/`
- ✓ Check path format: `assets/images/products/name.jpg`
- ✓ No leading `/` in path
- ✓ File extension matches actual file

### Duplicate SKU Error
- SKUs must be unique across all products
- SKUs must be unique across all variants
- Use format: `PRODUCT-ID-VARIANT`
- Example: `UFT-001-M` (product-variant)

## Tips & Best Practices

### SKU Naming Convention
```
[CATEGORY]-[PRODUCT]-[VARIANT]
BCS-001-OS      (Bag - Canvas Shoulder - One Size)
UFT-001-M       (Urban Fashion Tee - Medium)
HP-002-MD-BLK   (Halo Pouch - Medium - Black)
```

### Inventory Management
- Set realistic stock levels
- Update after receiving shipments
- Monitor **LOW STOCK** filter weekly
- Use **INACTIVE** for discontinued items

### Image Optimization
- Compress images before uploading
- Use consistent dimensions (800x800px recommended)
- Name files clearly: `product-name-view.jpg`
- Keep file sizes under 500KB

### Categories
- Use consistent category names
- Categories are filterable on shop
- Common categories:
  - `shoulder-bags`
  - `garments`
  - `halo-pouches`
  - `accessories`

### Sales & Promotions
- Use **Compare at Price** for sales
- Mark as **FEATURED** for visibility
- Update **Description** with promo details
- Remove **FEATURED** when promo ends

## Future Enhancements

Planned features:
- [ ] Image upload functionality
- [ ] Bulk product import (CSV)
- [ ] Product analytics dashboard
- [ ] Categories management page
- [ ] Inventory alerts/notifications
- [ ] Product review management
- [ ] Multi-currency support

## Support

For issues:
1. Check browser console for errors
2. Verify database permissions (RLS policies)
3. Confirm admin role is set correctly
4. Test with different browsers

## Quick Links

- **Admin Dashboard:** `system/system.html`
- **Products Management:** `system/products.html`
- **Shop Page:** `shop.html`
- **Database Schema:** `supabase-schema.sql`
- **Product Import Template:** `PRODUCT-IMPORT-TEMPLATE.md`
