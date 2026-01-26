# 🛠️ Cart & Wishlist - Quick Test Guide

## ✅ Fixes Applied

### Critical Issues Fixed:
1. **Product ID Mismatch** - Now uses actual database IDs instead of `product-1, product-2`
2. **Guest User Access** - Cart/wishlist now work for both guests and authenticated users
3. **Initialization Timing** - Fixed race condition between product loading and button attachment
4. **Product Data Fetch** - All users can now fetch full product details from database

## 🧪 How to Test

### Option 1: Test Page (Recommended)
1. Open `test-cart-wishlist.html` in your browser
2. Click each "Run Test" button in sequence:
   - Initialization Tests
   - Load Products
   - Test Cart
   - Test Wishlist
3. Check for green ✓ marks (pass) vs red ✗ marks (fail)

### Option 2: Shop Page (Real World Test)
1. Open `shop.html` in your browser
2. Open DevTools Console (F12 → Console tab)
3. Look for product cards to load
4. Hover over a product - you should see:
   - 🔖 (bookmark) button for wishlist
   - "ADD TO CART" button
5. Click buttons and verify:
   - Items appear in cart/wishlist
   - Badge counters update
   - No console errors

## 🔍 Debugging Steps

### If buttons don't appear:
```javascript
// Check in browser console:
console.log('Products loaded:', window.productsLoader?.products?.length);
console.log('Product cards:', document.querySelectorAll('.product-card').length);
console.log('Wishlist buttons:', document.querySelectorAll('.wishlist-btn').length);
console.log('Cart buttons:', document.querySelectorAll('.add-to-cart-btn').length);
```

### If products don't load:
```javascript
// Check Supabase connection:
console.log('Supabase client:', window.supabaseClient);

// Manually load products:
window.productsLoader.loadProducts().then(() => {
  console.log('Products:', window.productsLoader.products);
});

// Check for errors:
window.productsLoader.loadProducts().catch(err => {
  console.error('Load error:', err);
});
```

### If cart/wishlist don't save:
```javascript
// For guests - check localStorage:
console.log('Local cart:', localStorage.getItem('cart'));
console.log('Local wishlist:', localStorage.getItem('wishlist'));

// For authenticated users - check managers:
console.log('Cart manager cart:', window.cartManager?.cart);
console.log('Wishlist manager:', window.wishlistManager?.wishlist);

// Test adding manually:
window.cartManager.addItem({
  product_id: 'test-123',
  product_name: 'Test Product',
  price: 25.00,
  product_image: '',
  quantity: 1
});
```

## 📋 Expected Behavior

### Guest Users (Not Logged In)
- ✅ Can see products from database
- ✅ Can add to cart → saved in localStorage
- ✅ Can add to wishlist → saved in localStorage
- ✅ Cart/wishlist persist across page refreshes
- ✅ Upon login, items merge into user's database cart/wishlist

### Authenticated Users (Logged In)
- ✅ Can see products from database
- ✅ Can add to cart → saved to Supabase `cart_items` table
- ✅ Can add to wishlist → saved to Supabase `wishlist_items` table
- ✅ Cart/wishlist sync across devices
- ✅ Cart/wishlist load automatically on page load

## ⚠️ Common Issues & Solutions

### Issue: "Product not found" error
**Cause:** No products in database  
**Solution:** Import products using the admin panel or SQL import

### Issue: RLS policy error
**Cause:** Row Level Security blocking access  
**Solution:** Verify policies in Supabase:
```sql
-- In Supabase SQL Editor, check:
SELECT * FROM products WHERE is_active = true;
```

### Issue: Buttons appear but don't work
**Cause:** Event listeners not attached  
**Solution:** Check console for JavaScript errors

### Issue: Items disappear after page refresh (for guests)
**Cause:** localStorage cleared or browser privacy mode  
**Solution:** Check browser settings, disable privacy mode

### Issue: Items don't sync for logged-in users
**Cause:** Supabase auth not working or RLS policies blocking  
**Solution:** 
1. Check auth: `console.log(window.authManager.session)`
2. Check user ID: `console.log(window.authManager.getUserId())`
3. Verify Supabase project URL and anon key

## 🎯 Success Criteria

After fixes, you should see:
- ✅ Products load on shop.html
- ✅ Each product has wishlist (🔖) and "ADD TO CART" buttons
- ✅ Clicking wishlist button toggles bookmark (filled/unfilled)
- ✅ Clicking "ADD TO CART" shows "ADDING..." then "✓ ADDED"
- ✅ Cart badge (top right) shows item count
- ✅ Wishlist badge shows item count
- ✅ cart.html shows added items
- ✅ wishlist.html shows added items
- ✅ No errors in browser console

## 📞 Need Help?

If tests still fail:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Copy any red error messages
4. Check Network tab for failed requests
5. Report the specific error messages

## 🚀 Next Steps After Testing

Once everything works:
1. ✅ Test checkout flow
2. ✅ Test wishlist → cart conversion
3. ✅ Test inventory tracking
4. ✅ Test cart quantity updates
5. ✅ Test guest → user migration on login
