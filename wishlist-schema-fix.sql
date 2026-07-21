-- ============================================
-- WISHLIST_ITEMS SCHEMA FIX (idempotent)
-- ============================================
-- The repo has two conflicting definitions of wishlist_items:
--   - supabase-schema.sql: product_id nullable, no uniqueness constraint
--   - database-fix.sql:    product_id NOT NULL, UNIQUE(user_id, product_id)
--                           (applied via DROP TABLE + CREATE TABLE, which
--                           would silently wipe any live wishlist data)
--
-- This script brings a live wishlist_items table to the stricter, correct
-- state WITHOUT dropping the table or losing data, and is safe to run more
-- than once no matter which of the two versions above is currently live.
-- Run it in the Supabase SQL editor.

DO $$
BEGIN
  -- Only proceed if the table actually exists.
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'wishlist_items'
  ) THEN

    -- 1. Remove rows with no product reference - they're not usable and
    --    would block the upcoming NOT NULL constraint.
    DELETE FROM public.wishlist_items WHERE product_id IS NULL;

    -- 2. Dedupe: keep the oldest row per (user_id, product_id), drop the rest,
    --    so the upcoming UNIQUE constraint can be added.
    DELETE FROM public.wishlist_items w
    USING public.wishlist_items dup
    WHERE w.user_id = dup.user_id
      AND w.product_id = dup.product_id
      AND w.created_at > dup.created_at
      AND w.id <> dup.id;

    -- Tie-break any rows left with identical created_at by id, so the
    -- dedupe above is deterministic even when timestamps collide.
    DELETE FROM public.wishlist_items w
    USING public.wishlist_items dup
    WHERE w.user_id = dup.user_id
      AND w.product_id = dup.product_id
      AND w.created_at = dup.created_at
      AND w.id > dup.id;

    -- 3. Enforce product_id NOT NULL (no-op if already set).
    ALTER TABLE public.wishlist_items ALTER COLUMN product_id SET NOT NULL;

    -- 4. Add the uniqueness constraint if it isn't already present under
    --    this name (guards against re-running this script).
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint WHERE conname = 'wishlist_items_user_id_product_id_key'
    ) THEN
      ALTER TABLE public.wishlist_items
      ADD CONSTRAINT wishlist_items_user_id_product_id_key
      UNIQUE (user_id, product_id);
    END IF;

  END IF;
END $$;

-- 5. Indexes (idempotent).
CREATE INDEX IF NOT EXISTS idx_wishlist_items_user_id ON public.wishlist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_product_id ON public.wishlist_items(product_id);

-- 6. RLS + policies (idempotent - matches supabase-schema.sql).
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own wishlist items" ON public.wishlist_items;
CREATE POLICY "Users can view their own wishlist items"
  ON public.wishlist_items FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own wishlist items" ON public.wishlist_items;
CREATE POLICY "Users can insert their own wishlist items"
  ON public.wishlist_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own wishlist items" ON public.wishlist_items;
CREATE POLICY "Users can delete their own wishlist items"
  ON public.wishlist_items FOR DELETE
  USING (auth.uid() = user_id);
