# Deployment Guide - Ballylike Website

## Quick Start

Your website is ready to deploy! Follow these steps to get it online.

## 🌐 Deployment Options

### Option 1: Netlify (Recommended - Free & Easy)

1. Create account at [netlify.com](https://netlify.com)
2. Drag and drop your `ballylike` folder
3. Your site will be live in seconds!
4. Optional: Connect custom domain `ballylike.co.zw`

**Pros**: Free, automatic HTTPS, easy updates, excellent performance

### Option 2: GitHub Pages (Free)

1. Create GitHub account
2. Create new repository named `ballylike`
3. Upload all files
4. Go to Settings > Pages
5. Select branch: `main`, folder: `/ (root)`
6. Site will be live at `username.github.io/ballylike`

**Pros**: Free, version control, reliable hosting

### Option 3: Vercel (Free)

1. Sign up at [vercel.com](https://vercel.com)
2. Import your project
3. Deploy automatically
4. Connect custom domain

**Pros**: Free, fast, excellent for static sites

### Option 4: Traditional Web Hosting

1. Purchase hosting (Bluehost, HostGator, etc.)
2. Upload files via FTP/cPanel File Manager
3. Place files in `public_html` or `www` directory
4. Access via your domain

**Required**:
- Web hosting with HTML/CSS/JS support
- FTP access or file manager
- Domain name

## 📁 Files to Upload

Upload all these files and folders:
```
├── index.html
├── collections.html
├── about.html
├── assets/
│   └── images/
├── css/
│   ├── reset.css
│   ├── variables.css
│   ├── layout.css
│   ├── components.css
│   ├── animations.css
│   └── placeholders.css
└── js/
    ├── main.js
    ├── scroll.js
    ├── animations.js
    └── transitions.js
```

## 🎨 Before Going Live

### 1. Add Real Images
- Replace placeholder images in `assets/images/`
- Follow naming convention in `assets/images/README.md`
- Optimize images (use tools like TinyPNG)
- Remove `placeholders.css` link from HTML files

### 2. Update Content
- Replace "XXX XXXX" phone number in footer
- Add real social media links
- Update team member information
- Add actual product prices

### 3. SEO Optimization
- Update meta descriptions in each HTML file
- Add favicon: `<link rel="icon" href="assets/images/favicon.ico">`
- Create `sitemap.xml`
- Add Google Analytics (optional)

### 4. Testing
- Test on multiple browsers (Chrome, Firefox, Safari)
- Test on mobile devices
- Check all links work
- Verify contact information
- Test form submissions (if you add forms)

## 🔧 Custom Domain Setup

### For ballylike.co.zw:

1. **Purchase Domain** from Zimbabwean registrar
   - Suggested: ZisHosting, ZOL, etc.

2. **DNS Configuration**:
   ```
   Type    Name    Value
   A       @       [your-hosting-IP]
   CNAME   www     ballylike.co.zw
   ```

3. **Update Hosting**: Point domain to your hosting

4. **SSL Certificate**: Enable HTTPS
   - Most hosts provide free SSL (Let's Encrypt)
   - Or use Cloudflare for free SSL

## 📊 Analytics Setup (Optional)

### Google Analytics
1. Create account at [analytics.google.com](https://analytics.google.com)
2. Add tracking code before `</head>` in all HTML files:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🚀 Performance Optimization

### Before Deployment:

1. **Optimize Images**:
   - Use WebP format for better compression
   - Maximum 500KB per image
   - Use lazy loading: `<img loading="lazy" ...>`

2. **Minify CSS/JS** (optional):
   - Use online tools or build process
   - Or keep as-is for easier maintenance

3. **Enable Caching**:
   - Add `.htaccess` for Apache servers:
   ```apache
   <IfModule mod_expires.c>
     ExpiresActive On
     ExpiresByType image/jpg "access plus 1 year"
     ExpiresByType image/jpeg "access plus 1 year"
     ExpiresByType image/png "access plus 1 year"
     ExpiresByType text/css "access plus 1 month"
     ExpiresByType application/javascript "access plus 1 month"
   </IfModule>
   ```

## 📱 Mobile Testing

Test on actual devices or use:
- Chrome DevTools (F12 > Device Toolbar)
- Firefox Responsive Design Mode
- BrowserStack for multiple devices

## ✅ Launch Checklist

- [ ] Real images added
- [ ] All content updated
- [ ] Contact information verified
- [ ] Social media links updated
- [ ] Tested on Chrome, Firefox, Safari
- [ ] Tested on mobile devices
- [ ] All links working
- [ ] Domain connected
- [ ] SSL certificate active
- [ ] Google Analytics added (optional)
- [ ] Sitemap submitted to Google (optional)

## 🆘 Troubleshooting

**Images not showing?**
- Check file paths are correct
- Verify images are in `assets/images/`
- Check image file extensions match HTML

**CSS not loading?**
- Verify CSS files are in `css/` folder
- Check browser cache (Ctrl+F5 to hard refresh)
- Verify file paths in HTML `<link>` tags

**JavaScript not working?**
- Check browser console for errors (F12)
- Verify JS files are in `js/` folder
- Ensure proper file paths in HTML

## 📞 Support

Need help? Contact:
- Email: info@ballylike.co.zw
- Check README.md for documentation

---

**Ready to launch Ballylike to the world! 🚀**
