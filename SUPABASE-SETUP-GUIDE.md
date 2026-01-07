# BALLYLIKE - Supabase Backend Setup Guide

## 🚀 Quick Start

This guide will help you set up the Supabase backend for your BALLYLIKE e-commerce website.

## Prerequisites

- A Netlify account (for hosting)
- A Supabase account (free tier is fine)
- Your website files uploaded to GitHub or ready for Netlify deployment

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in the project details:
   - **Name**: BALLYLIKE (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users (South Africa for Zimbabwe)
4. Click "Create new project" and wait for setup to complete (~2 minutes)

## Step 2: Set Up Database Schema

1. In your Supabase project dashboard, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy the entire contents of `supabase-schema.sql` file
4. Paste it into the SQL editor
5. Click **Run** (or press Ctrl+Enter)
6. You should see "Success. No rows returned" - this is good!

This creates all necessary tables:
- `profiles` - User profile information
- `cart_items` - Shopping cart data
- `wishlist_items` - Wishlist data
- `orders` - Order information
- `order_items` - Individual items in orders
- `post_comments` - Comments on gallery posts
- `post_likes` - Likes on gallery posts

## Step 3: Configure Authentication

1. Go to **Authentication** → **Providers** in Supabase dashboard
2. Make sure **Email** provider is enabled (it should be by default)
3. Scroll down to **Email Auth** settings:
   - ✅ Enable email confirmations (recommended)
   - ✅ Enable email change confirmations
   - Set confirmation URL to: `https://ballylike.co.zw/users/login.html`
4. Click **Save**

### Optional: Configure Email Templates

1. Go to **Authentication** → **Email Templates**
2. Customize the templates for:
   - Confirm signup
   - Magic Link
   - Change Email Address
   - Reset Password

## Step 4: Get Your Supabase Credentials

1. Go to **Settings** → **API** in Supabase dashboard
2. You'll need two pieces of information:
   - **Project URL**: Something like `https://xxxxx.supabase.co`
   - **anon/public key**: A long string starting with `eyJ...`

⚠️ **Keep your anon key safe but note it's meant to be public**
⚠️ **NEVER expose your service_role key in frontend code!**

## Step 5: Update Your Website Configuration

1. Open `js/supabase-config.js` in your website files
2. Replace the placeholder values:

```javascript
const SUPABASE_CONFIG = {
  url: 'https://your-project-id.supabase.co',  // Your Project URL
  anonKey: 'your-anon-key-here'  // Your anon/public key
};
```

3. Save the file

## Step 6: Deploy to Netlify

### Option A: Deploy via Git (Recommended)

1. Push your code to GitHub
2. Go to [https://netlify.com](https://netlify.com) and login
3. Click "Add new site" → "Import an existing project"
4. Choose GitHub and select your repository
5. Build settings:
   - **Build command**: (leave empty)
   - **Publish directory**: `.` (or root)
6. Click "Deploy site"

### Option B: Manual Deploy

1. Go to [https://netlify.com](https://netlify.com) and login
2. Drag and drop your website folder onto Netlify dashboard
3. Wait for deployment to complete

### Set Custom Domain

1. In Netlify dashboard, go to **Domain settings**
2. Click "Add custom domain"
3. Enter: `ballylike.co.zw`
4. Follow the instructions to update your DNS records

## Step 7: Test Your Setup

### Test User Registration

1. Visit: `https://ballylike.co.zw/users/signup.html`
2. Create a test account
3. Check your email for verification link (if enabled)
4. Log in at: `https://ballylike.co.zw/users/login.html`

### Test Shopping Cart

1. Browse to: `https://ballylike.co.zw/shop.html`
2. Click "Add to Cart" on a product
3. Visit: `https://ballylike.co.zw/cart.html`
4. Verify items appear in cart

### Test Wishlist

1. On shop page, click the bookmark icon (🔖)
2. Visit: `https://ballylike.co.zw/wishlist.html`
3. Verify items appear in wishlist

### Test Checkout

1. Add items to cart
2. Go to cart and click "PROCEED TO CHECKOUT"
3. Fill in delivery information
4. Submit order
5. Check Supabase dashboard → **Table Editor** → **orders** to see the order

### Test Gallery Comments/Likes

1. Visit: `https://ballylike.co.zw/gallery.html`
2. Click like button on a post
3. Add a comment
4. Check Supabase dashboard → **post_likes** and **post_comments** tables

## Step 8: Admin Dashboard Setup

The admin dashboard is at `/system/system.html`. To view orders:

1. You'll need to modify `system.html` to load orders from Supabase
2. Add authentication check for admin users
3. For now, you can view orders directly in Supabase dashboard:
   - Go to **Table Editor**
   - Select **orders** table
   - View all submitted orders with customer information

## 🔐 Security Notes

### Row Level Security (RLS)

All tables have RLS enabled, which means:
- Users can only see their own cart items, wishlist, and orders
- Users can only modify their own data
- Comments and likes are public but users can only delete their own

### Important Security Rules

1. ✅ **Never commit your Supabase credentials to a public repository**
2. ✅ **Use environment variables for sensitive data** (for server-side operations)
3. ✅ **The anon key is safe to expose in frontend** (it's public by design)
4. ❌ **Never expose your service_role key in frontend code**
5. ✅ **Always validate data on both client and server side**

## 📊 Monitoring Your Application

### Supabase Dashboard

1. **Database**: View all tables and data
2. **Authentication**: Monitor user signups and logins
3. **API**: Check API usage and performance
4. **Logs**: View query logs and errors

### View Orders

1. Go to Supabase **Table Editor**
2. Select **orders** table
3. You'll see all orders with:
   - Customer name, email, phone
   - Delivery address
   - Order items (in JSON format)
   - Order status
   - Order total

## 🛠 Customization

### Add Product Data to Database

Currently, products are hardcoded in the HTML. To move them to Supabase:

1. Create a `products` table in Supabase
2. Insert your product data
3. Update shop.html to fetch products from Supabase
4. Update cart/wishlist logic to use product IDs

### Email Notifications

To send email notifications when orders are placed:

1. Use Supabase Edge Functions (serverless functions)
2. Or integrate with services like SendGrid, Mailgun, or Resend
3. Trigger emails on order creation

### Payment Integration

When ready to accept payments:

1. Integrate Paynow (Zimbabwe), Stripe, or PayPal
2. Update checkout.html to include payment flow
3. Only create order after successful payment
4. Store payment reference in orders table

## 🆘 Troubleshooting

### "Failed to fetch" or CORS errors

- Make sure your Supabase URL and anon key are correct
- Check browser console for specific error messages
- Verify Supabase project is running (check dashboard)

### Users can't sign up

- Check email provider is enabled in Supabase
- Verify email confirmation settings
- Check spam folder for verification emails
- Look at Supabase Auth logs for errors

### Cart/Wishlist not persisting

- Make sure user is logged in
- Check browser console for errors
- Verify RLS policies in Supabase
- Check that Supabase client is initialized

### Orders not appearing

- Verify order was submitted (check browser console)
- Check Supabase orders table directly
- Verify user authentication token is valid
- Check RLS policies on orders table

## 📝 Database Schema Overview

```
profiles
├── id (UUID, references auth.users)
├── email (TEXT)
├── full_name (TEXT)
├── phone (TEXT)
└── created_at (TIMESTAMP)

cart_items
├── id (UUID)
├── user_id (UUID)
├── product_id (TEXT)
├── product_name (TEXT)
├── price (DECIMAL)
└── quantity (INTEGER)

wishlist_items
├── id (UUID)
├── user_id (UUID)
├── product_id (TEXT)
└── product_name (TEXT)

orders
├── id (UUID)
├── user_id (UUID)
├── user_email (TEXT)
├── user_name (TEXT)
├── phone (TEXT)
├── address (TEXT)
├── total (DECIMAL)
└── status (TEXT)

post_comments
├── id (UUID)
├── post_id (TEXT)
├── user_id (UUID)
└── comment_text (TEXT)

post_likes
├── id (UUID)
├── post_id (TEXT)
└── user_id (UUID)
```

## 🎯 Next Steps

1. ✅ Set up Supabase project
2. ✅ Run database schema
3. ✅ Update website configuration
4. ✅ Deploy to Netlify
5. ✅ Test all features
6. 🔄 Customize admin dashboard
7. 🔄 Add more products
8. 🔄 Set up payment processing (when ready)
9. 🔄 Configure custom domain
10. 🔄 Set up email notifications

## 📞 Support

- Supabase Docs: https://supabase.com/docs
- Netlify Docs: https://docs.netlify.com
- For issues with this setup, check the browser console for errors

## 🎉 You're All Set!

Your BALLYLIKE e-commerce website now has:
- ✅ User authentication (signup/login)
- ✅ Shopping cart (persistent)
- ✅ Wishlist (with bookmark icons)
- ✅ Order submission (no payment, Balenciaga-style)
- ✅ Gallery comments and likes
- ✅ Admin order management

Customers can browse, add to cart, and submit orders. You'll receive order details in your Supabase dashboard and can contact customers to arrange payment and delivery!
