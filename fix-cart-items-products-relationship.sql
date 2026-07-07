-- Fix: PostgREST returns 400 PGRST200 on
--   GET /rest/v1/cart_items?select=*,product:products(*),variant:product_variants(*)
-- because it cannot find a foreign key relationship between cart_items.product_id
-- and products.id in its schema cache (confirmed live via anon-key query on 2026-07-07).
--
-- This is idempotent - safe to run more than once. Run in the Supabase SQL Editor
-- (Dashboard -> SQL Editor), connected as an admin/service role.

-- 1. Ensure the FK constraint actually exists on the live table.
--    (If it was already there, this is a no-op; if it was missing - e.g. an earlier
--    migration only added the column without the constraint - this creates it.)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.cart_items'::regclass
      AND confrelid = 'public.products'::regclass
      AND contype = 'f'
  ) THEN
    ALTER TABLE public.cart_items
      ADD CONSTRAINT cart_items_product_id_fkey
      FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 2. Force PostgREST to reload its schema cache. Needed even if step 1 was a no-op,
--    since a stale cache (rather than a missing constraint) can cause the same error.
NOTIFY pgrst, 'reload schema';

-- 3. Verification query - run this after the above and confirm it returns a row
--    for cart_items -> products (confrelid) in addition to the existing
--    cart_items -> product_variants and cart_items -> auth.users relationships.
-- SELECT conname, conrelid::regclass AS "table", confrelid::regclass AS "references"
-- FROM pg_constraint
-- WHERE contype = 'f' AND conrelid = 'public.cart_items'::regclass;
