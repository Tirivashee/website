-- BALLYLIKE - Critical Security & Data-Integrity Fixes
-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query).
-- Safe to re-run: every statement uses CREATE OR REPLACE / DROP IF EXISTS first.
--
-- Fixes three issues found in the project audit:
--   1. Any authenticated user could set their own profiles.role to 'admin'
--      (the existing "Users can update their own profile" UPDATE policy has
--      no column restriction), which bypasses every admin-only RLS policy
--      in the app (products, orders, categories, variants).
--   2. The `orders` table has SELECT/INSERT/UPDATE RLS policies but no
--      DELETE policy, so the admin "Delete Order" button in
--      system/system.html silently deletes 0 rows.
--   3. Order price/quantity data sent from the browser (cart contents) was
--      trusted as-is and written straight into orders.subtotal/total and
--      orders.order_items - a tampered `price` in devtools would persist
--      into the order record with no server-side check.

-- ============================================================
-- 1. Prevent self-escalation of profiles.role
-- ============================================================
-- Any UPDATE to profiles.role that doesn't come from the Supabase
-- service_role (i.e. every call made from the browser with the anon/
-- authenticated key) is silently reverted to the existing value.
-- Use the Supabase dashboard or a service-role script to actually grant
-- admin: UPDATE public.profiles SET role = 'admin' WHERE email = '...';

CREATE OR REPLACE FUNCTION public.prevent_role_self_escalation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role AND auth.role() <> 'service_role' THEN
    NEW.role := OLD.role;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS prevent_role_self_escalation_trigger ON public.profiles;
CREATE TRIGGER prevent_role_self_escalation_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_self_escalation();

-- ============================================================
-- 2. Admin DELETE policy on orders
-- ============================================================
DROP POLICY IF EXISTS "Admins can delete orders" ON public.orders;
CREATE POLICY "Admins can delete orders"
  ON public.orders FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================================
-- 3. Recompute order pricing server-side on insert
-- ============================================================
-- Rebuilds orders.order_items from the authoritative products/
-- product_variants prices (matching each line item's product_id + size +
-- color to a variant, falling back to the product's base_price), and
-- recomputes subtotal/total from those authoritative prices. The client
-- can still send whatever price it wants - it's simply ignored.

CREATE OR REPLACE FUNCTION public.recompute_order_pricing()
RETURNS TRIGGER AS $$
DECLARE
  item JSONB;
  rebuilt JSONB := '[]'::jsonb;
  matched_price DECIMAL(10, 2);
  item_qty INTEGER;
  running_subtotal DECIMAL(10, 2) := 0;
BEGIN
  FOR item IN SELECT * FROM jsonb_array_elements(NEW.order_items)
  LOOP
    matched_price := NULL;

    -- Try to match a specific variant by product_id + size + color
    SELECT pv.price INTO matched_price
    FROM public.product_variants pv
    WHERE pv.product_id = (item->>'product_id')::uuid
      AND COALESCE(pv.size, '') = COALESCE(item->>'size', '')
      AND COALESCE(pv.color, '') = COALESCE(item->>'color', '')
    LIMIT 1;

    -- Fall back to the product's base price (or its cheapest variant)
    IF matched_price IS NULL THEN
      SELECT p.base_price INTO matched_price
      FROM public.products p
      WHERE p.id = (item->>'product_id')::uuid;
    END IF;

    IF matched_price IS NULL THEN
      RAISE EXCEPTION 'Order references unknown product_id %', item->>'product_id';
    END IF;

    item_qty := GREATEST(1, COALESCE((item->>'quantity')::int, 1));
    running_subtotal := running_subtotal + (matched_price * item_qty);

    rebuilt := rebuilt || jsonb_build_object(
      'product_id', item->>'product_id',
      'product_name', item->>'product_name',
      'product_image', item->>'product_image',
      'price', matched_price,
      'quantity', item_qty,
      'size', item->>'size',
      'color', item->>'color'
    );
  END LOOP;

  NEW.order_items := rebuilt;
  NEW.subtotal := running_subtotal;
  NEW.total := running_subtotal + COALESCE(NEW.shipping, 0);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS recompute_order_pricing_trigger ON public.orders;
CREATE TRIGGER recompute_order_pricing_trigger
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.recompute_order_pricing();

-- ============================================================
-- 4. (Optional, not applied automatically) Drop the unused normalized
--    order_items table now that js/orders.js no longer writes to it -
--    orders.order_items (JSONB) is the single source of truth the app
--    reads from. Uncomment and run separately once you've confirmed
--    nothing else depends on the table:
-- ============================================================
-- DROP TABLE IF EXISTS public.order_items CASCADE;

-- ============================================================
-- VERIFICATION
-- ============================================================
-- Confirm your own admin account actually has role = 'admin' (the app's
-- client-side isAdmin() check is just a UI convenience - this is the row
-- that RLS actually checks):
-- SELECT id, email, role FROM public.profiles WHERE email = 'admin@ballylike.co.zw';
