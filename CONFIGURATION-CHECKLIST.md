# ⚙️ CONFIGURATION CHECKLIST

## Before You Deploy - Configuration Required

### 🔴 CRITICAL - Must Do Before Site Works

#### 1. Supabase Configuration
**File: `js/supabase-config.js`**

Current values (CHANGE THESE):
```javascript
const SUPABASE_CONFIG = {
  url: 'YOUR_SUPABASE_URL',  // ← Change to your Project URL
  anonKey: 'YOUR_SUPABASE_ANON_KEY'  // ← Change to your anon key
};
```

How to get these values:
1. Log into https://supabase.com
2. Select your project
3. Go to Settings → API
4. Copy "Project URL"
5. Copy "anon public" key

**Status:** [ ] COMPLETED

---

#### 2. Database Setup
**File: `supabase-schema.sql`**

Actions required:
1. Open Supabase SQL Editor
2. Copy entire content of supabase-schema.sql
3. Paste and run in SQL Editor
4. Verify all tables created

**Status:** [ ] COMPLETED

---

### 🟡 RECOMMENDED - Should Do For Best Experience

#### 3. Email Configuration
**Location: Supabase Dashboard → Authentication → Email Templates**

Settings to update:
- [ ] Confirmation email template
- [ ] Confirmation URL: `https://yourdomain.com/users/login.html`
- [ ] Enable email confirmations
- [ ] Customize reset password email

**Status:** [ ] COMPLETED / [ ] SKIP FOR NOW

---

#### 4. Domain Configuration
**Location: Netlify Dashboard → Domain Settings**

Actions:
- [ ] Add custom domain: `ballylike.co.zw`
- [ ] Update DNS records
- [ ] Enable HTTPS
- [ ] Force HTTPS redirect

**Status:** [ ] COMPLETED / [ ] USING NETLIFY SUBDOMAIN

---

### 🟢 OPTIONAL - Nice to Have

#### 5. Product Information
**Files to update:** `shop.html`

Current products are placeholder images. To use real products:
- [ ] Replace product images in `assets/images/products/`
- [ ] Update product names in HTML
- [ ] Update prices
- [ ] Update descriptions

**Status:** [ ] COMPLETED / [ ] USING PLACEHOLDERS

---

#### 6. Contact Information
**Files to update:** All HTML files with footer

Current contact:
- Email: info@ballylike.co.zw
- Phone: +263 78 145 7106

Update if needed:
- [ ] Email address
- [ ] Phone numbers
- [ ] Social media links
- [ ] Physical address

**Status:** [ ] COMPLETED / [ ] KEEPING CURRENT

---

#### 7. Branding
**Files to update:** Various

Update branding elements:
- [ ] Logo images in `assets/images/`
- [ ] Favicon (favicon.ico)
- [ ] Color scheme in `css/variables.css`
- [ ] Email templates in Supabase

**Status:** [ ] COMPLETED / [ ] KEEPING DEFAULT

---

## 📋 Pre-Launch Checklist

### Functionality Tests
- [ ] Can create new account
- [ ] Can login with credentials
- [ ] Can add items to cart
- [ ] Can add items to wishlist
- [ ] Can view cart page
- [ ] Can proceed to checkout
- [ ] Can submit order
- [ ] Order appears in admin dashboard
- [ ] Can like gallery posts
- [ ] Can comment on gallery posts

### Content Review
- [ ] All product information accurate
- [ ] Prices correct
- [ ] Images high quality
- [ ] Contact information current
- [ ] About page information correct
- [ ] Terms and conditions page ready

### Technical Checks
- [ ] Supabase config updated
- [ ] Database schema deployed
- [ ] Site deployed to Netlify
- [ ] Custom domain configured (if using)
- [ ] SSL certificate active
- [ ] Mobile responsive (test on phone)
- [ ] All links working
- [ ] Forms submitting correctly
- [ ] No console errors

### Security Checks
- [ ] Row Level Security enabled (already done)
- [ ] Service role key NOT in frontend code
- [ ] User data properly isolated
- [ ] Email verification working
- [ ] Password reset working

### Performance
- [ ] Images optimized (<500KB each)
- [ ] Page load time reasonable (<3 seconds)
- [ ] Mobile data usage acceptable
- [ ] Supabase connection stable

---

## 🎯 Deployment Steps (In Order)

1. **Set Up Supabase** [CRITICAL]
   - [ ] Create project
   - [ ] Run schema
   - [ ] Get credentials
   - [ ] Update config file

2. **Local Testing** [RECOMMENDED]
   - [ ] Open index.html in browser
   - [ ] Test signup/login
   - [ ] Test cart/wishlist
   - [ ] Check console for errors

3. **Deploy to Netlify** [CRITICAL]
   - [ ] Push to GitHub
   - [ ] Connect to Netlify
   - [ ] Deploy site
   - [ ] Verify deployment

4. **Post-Deploy Testing** [CRITICAL]
   - [ ] Test all functionality on live site
   - [ ] Create test orders
   - [ ] Check admin dashboard
   - [ ] Verify email notifications

5. **Final Configuration** [RECOMMENDED]
   - [ ] Set custom domain
   - [ ] Configure emails
   - [ ] Update branding
   - [ ] Add real products

---

## 🆘 Common Issues & Solutions

### Issue: "Failed to initialize Supabase client"
**Solution:** 
- Check if you updated `js/supabase-config.js`
- Verify URL and key are correct
- Check for typos

### Issue: "CORS error" or "Network error"
**Solution:**
- Verify Supabase project is active
- Check URL is correct (including https://)
- Try refreshing the page

### Issue: Can't login after signup
**Solution:**
- Check if email verification is required
- Look in spam folder for verification email
- Try with a different email
- Check Supabase → Authentication → Users

### Issue: Cart not saving
**Solution:**
- Make sure you're logged in
- Check browser console for errors
- Verify Supabase connection
- Check if RLS policies are working

### Issue: Orders not appearing in dashboard
**Solution:**
- Check Supabase → orders table directly
- Verify order submission (check browser console)
- Try clicking "Refresh" button
- Check for JavaScript errors

---

## 📞 Support Resources

- **Quick Start Guide:** `QUICK-START.md`
- **Detailed Setup:** `SUPABASE-SETUP-GUIDE.md`
- **Implementation Details:** `IMPLEMENTATION-SUMMARY.md`
- **Supabase Docs:** https://supabase.com/docs
- **Netlify Docs:** https://docs.netlify.com

---

## ✅ Ready to Launch?

Make sure you've completed all CRITICAL items:
- [x] Supabase project created
- [x] Database schema run
- [x] Config file updated
- [x] Site tested locally
- [x] Site deployed
- [x] All features working

**If all CRITICAL items are checked, you're ready to go live! 🚀**

---

*Last Updated: January 2026*
*Version: 1.0*
