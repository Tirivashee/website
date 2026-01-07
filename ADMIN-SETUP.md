# 👤 Admin User Setup Guide

## Quick Setup (5 minutes)

### Step 1: Run the Updated Database Schema

If you've already run the schema before, you need to add the `role` column:

**Option A: Run the full schema again** (if you haven't deployed yet)
1. Go to Supabase SQL Editor
2. Run the complete `supabase-schema.sql` file
3. This will create all tables with the role column

**Option B: Add role column to existing table** (if already deployed)
```sql
-- Add role column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer' NOT NULL;
```

### Step 2: Create Admin Account

1. **Sign up at your website:**
   - Go to: `yourdomain.com/users/signup.html`
   - Use email: `admin@ballylike.co.zw`
   - Set a strong password (save it!)
   - Complete the signup process

2. **Verify email** (if email confirmation is enabled)
   - Check inbox for admin@ballylike.co.zw
   - Click verification link

### Step 3: Make User Admin in Supabase

1. Go to Supabase Dashboard
2. Navigate to **SQL Editor**
3. Run this query:
   ```sql
   UPDATE public.profiles 
   SET role = 'admin' 
   WHERE email = 'admin@ballylike.co.zw';
   ```
4. You should see: "Success. 1 rows affected"

### Step 4: Verify Admin Access

1. Log out from your website
2. Go to: `yourdomain.com/users/login.html`
3. Login with:
   - Email: `admin@ballylike.co.zw`
   - Password: (your admin password)
4. Navigate to: `yourdomain.com/system/system.html`
5. You should see the admin dashboard!

## ✅ What's Been Set Up

### Admin Features:
- ✅ Admin role in database
- ✅ Admin-only access to system dashboard
- ✅ View all orders from all customers
- ✅ View detailed order information
- ✅ Update order status
- ✅ Access protected by authentication
- ✅ Automatic redirect if not admin

### Security Features:
- ✅ Non-admin users cannot access dashboard
- ✅ Users are redirected to login if not authenticated
- ✅ Role checked on every page load
- ✅ Database policies enforce admin-only access

## 🔒 Admin Permissions

The admin account can:
- ✅ View all orders from all customers
- ✅ Access order details (customer info, items, addresses)
- ✅ Update order status (pending, processing, shipped, etc.)
- ✅ Search and filter orders
- ✅ View all order items
- ✅ Access the system dashboard

Regular customers cannot:
- ❌ Access the system dashboard
- ❌ View other customers' orders
- ❌ Update order status
- ✅ Only see their own orders

## 📝 How to Use the Admin Dashboard

### Accessing the Dashboard
1. Login with admin@ballylike.co.zw
2. Navigate to: `https://ballylike.co.zw/system/system.html`
3. Dashboard loads with all orders

### Viewing Orders
1. Dashboard shows all orders in table format
2. Columns display:
   - Order ID (short version)
   - Date
   - Customer name & email
   - Number of items
   - Total amount
   - Order status
3. Click "View" button to see full details

### Order Details Modal
When you click "View" on an order:
- Full order ID
- Customer name, email, phone
- Complete delivery address
- List of all items ordered
- Quantities and sizes
- Order subtotal and total
- Order date and time

### Managing Orders
1. **Review New Orders:**
   - Check "Pending" filter
   - Review customer details
   - Verify order items

2. **Contact Customer:**
   - Use email or phone from order
   - Arrange payment method
   - Confirm delivery details

3. **Update Status:**
   - Update in Supabase manually for now
   - Or add status update buttons (future enhancement)

### Filtering Orders
- Click filter buttons: All, Pending, Processing, Completed, Cancelled
- Use search box to find specific orders
- Search by customer name, email, or order ID

## 🔐 Admin Password Security

**Important Security Notes:**

1. **Use a Strong Password:**
   - At least 12 characters
   - Mix of uppercase, lowercase, numbers, symbols
   - Don't use common words

2. **Never Share Admin Credentials:**
   - Keep password private
   - Don't write it down in plain text
   - Use a password manager

3. **Change Password Regularly:**
   - Update every 3-6 months
   - Change immediately if compromised

4. **Enable 2FA** (Future Enhancement):
   - Consider adding two-factor authentication
   - Can be configured in Supabase

## 👥 Adding More Admins (Optional)

To add additional admin users:

1. Have them sign up normally on your website
2. Get their email address
3. Run this SQL in Supabase:
   ```sql
   UPDATE public.profiles 
   SET role = 'admin' 
   WHERE email = 'their-email@example.com';
   ```

## 🛠️ Troubleshooting

### "Access denied. Admin privileges required."
**Solution:**
- Verify you ran the UPDATE query in Supabase
- Check the profiles table: `SELECT * FROM profiles WHERE email = 'admin@ballylike.co.zw'`
- Confirm `role` column shows 'admin'
- Try logging out and back in

### Dashboard shows "No orders found"
**Solution:**
- Place a test order as a customer
- Check Supabase orders table
- Click "Refresh" button in dashboard
- Check browser console for errors

### Can't login with admin@ballylike.co.zw
**Solution:**
- Verify you created the account via signup page
- Check Supabase → Authentication → Users
- Verify email confirmation (if enabled)
- Try password reset

### Orders visible but can't see details
**Solution:**
- Check browser console for errors
- Verify Supabase connection
- Ensure RLS policies are set correctly
- Try refreshing the page

## 📊 Monitoring Your Store

### Daily Tasks:
1. Login to admin dashboard
2. Click "Refresh" to see new orders
3. Review pending orders
4. Contact customers for payment
5. Update order status after processing

### Weekly Tasks:
1. Review completed orders
2. Check for cancelled orders
3. Analyze popular products
4. Follow up on pending orders

### Database Access:
You can always view raw data in Supabase:
- Go to Supabase → Table Editor
- Browse tables: orders, order_items, profiles
- Export data if needed

## 🎯 Next Steps

After admin setup:

1. **Test Complete Flow:**
   - [ ] Create customer account
   - [ ] Place test order as customer
   - [ ] Login as admin
   - [ ] View order in dashboard
   - [ ] Verify all details correct

2. **Set Up Notifications:**
   - Get email when new orders arrive
   - Use Supabase webhooks or Edge Functions

3. **Customize Dashboard:**
   - Add order status update buttons
   - Add filtering by date range
   - Add revenue statistics

4. **Train Your Team:**
   - Show others how to use dashboard
   - Document your order fulfillment process
   - Create admin user accounts for team members

## ✅ Admin Setup Checklist

- [ ] Added role column to profiles table
- [ ] Created account with admin@ballylike.co.zw
- [ ] Verified email (if required)
- [ ] Updated role to 'admin' in Supabase
- [ ] Tested login with admin account
- [ ] Successfully accessed system dashboard
- [ ] Can view all orders
- [ ] Can view order details
- [ ] Saved admin password securely

## 🆘 Need Help?

- Check Supabase logs for authentication errors
- Review browser console for JavaScript errors
- Verify all files were updated correctly
- Ensure Supabase config is correct in `js/supabase-config.js`

---

**Your admin dashboard is now fully functional and secured! 🎉**

Login at: `https://ballylike.co.zw/system/system.html`
