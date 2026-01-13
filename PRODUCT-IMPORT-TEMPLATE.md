# Product Import Template

Use this SQL template to bulk import your existing products into the database.

## Current Products to Import

Based on your [shop.html](shop.html), here are your existing products:

```sql
-- ============================================
-- BALLYLIKE PRODUCTS - BULK INSERT
-- ============================================

-- 1. BLACK CANVAS SHOULDER BAG
INSERT INTO public.products (
  sku, name, slug, description, category, subcategory,
  base_price, is_active, is_featured, main_image, track_inventory
) VALUES (
  'BCS-001',
  'BLACK CANVAS SHOULDER BAG',
  'black-canvas-shoulder-bag',
  'Durable utility design canvas shoulder bag. Perfect for everyday carry with modern street style.',
  'shoulder-bags',
  'crossbody',
  14.99,
  true,
  true,
  'assets/images/products/prod-bcs.jpg',
  true
);

-- Variant for BLACK CANVAS SHOULDER BAG
INSERT INTO public.product_variants (
  product_id, sku, size, price, inventory_quantity, is_active
) VALUES (
  (SELECT id FROM public.products WHERE sku = 'BCS-001'),
  'BCS-001-OS',
  'One Size',
  14.99,
  25,
  true
);

-- 2. URBAN FASHION TEE
INSERT INTO public.products (
  sku, name, slug, description, category, subcategory, tags,
  base_price, is_active, is_featured, main_image, track_inventory
) VALUES (
  'UFT-001',
  'URBAN FASHION TEE',
  'urban-fashion-tee',
  'Heavyweight cotton t-shirt with faith-driven streetwear design. Premium quality fabric.',
  'garments',
  't-shirts',
  ARRAY['new', 'streetwear', 'cotton'],
  14.99,
  true,
  true,
  'assets/images/products/prod-t.jpg',
  true
);

-- Variants for URBAN FASHION TEE
INSERT INTO public.product_variants (
  product_id, sku, size, price, inventory_quantity, is_active
) VALUES 
  ((SELECT id FROM public.products WHERE sku = 'UFT-001'), 'UFT-001-S', 'S', 14.99, 15, true),
  ((SELECT id FROM public.products WHERE sku = 'UFT-001'), 'UFT-001-M', 'M', 14.99, 20, true),
  ((SELECT id FROM public.products WHERE sku = 'UFT-001'), 'UFT-001-L', 'L', 14.99, 20, true),
  ((SELECT id FROM public.products WHERE sku = 'UFT-001'), 'UFT-001-XL', 'XL', 14.99, 10, true);

-- 3. PERFORMANCE CAP
INSERT INTO public.products (
  sku, name, slug, description, category, subcategory, tags,
  base_price, is_active, is_featured, main_image, track_inventory
) VALUES (
  'PC-001',
  'PERFORMANCE CAP',
  'performance-cap',
  'Organic cotton baseball cap with logo embroidery. Classic streetwear essential.',
  'garments',
  'accessories',
  ARRAY['new', 'organic', 'cap'],
  11.99,
  true,
  false,
  'assets/images/products/prod-c.jpg',
  true
);

-- Variants for PERFORMANCE CAP
INSERT INTO public.product_variants (
  product_id, sku, size, price, inventory_quantity, is_active
) VALUES (
  (SELECT id FROM public.products WHERE sku = 'PC-001'),
  'PC-001-OS',
  'One Size',
  11.99,
  30,
  true
);

-- 4. HALO POUCH (Small)
INSERT INTO public.products (
  sku, name, slug, description, category, subcategory,
  base_price, is_active, is_featured, main_image, track_inventory
) VALUES (
  'HP-001-SM',
  'HALO POUCH',
  'halo-pouch-small',
  'Compact essentials pouch. Perfect for organizing your daily carry items.',
  'halo-pouches',
  'pouches',
  9.99,
  true,
  false,
  'assets/images/products/prod-hp.jpg',
  true
);

-- Variant for HALO POUCH (Small)
INSERT INTO public.product_variants (
  product_id, sku, size, price, inventory_quantity, is_active
) VALUES (
  (SELECT id FROM public.products WHERE sku = 'HP-001-SM'),
  'HP-001-SM-OS',
  'Small',
  9.99,
  40,
  true
);

-- 5. CANVAS UTILITY SHOULDER BAG
INSERT INTO public.products (
  sku, name, slug, description, category, subcategory,
  base_price, is_active, is_featured, main_image, track_inventory
) VALUES (
  'CUSB-001',
  'CANVAS UTILITY SHOULDER BAG',
  'canvas-utility-shoulder-bag',
  'Premium canvas shoulder bag with multiple compartments. Urban utility meets style.',
  'shoulder-bags',
  'crossbody',
  16.99,
  true,
  false,
  'assets/images/products/prod-usb.jpg',
  true
);

-- Variant for CANVAS UTILITY SHOULDER BAG
INSERT INTO public.product_variants (
  product_id, sku, size, price, inventory_quantity, is_active
) VALUES (
  (SELECT id FROM public.products WHERE sku = 'CUSB-001'),
  'CUSB-001-OS',
  'One Size',
  16.99,
  18,
  true
);

-- 6. HALO POUCH (Medium)
INSERT INTO public.products (
  sku, name, slug, description, category, subcategory,
  base_price, is_active, is_featured, main_image, track_inventory
) VALUES (
  'HP-002-MD',
  'HALO POUCH',
  'halo-pouch-medium',
  'Medium-sized pouch for tech accessories and daily essentials.',
  'halo-pouches',
  'pouches',
  11.99,
  true,
  false,
  'assets/images/products/prod-hp2.jpg',
  true
);

-- Variant for HALO POUCH (Medium)
INSERT INTO public.product_variants (
  product_id, sku, size, price, inventory_quantity, is_active
) VALUES (
  (SELECT id FROM public.products WHERE sku = 'HP-002-MD'),
  'HP-002-MD-OS',
  'Medium',
  11.99,
  35,
  true
);

-- 7. HALO POUCH (Large)
INSERT INTO public.products (
  sku, name, slug, description, category, subcategory,
  base_price, is_active, is_featured, main_image, track_inventory
) VALUES (
  'HP-003-LG',
  'HALO POUCH',
  'halo-pouch-large',
  'Large capacity pouch for tablets and larger items. Maximum organization.',
  'halo-pouches',
  'pouches',
  13.99,
  true,
  false,
  'assets/images/products/prod-hp3.jpg',
  true
);

-- Variant for HALO POUCH (Large)
INSERT INTO public.product_variants (
  product_id, sku, size, price, inventory_quantity, is_active
) VALUES (
  (SELECT id FROM public.products WHERE sku = 'HP-003-LG'),
  'HP-003-LG-OS',
  'Large',
  13.99,
  28,
  true
);

-- ============================================
-- PRODUCT CATEGORIES
-- ============================================

INSERT INTO public.product_categories (name, slug, description, display_order, is_active)
VALUES 
  ('All Products', 'all', 'Complete collection', 0, true),
  ('Shoulder Bags', 'shoulder-bags', 'Crossbody and shoulder bags', 1, true),
  ('Garments', 'garments', 'T-shirts, caps, and apparel', 2, true),
  ('Halo Pouches', 'halo-pouches', 'Organizational pouches in all sizes', 3, true);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check inserted products
SELECT name, sku, base_price, category, is_active FROM public.products ORDER BY name;

-- Check variants with inventory
SELECT 
  p.name, 
  pv.size, 
  pv.price, 
  pv.inventory_quantity 
FROM public.product_variants pv
JOIN public.products p ON p.id = pv.product_id
ORDER BY p.name, pv.size;

-- Check total inventory by product
SELECT 
  p.name,
  COUNT(pv.id) as variant_count,
  SUM(pv.inventory_quantity) as total_inventory
FROM public.products p
LEFT JOIN public.product_variants pv ON p.id = pv.product_id
GROUP BY p.id, p.name
ORDER BY p.name;
```

## How to Use

1. Copy the entire SQL above
2. Open Supabase SQL Editor
3. Paste and execute
4. Check verification queries at the bottom
5. Refresh your shop page to see products load dynamically

## Customization

### Add More Details
```sql
-- Update a product with more details
UPDATE public.products
SET 
  description = 'Extended description here...',
  meta_title = 'SEO-optimized title',
  meta_description = 'SEO description',
  tags = ARRAY['tag1', 'tag2', 'tag3']
WHERE sku = 'BCS-001';
```

### Add Additional Images
```sql
-- Add gallery images
UPDATE public.products
SET additional_images = ARRAY[
  'assets/images/products/prod-bcs-2.jpg',
  'assets/images/products/prod-bcs-3.jpg',
  'assets/images/products/prod-bcs-4.jpg'
]
WHERE sku = 'BCS-001';
```

### Update Inventory
```sql
-- Increase stock
UPDATE public.product_variants
SET inventory_quantity = inventory_quantity + 10
WHERE sku = 'UFT-001-M';

-- Set specific stock level
UPDATE public.product_variants
SET inventory_quantity = 50
WHERE sku = 'PC-001-OS';
```

### Add Sale Pricing
```sql
-- Put product on sale
UPDATE public.products
SET compare_at_price = base_price, base_price = 9.99
WHERE sku = 'HP-001-SM';
```

## Next Steps

After importing products:
1. Verify images exist in filesystem
2. Test adding to cart
3. Test adding to wishlist
4. Configure filters on shop page
5. Build admin interface for future product management
