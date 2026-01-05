# BALLYLIKE - Faith-Driven Fashion Website

A modern, Nike-inspired website for BALLYLIKE, Zimbabwe's premier online clothing shop blending faith, urban culture, and artistic expression. Based in Harare, Zimbabwe.

## 🎨 Brand Identity

- **Primary Color**: Orange (#FF6600)
- **Secondary Colors**: Black (#000000), White (#FFFFFF)
- **Domain**: ballylike.co.zw
- **Location**: Harare, Zimbabwe
- **Mission**: Faith-driven trending fashion & lifestyle brand

## ✨ Features

### Design
- **Nike-Inspired Aesthetic**: Clean, bold, athletic design language
- **Responsive Layout**: Mobile-first design that scales beautifully to desktop
- **Smooth Animations**: Scroll-triggered reveals, hover effects, and transitions
- **Performance Optimized**: Fast loading, efficient CSS and JavaScript
- **SEO Optimized**: Comprehensive meta tags, structured data, and sitemap

### Pages
1. **Home (index.html)**
   - Full-width hero section with brand logo and CTA
   - Featured collections grid
   - Purpose-driven fashion section (Faith, Urban Culture, Art)
   - New arrivals showcase
   - Call-to-action banner

2. **Shop (shop.html)**
   - Product catalog and listings
   - E-commerce ready layout
   - Filter and category options

3. **About (about.html)**
   - Brand story and mission
   - Core values showcase
   - Team member profiles
   - Community engagement CTA

4. **Explore (explore.html)**
   - Discover collections and trends
   - Featured content and lookbooks

5. **Gallery (gallery.html)**
   - Visual showcase of products and lifestyle
   - Image portfolio

6. **Interactive Features**
   - **Faith Meter (faithmeter.html)**: Interactive faith engagement tool
   - **Fit Check (fitcheck.html)**: Style validation and outfit rating
   - **Quiz (quiz.html)**: Interactive brand and style quiz

7. **Content & SEO Pages**
   - **Trending Fashion Zimbabwe (trending-fashion-zimbabwe.html)**
   - **Online Shopping Guide Zimbabwe (online-shopping-guide-zimbabwe.html)**
   - **Lifestyle Zimbabwe (lifestyle-zimbabwe.html)**

### Components
- **Sticky Navigation**: Fixed header with smooth scroll
- **Mobile Menu**: Hamburger menu for responsive navigation
- **Product Cards**: Hover effects with overlay CTAs
- **Performance Cards**: Icon-based value propositions
- **Footer**: Comprehensive footer with social links
- **Interactive Elements**: JavaScript-powered animations and user engagement features

### JavaScript Features
- **main.js**: Core functionality and navigation
- **scroll.js**: Smooth scroll effects and reveals
- **animations.js**: Custom animation utilities
- **transitions.js**: Page transition effects
- **faithmeter.js**: Faith meter interactive component
- **fitcheck.js**: Fit check rating system
- **quiz.js**: Interactive quiz functionality

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No build tools required - pure HTML, CSS, JavaScript

### Installation

1. Clone or download this repository
2. Add your product images to `assets/images/products/` (see image guidelines below)
3. Open `index.html` in your browser
4. Or deploy to any web hosting service

### Quick Preview

```bash
# Simply open index.html in your browser
# Or use a local server:
python -m http.server 8000
# Then visit http://localhost:8000
```

### Folder Structure

```
ballylike/
├── index.html                    # Home page
├── shop.html                     # Shop/Products page
├── about.html                    # About page
├── explore.html                  # Explore collections
├── gallery.html                  # Image gallery
├── faithmeter.html              # Faith meter interactive
├── fitcheck.html                # Fit check feature
├── quiz.html                    # Interactive quiz
├── trending-fashion-zimbabwe.html       # SEO content page
├── online-shopping-guide-zimbabwe.html  # SEO content page
├── lifestyle-zimbabwe.html              # SEO content page
├── sitemap.xml                  # SEO sitemap
├── robots.txt                   # Search engine rules
├── CNAME                        # Domain configuration
├── assets/
│   └── images/                  # All images
│       ├── products/            # Product photos
│       ├── team/                # Team member photos
│       ├── urban/               # Urban lifestyle images
│       └── blueprints/          # Design references
├── css/
│   ├── reset.css               # CSS reset and base styles
│   ├── variables.css           # CSS custom properties
│   ├── layout.css              # Layout and grid system
│   ├── components.css          # Reusable UI components
│   ├── animations.css          # Animation utilities
│   └── placeholders.css        # Placeholder styles
└── js/
    ├── main.js                 # Core functionality
    ├── scroll.js               # Scroll effects
    ├── animations.js           # Animation utilities
    ├── transitions.js          # Page transitions
    ├── faithmeter.js          # Faith meter logic
    ├── fitcheck.js            # Fit check logic
    └── quiz.js                # Quiz logic
```

## 📸 Image Requirements

### Collections & Hero Images
- **Format**: JPG or PNG
- **Size**: 1200px × 800px minimum
- **Aspect Ratio**: 16:9 or 4:3

### Product Images
- **Format**: JPG or PNG
- **Size**: 800px × 800px minimum
- **Aspect Ratio**: 1:1 (square)

### Team Photos
- **Format**: JPG or PNG
- **Size**: 600px × 800px minimum
- **Aspect Ratio**: 3:4 (portrait)

See `assets/images/README.md` for detailed image naming conventions.

## 🎯 Customization

### Colors
Edit `css/variables.css` to change brand colors:

```css
--color-primary: #FF6600;     /* Orange */
--color-black: #000000;       /* Black */
--color-white: #FFFFFF;       /* White */
```

### Typography
The site uses system fonts for optimal performance. To use custom fonts:

1. Add font files to `assets/fonts/`
2. Update `--font-primary` in `css/variables.css`
3. Add `@font-face` rules in `css/reset.css`

### Content
- Update text content directly in HTML files
- Product information in shop.html and collection cards
- Team member details in about.html
- Interactive features in faithmeter, fitcheck, and quiz pages
- SEO content in Zimbabwe-focused content pages
- Contact information in footer

## 🔍 SEO & Marketing

### Implemented Features
- ✅ Comprehensive meta tags (description, keywords, author)
- ✅ Open Graph tags for social media sharing
- ✅ Twitter Card integration
- ✅ Structured data (Schema.org) for search engines
- ✅ XML sitemap (sitemap.xml)
- ✅ Robots.txt for search engine crawlers
- ✅ Canonical URLs
- ✅ Zimbabwe-focused SEO content pages
- ✅ Mobile-optimized for local search

### Target Keywords
- BALLYLIKE
- Trending fashion Zimbabwe
- Online shopping Zimbabwe clothes
- Online clothing shop Zimbabwe
- Lifestyle Zimbabwe stores
- Faith-driven fashion
- Unisex streetwear Zimbabwe
- Harare fashion
- African streetwear
- Christian apparel

### Content Strategy
Three dedicated SEO content pages targeting Zimbabwe market:
1. **trending-fashion-zimbabwe.html** - Fashion trends and style guides
2. **online-shopping-guide-zimbabwe.html** - E-commerce education
3. **lifestyle-zimbabwe.html** - Lifestyle and culture content

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Mobile Optimization

- Touch-friendly navigation
- Optimized tap targets
- Responsive images
- Performance-focused animations
- Mobile menu with smooth transitions

## ⚡ Performance

- No external frameworks or libraries
- Minimal CSS and JavaScript
- Efficient animations using CSS transforms
- Lazy loading ready (implement with `loading="lazy"` on images)
- Optimized for Core Web Vitals
- Fast page loads for Zimbabwe's internet speeds

## 🔧 Development

### Adding New Products

1. Copy existing product card HTML from shop.html
2. Update image source, title, description, and price
3. Add product images to `assets/images/products/`
4. Ensure proper naming convention (see assets/images/README.md)
5. Product cards automatically inherit hover effects

### Adding New Sections

1. Use existing section structure as template
2. Apply `.scroll-reveal` class for scroll animations
3. Use grid classes: `.grid-2`, `.grid-3`, `.grid-4`
4. Follow spacing conventions with CSS variables

### Customizing Interactive Features

**Faith Meter (faithmeter.js)**
- Modify questions and scoring logic
- Customize visual feedback
- Add new faith-related interactions

**Fit Check (fitcheck.js)**
- Update rating criteria
- Customize feedback messages
- Add new style validation rules

**Quiz (quiz.js)**
- Create new quiz questions
- Modify result calculations
- Customize result pages

## 🚀 Deployment

### GitHub Pages
1. Push code to GitHub repository
2. Enable GitHub Pages in repository settings
3. Set CNAME file with ballylike.co.zw
4. Configure DNS at your domain registrar

### Traditional Hosting
1. Upload all files to web server
2. Configure domain to point to hosting
3. Ensure .htaccess or server config for clean URLs
4. Test all pages and interactive features

### Pre-Deployment Checklist
- [ ] Update contact information
- [ ] Add real product images
- [ ] Test all interactive features (Faith Meter, Fit Check, Quiz)
- [ ] Verify SEO meta tags
- [ ] Test mobile responsiveness
- [ ] Check all internal links
- [ ] Optimize and compress images
- [ ] Test on multiple browsers
- [ ] Configure analytics (Google Analytics recommended)

## 📊 Analytics & Tracking

Recommended integrations:
- **Google Analytics**: Track visitor behavior and conversions
- **Facebook Pixel**: Social media marketing and retargeting
- **Google Search Console**: Monitor search performance
- **Hotjar**: User behavior and heatmaps

## 📞 Contact & Support

- **Website**: https://www.ballylike.co.zw
- **Email**: info@ballylike.co.zw
- **Phone**: +263781457106
- **Location**: Harare, Zimbabwe
- **Social Media**: @ballylike (Twitter, Instagram, Facebook)

## 📚 Documentation

Additional documentation files:
- [QUICKSTART.md](QUICKSTART.md) - Quick start guide for beginners
- [DEPLOYMENT.md](DEPLOYMENT.md) - Detailed deployment instructions
- [SEO-IMPLEMENTATION-NOTES.txt](SEO-IMPLEMENTATION-NOTES.txt) - SEO implementation details
- [assets/images/README.md](assets/images/README.md) - Image guidelines and naming conventions

## 🛠️ Tech Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with custom properties
- **Vanilla JavaScript**: No frameworks, pure ES6+
- **Responsive Design**: Mobile-first approach
- **SEO**: Comprehensive optimization for Zimbabwe market

## 📝 Project Status

- ✅ Core website structure complete
- ✅ All main pages implemented
- ✅ Interactive features (Faith Meter, Fit Check, Quiz) functional
- ✅ SEO optimization complete
- ✅ Mobile responsive design
- ✅ Performance optimized
- 🔄 Product images needed (placeholders currently used)
- 🔄 E-commerce integration pending
- 🔄 Payment gateway integration pending

## 📄 License

All rights reserved © 2026 BALLYLIKE

## 🙏 Credits

Design inspired by Nike's modern athletic fashion aesthetic, customized for BALLYLIKE's unique brand identity blending faith, urban culture, and artistic expression.

---

**Built with ❤️ for BALLYLIKE - Where Faith Meets Fashion**
**Harare, Zimbabwe 🇿🇼**
