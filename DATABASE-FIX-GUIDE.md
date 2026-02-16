# Database Fix Guide

## Problem Summary

Your Supabase database is missing critical tables and columns that the application requires:

### Issues Found:
1. ❌ **Missing `products` table** - causing foreign key relationship errors
2. ❌ **Missing `product_variants` table** - needed for product variations (size, color)
3. ❌ **`cart_items` table missing `variant_id` column** - causing "column does not exist" errors
4. ❌ **`wishlist_items` table structure mismatch** - missing proper foreign key to products

### Error Messages Explained:
- `column cart_items.variant_id does not exist` - The variant_id column wasn't created
- `Could not find a relationship between 'cart_items' and 'products'` - Products table missing
- `Could not find a relationship between 'wishlist_items' and 'products'` - Foreign key missing

---

## Fix Instructions

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project (`nmjocsaawzfcdfjecrrz`)
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Run the Fix Script
1. Open the file: `database-fix.sql` (created in your project root)
2. Copy the **entire contents** of that file
3. Paste it into the Supabase SQL Editor
4. Click **Run** button (or press Ctrl+Enter)

### Step 3: Verify the Fix
After running the script, verify it worked by running these queries one by one:

```sql
-- 1. Check if products table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' AND table_name = 'products'
);
-- Expected result: true

-- 2. Check cart_items has variant_id column
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'cart_items' 
ORDER BY ordinal_position;
-- Should see: variant_id | uuid

-- 3. Check wishlist_items structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'wishlist_items' 
ORDER BY ordinal_position;
-- Should see: id, user_id, product_id, created_at

-- 4. Check foreign keys exist
SELECT conname, conrelid::regclass AS table, confrelid::regclass AS references
FROM pg_constraint 
WHERE contype = 'f' 
AND conrelid::regclass::text IN ('cart_items', 'wishlist_items');
-- Should show foreign keys to products and product_variants
```

### Step 4: Add Sample Products
After fixing the database structure, you need to add products. Run this in SQL Editor:

```sql
-- Add a sample product
INSERT INTO public.products (
  sku, name, slug, category, description, base_price, is_active, main_image
) VALUES (
  'TEST-001',
  'Sample T-Shirt',
  'sample-t-shirt',
  'clothing',
  'A comfortable cotton t-shirt',
  25.00,
  true,
  'https://via.placeholder.com/400'
);

-- Add variants for the product
INSERT INTO public.product_variants (
  product_id, sku, size, color, price, inventory_quantity, is_active
)
SELECT 
  id,
  'TEST-001-' || size || '-' || color AS sku,
  size,
  color,
  25.00 AS price,
  100 AS inventory_quantity,
  true AS is_active
FROM public.products
CROSS JOIN (VALUES ('S'), ('M'), ('L'), ('XL')) AS sizes(size)
CROSS JOIN (VALUES ('Black'), ('White'), ('Blue')) AS colors(color)
WHERE sku = 'TEST-001';
```

### Step 5: Test the Application
1. Refresh your browser
2. Clear browser console (F12 > Console > Clear)
3. Try adding items to cart
4. Try adding items to wishlist
5. Check for errors in console

---

## What the Fix Does

### Creates Missing Tables:
- ✅ **products** - Main product catalog
- ✅ **product_variants** - Size/color variations of products

### Fixes Cart Items:
- ✅ Adds `variant_id` column to link to product variants
- ✅ Adds `product_id` foreign key to products table
- ✅ Creates unique constraint on (user_id, product_id, variant_id)

### Fixes Wishlist Items:
- ✅ Recreates table with proper structure
- ✅ Adds `product_id` foreign key to products table
- ✅ Removes `product_name` column (will be fetched from products table)

### Sets Up Indexes:
- ✅ Creates indexes on foreign keys for better performance
- ✅ Creates indexes on commonly queried columns

### Configures Security:
- ✅ Enables Row Level Security (RLS) on all tables
- ✅ Creates policies for user access control
- ✅ Allows admins to manage products

---

## Troubleshooting

### If you get "permission denied" errors:
Run this to ensure proper permissions:
```sql
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
```

### If cart/wishlist still don't work:
1. Check browser console for new errors
2. Clear localStorage: `localStorage.clear()`
3. Log out and log back in
4. Verify products exist: `SELECT * FROM products LIMIT 5;`

### If you need to start fresh:
```sql
-- ⚠️ WARNING: This deletes all data!
TRUNCATE TABLE cart_items CASCADE;
TRUNCATE TABLE wishlist_items CASCADE;
TRUNCATE TABLE products CASCADE;
```

---

## Next Steps

After the database is fixed:

1. **Import your actual products** - Use the admin panel or SQL import
2. **Test cart functionality** - Add/remove items, change quantities
3. **Test wishlist functionality** - Add/remove favorites
4. **Check checkout flow** - Ensure order creation works

---

## Need More Help?

If you encounter errors after running the fix:
1. Copy the exact error message from browser console
2. Run the verification queries above
3. Check if products table has data: `SELECT COUNT(*) FROM products;`

The most common issue after this fix is **no products in the database**. Make sure to add products before testing cart/wishlist functionality!
