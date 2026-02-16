  -- DATABASE FIX SCRIPT
  -- This script fixes missing tables and columns in the Supabase database
  -- Run this in your Supabase SQL Editor

  -- Enable UUID extension (if not already enabled)
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

  -- ============================================
  -- 1. CREATE PRODUCTS TABLE (if missing)
  -- ============================================
  CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sku TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    subcategory TEXT,
    tags TEXT[],
    base_price DECIMAL(10, 2) NOT NULL,
    compare_at_price DECIMAL(10, 2),
    cost_per_item DECIMAL(10, 2),
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    featured_order INTEGER,
    track_inventory BOOLEAN DEFAULT true,
    continue_selling_when_out_of_stock BOOLEAN DEFAULT false,
    main_image TEXT,
    additional_images TEXT[],
    weight DECIMAL(10, 2),
    weight_unit TEXT DEFAULT 'kg',
    meta_title TEXT,
    meta_description TEXT,
    meta_keywords TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
  );

  -- Enable RLS
  ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
  DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
  DROP POLICY IF EXISTS "Admins can update products" ON public.products;
  DROP POLICY IF EXISTS "Admins can delete products" ON public.products;

  -- Create policies
  CREATE POLICY "Anyone can view active products"
    ON public.products FOR SELECT
    USING (is_active = true OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    ));

  CREATE POLICY "Admins can insert products"
    ON public.products FOR INSERT
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
      )
    );

  CREATE POLICY "Admins can update products"
    ON public.products FOR UPDATE
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
      )
    );

  CREATE POLICY "Admins can delete products"
    ON public.products FOR DELETE
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
      )
    );

  -- ============================================
  -- 2. CREATE PRODUCT VARIANTS TABLE (if missing)
  -- ============================================
  CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    size TEXT,
    color TEXT,
    price DECIMAL(10, 2),
    compare_at_price DECIMAL(10, 2),
    inventory_quantity INTEGER DEFAULT 0,
    inventory_policy TEXT DEFAULT 'deny',
    barcode TEXT,
    image TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(product_id, size, color)
  );

  -- Enable RLS
  ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Anyone can view active product variants" ON public.product_variants;
  DROP POLICY IF EXISTS "Admins can manage product variants" ON public.product_variants;

  -- Create policies
  CREATE POLICY "Anyone can view active product variants"
    ON public.product_variants FOR SELECT
    USING (is_active = true OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    ));

  CREATE POLICY "Admins can manage product variants"
    ON public.product_variants FOR ALL
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
      )
    );

  -- ============================================
  -- 3. FIX CART_ITEMS TABLE
  -- ============================================
  -- Add variant_id column if it doesn't exist
  DO $$ 
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'cart_items' 
      AND column_name = 'variant_id'
    ) THEN
      ALTER TABLE public.cart_items 
      ADD COLUMN variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE;
    END IF;
  END $$;

  -- Add product_id column if it doesn't exist
  DO $$ 
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'cart_items' 
      AND column_name = 'product_id'
    ) THEN
      ALTER TABLE public.cart_items 
      ADD COLUMN product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL;
    END IF;
  END $$;

  -- Drop and recreate the unique constraint to include variant_id
  ALTER TABLE public.cart_items DROP CONSTRAINT IF EXISTS cart_items_user_id_product_id_variant_id_key;
  ALTER TABLE public.cart_items DROP CONSTRAINT IF EXISTS cart_items_user_id_product_id_key;

  -- Add the correct unique constraint
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint 
      WHERE conname = 'cart_items_user_id_product_id_variant_id_key'
    ) THEN
      ALTER TABLE public.cart_items 
      ADD CONSTRAINT cart_items_user_id_product_id_variant_id_key 
      UNIQUE(user_id, product_id, variant_id);
    END IF;
  END $$;

  -- ============================================
  -- 4. FIX WISHLIST_ITEMS TABLE
  -- ============================================
  -- Recreate wishlist_items table with correct structure
  DROP TABLE IF EXISTS public.wishlist_items CASCADE;

  CREATE TABLE public.wishlist_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id)
  );

  -- Enable RLS
  ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can view their own wishlist items" ON public.wishlist_items;
  DROP POLICY IF EXISTS "Users can insert their own wishlist items" ON public.wishlist_items;
  DROP POLICY IF EXISTS "Users can delete their own wishlist items" ON public.wishlist_items;

  -- Create policies
  CREATE POLICY "Users can view their own wishlist items"
    ON public.wishlist_items FOR SELECT
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can insert their own wishlist items"
    ON public.wishlist_items FOR INSERT
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can delete their own wishlist items"
    ON public.wishlist_items FOR DELETE
    USING (auth.uid() = user_id);

  -- ============================================
  -- 5. CREATE INDEXES
  -- ============================================
  CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items(user_id);
  CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON public.cart_items(product_id);
  CREATE INDEX IF NOT EXISTS idx_cart_items_variant_id ON public.cart_items(variant_id);
  CREATE INDEX IF NOT EXISTS idx_wishlist_items_user_id ON public.wishlist_items(user_id);
  CREATE INDEX IF NOT EXISTS idx_wishlist_items_product_id ON public.wishlist_items(product_id);
  CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
  CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
  CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
  CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured);
  CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants(product_id);
  CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON public.product_variants(sku);

  -- ============================================
  -- 6. UPDATE TRIGGERS (if they don't exist)
  -- ============================================
  -- Function to automatically update updated_at timestamp
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  -- Triggers for updated_at
  DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
  CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

  DROP TRIGGER IF EXISTS update_product_variants_updated_at ON public.product_variants;
  CREATE TRIGGER update_product_variants_updated_at
    BEFORE UPDATE ON public.product_variants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

  DROP TRIGGER IF EXISTS update_cart_items_updated_at ON public.cart_items;
  CREATE TRIGGER update_cart_items_updated_at
    BEFORE UPDATE ON public.cart_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

  -- ============================================
  -- 7. GRANT PERMISSIONS
  -- ============================================
  GRANT USAGE ON SCHEMA public TO anon, authenticated;
  GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
  GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

  -- ============================================
  -- 8. INSERT PRODUCTS AND VARIANTS
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
  )
  ON CONFLICT (sku) DO NOTHING;

  INSERT INTO public.product_variants (
    product_id, sku, size, price, inventory_quantity, is_active
  ) VALUES (
    (SELECT id FROM public.products WHERE sku = 'BCS-001'),
    'BCS-001-OS',
    'One Size',
    14.99,
    25,
    true
  )
  ON CONFLICT (sku) DO NOTHING;

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
  )
  ON CONFLICT (sku) DO NOTHING;

  INSERT INTO public.product_variants (
    product_id, sku, size, price, inventory_quantity, is_active
  ) VALUES 
    ((SELECT id FROM public.products WHERE sku = 'UFT-001'), 'UFT-001-S', 'S', 14.99, 15, true),
    ((SELECT id FROM public.products WHERE sku = 'UFT-001'), 'UFT-001-M', 'M', 14.99, 20, true),
    ((SELECT id FROM public.products WHERE sku = 'UFT-001'), 'UFT-001-L', 'L', 14.99, 20, true),
    ((SELECT id FROM public.products WHERE sku = 'UFT-001'), 'UFT-001-XL', 'XL', 14.99, 10, true)
  ON CONFLICT (sku) DO NOTHING;

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
  )
  ON CONFLICT (sku) DO NOTHING;

  INSERT INTO public.product_variants (
    product_id, sku, size, price, inventory_quantity, is_active
  ) VALUES (
    (SELECT id FROM public.products WHERE sku = 'PC-001'),
    'PC-001-OS',
    'One Size',
    11.99,
    30,
    true
  )
  ON CONFLICT (sku) DO NOTHING;

  -- 4. HALO POUCH
  INSERT INTO public.products (
    sku, name, slug, description, category, subcategory,
    base_price, is_active, is_featured, main_image, track_inventory
  ) VALUES (
    'HP-001-SM',
    'HALO POUCH',
    'halo-pouch',
    'Compact essentials pouch. Perfect for organizing your daily carry items.',
    'halo-pouches',
    'pouches',
    7.99,
    true,
    false,
    'assets/images/products/prod-hp.jpg',
    true
  )
  ON CONFLICT (sku) DO NOTHING;

  INSERT INTO public.product_variants (
    product_id, sku, size, price, inventory_quantity, is_active
  ) VALUES (
    (SELECT id FROM public.products WHERE sku = 'HP-001-SM'),
    'HP-001-SM-OS',
    'One Size',
    7.99,
    40,
    true
  )
  ON CONFLICT (sku) DO NOTHING;

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
    14.99,
    true,
    false,
    'assets/images/products/prod-usb.jpg',
    true
  )
  ON CONFLICT (sku) DO NOTHING;

  INSERT INTO public.product_variants (
    product_id, sku, size, price, inventory_quantity, is_active
  ) VALUES (
    (SELECT id FROM public.products WHERE sku = 'CUSB-001'),
    'CUSB-001-OS',
    'One Size',
    14.99,
    18,
    true
  )
  ON CONFLICT (sku) DO NOTHING;

  -- 6. CARGO40 TOTE BAG ORGANIZER
  INSERT INTO public.products (
    sku, name, slug, description, category, subcategory, tags,
    base_price, is_active, is_featured, main_image, additional_images, track_inventory
  ) VALUES (
    'CBTG-001',
    'CARGO40 TOTE BAG ORGANIZER',
    'cargo40-tote-bag-organizer',
    'Premium 40L Multi-Compartment Tote Bag Organizer - The ultimate storage solution for travel, gym, work, and daily organization. Features 8+ compartments including dedicated laptop sleeve, water bottle pockets, and quick-access phone pocket. Constructed from military-grade 600D water-resistant polyester with YKK zippers and reinforced stitching for long-lasting durability. Lightweight yet spacious design with padded shoulder straps for comfort. Perfect for travelers, gym enthusiasts, professionals, and anyone who values organization. Available in Medium (38×28×18cm) and Large (42×32×20cm). Shop BALLYLIKE Zimbabwe for premium organizational solutions.',
    'shoulder-bags',
    'tote-organizer',
    ARRAY['new', 'organizer', 'cargo', 'tote', 'travel bag', 'gym bag', 'work bag', 'laptop bag', 'multi-compartment', 'water-resistant', 'zimbabwe', 'storage solution', 'organization', 'durable', 'lightweight', 'travel organizer', 'daily commute', 'ballylike'],
    20.00,
    true,
    true,
    'assets/images/products/prod-bctg-1.jpg',
    ARRAY['assets/images/products/prod-bctg-2.jpg', 'assets/images/products/prod-bctg-4-01.jpg', 'assets/images/products/prod-bctg-5.jpg'],
    true
  )
  ON CONFLICT (sku) DO NOTHING;

  INSERT INTO public.product_variants (
    product_id, sku, size, price, inventory_quantity, is_active
  ) VALUES 
    ((SELECT id FROM public.products WHERE sku = 'CBTG-001'), 'CBTG-001-M', 'Medium', 20.00, 30, true),
    ((SELECT id FROM public.products WHERE sku = 'CBTG-001'), 'CBTG-001-L', 'Large', 25.00, 25, true)
  ON CONFLICT (sku) DO NOTHING;

  -- ============================================
  -- 9. INSERT PRODUCT CATEGORIES
  -- ============================================

  INSERT INTO public.product_categories (name, slug, description, display_order, is_active)
  VALUES 
    ('All Products', 'all', 'Complete collection', 0, true),
    ('Shoulder Bags', 'shoulder-bags', 'Crossbody and shoulder bags', 1, true),
    ('Garments', 'garments', 'T-shirts, caps, and apparel', 2, true),
    ('Halo Pouches', 'halo-pouches', 'Organizational pouches in all sizes', 3, true)
  ON CONFLICT (slug) DO NOTHING;

  -- ============================================
  -- 10. VERIFICATION QUERIES
  -- ============================================
  -- Run these to verify everything worked:

  -- Check products inserted
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

  -- Check if products table exists:
  SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'products');

  -- Check cart_items columns:
  SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'cart_items' ORDER BY ordinal_position;

  -- Check wishlist_items columns:
  SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'wishlist_items' ORDER BY ordinal_position;

  -- Check foreign key relationships:
  SELECT conname, conrelid::regclass, confrelid::regclass FROM pg_constraint WHERE contype = 'f' AND conrelid::regclass::text IN ('cart_items', 'wishlist_items');
