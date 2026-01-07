# 🚀 QUICK START GUIDE

## Get Your E-Commerce Site Running in 30 Minutes!

### ⚡ Step 1: Supabase Setup (15 min)

1. **Create Account & Project**
   ```
   → Go to https://supabase.com
   → Sign up (free)
   → Click "New Project"
   → Name: BALLYLIKE
   → Choose region: South Africa
   → Create strong password
   → Wait ~2 minutes for setup
   ```

2. **Create Database**
   ```
   → Go to "SQL Editor" (left menu)
   → Click "New Query"
   → Open file: supabase-schema.sql
   → Copy ALL content
   → Paste in editor
   → Click "Run" (or Ctrl+Enter)
   → Should see "Success. No rows returned"
   ```

3. **Get Your Keys**
   ```
   → Go to "Settings" → "API"
   → Copy "Project URL" (looks like: https://xxxxx.supabase.co)
   → Copy "anon public" key (long string starting with eyJ...)
   ```

4. **Update Config File**
   ```
   → Open: js/supabase-config.js
   → Replace 'YOUR_SUPABASE_URL' with your Project URL
   → Replace 'YOUR_SUPABASE_ANON_KEY' with your anon key
   → Save file
   ```

### 📤 Step 2: Deploy to Netlify (10 min)

1. **Push to GitHub** (if not already)
   ```bash
   git add .
   git commit -m "Add Supabase backend integration"
   git push origin main
   ```

2. **Deploy on Netlify**
   ```
   → Go to https://netlify.com
   → Login/Sign up
   → Click "Add new site"
   → Choose "Import from Git"
   → Select GitHub
   → Choose your repository
   → Click "Deploy site"
   → Wait ~2 minutes
   ```

3. **Set Custom Domain** (optional)
   ```
   → In Netlify dashboard
   → Go to "Domain settings"
   → Click "Add custom domain"
   → Enter: ballylike.co.zw
   → Follow DNS instructions
   ```

### ✅ Step 3: Test (5 min)

1. **Test Signup**
   ```
   → Visit: ballylike.co.zw/users/signup.html
   → Create account with your email
   → Check email for verification (if enabled)
   ```

2. **Test Login**
   ```
   → Visit: ballylike.co.zw/users/login.html
   → Log in with your credentials
   → Should see cart/wishlist in navigation
   ```

3. **Test Shopping**
   ```
   → Visit: ballylike.co.zw/shop.html
   → Click "ADD TO CART" on a product
   → Click cart icon in navigation
   → Should see item in cart
   ```

4. **Test Order**
   ```
   → With items in cart, click "CHECKOUT"
   → Fill in delivery details
   → Click "SUBMIT ORDER"
   → Check Supabase dashboard → orders table
   → Your order should appear!
   ```

5. **View Orders (Admin)**
   ```
   → Visit: ballylike.co.zw/system/system.html
   → Click "Refresh"
   → Should see your test order
   → Click "View" to see details
   ```

## 🎉 Done!

Your site is now live with:
- ✅ User authentication
- ✅ Shopping cart
- ✅ Wishlist
- ✅ Order management
- ✅ Admin dashboard

## 🔧 If Something Goes Wrong

### "Failed to fetch" or Connection Error
```
1. Check browser console (F12)
2. Verify supabase-config.js has correct URL and key
3. Check Supabase dashboard is showing "Healthy"
```

### Can't Log In
```
1. Check if you verified email (check spam folder)
2. Try password reset
3. Check Supabase → Authentication → Users
4. Check browser console for errors
```

### Cart Not Saving
```
1. Make sure you're logged in
2. Check browser console for errors
3. Go to Supabase → Table Editor → cart_items
4. Verify RLS policies are enabled
```

### Orders Not Showing in Dashboard
```
1. Check Supabase → orders table directly
2. Verify order was submitted (check browser console)
3. Click "Refresh" in dashboard
4. Check for JavaScript errors
```

## 📊 Where to Find Your Data

**Supabase Dashboard → Table Editor:**
- `auth.users` - All registered users
- `profiles` - User profiles
- `cart_items` - Shopping carts
- `wishlist_items` - User wishlists
- `orders` - All submitted orders
- `order_items` - Individual order items
- `post_comments` - Gallery comments
- `post_likes` - Gallery likes

## 🔐 Important Security Notes

✅ **Safe to Share:**
- Project URL (https://xxxxx.supabase.co)
- Anon/Public key (the long eyJ... string)

❌ **NEVER Share:**
- Service role key (keep this secret!)
- Database password
- Admin credentials

## 📧 Email Configuration (Optional)

To enable email verification:

1. Go to Supabase → Authentication → Email Templates
2. Update confirmation URL to: `https://yourdomain.com/users/login.html`
3. Customize email templates
4. Enable email confirmations in Settings

## 💡 Tips

1. **Test with Multiple Accounts**
   - Create 2-3 test accounts
   - Place test orders
   - Verify data isolation

2. **Monitor Your Dashboard**
   - Check Supabase daily for new orders
   - Respond to customers promptly
   - Update order statuses

3. **Backup Your Database**
   - Supabase has automatic backups
   - Export important data regularly
   - Keep your schema file safe

## 🎯 What's Next?

1. **Add Real Products**
   - Update shop.html with your products
   - Add high-quality images
   - Set accurate prices

2. **Customize Design**
   - Update colors in css/variables.css
   - Add your logo
   - Customize emails

3. **Set Up Notifications**
   - Get email when orders come in
   - Send confirmations to customers
   - Use Supabase Edge Functions

4. **Add Payment** (when ready)
   - Integrate Paynow for Zimbabwe
   - Or use Stripe/PayPal
   - Update checkout.html

## 🆘 Need Help?

- 📖 Read: IMPLEMENTATION-SUMMARY.md (detailed guide)
- 📚 Read: SUPABASE-SETUP-GUIDE.md (in-depth Supabase info)
- 🌐 Supabase Docs: https://supabase.com/docs
- 🚀 Netlify Docs: https://docs.netlify.com

## ✅ Checklist

Before going live:
- [ ] Supabase project created
- [ ] Database schema run successfully
- [ ] Config file updated with your keys
- [ ] Site deployed to Netlify
- [ ] Test account created
- [ ] Test order placed
- [ ] Admin dashboard working
- [ ] Custom domain configured (optional)
- [ ] Email verification tested
- [ ] All products added
- [ ] Images optimized
- [ ] Contact info updated

---

**Congratulations! Your e-commerce site is ready to take orders! 🎊**
