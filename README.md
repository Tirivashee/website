# Ballylike - Athletic Fashion Brand Website

A modern, Nike-inspired website for Ballylike, an athletic fashion brand blending faith, urban culture, and artistic expression.

## 🎨 Brand Identity

- **Primary Color**: Orange (#FF6600)
- **Secondary Colors**: Black (#000000), White (#FFFFFF)
- **Domain**: ballylike.co.zw
- **Location**: Harare, Zimbabwe

## ✨ Features

### Design
- **Nike-Inspired Aesthetic**: Clean, bold, athletic design language
- **Responsive Layout**: Mobile-first design that scales beautifully to desktop
- **Smooth Animations**: Scroll-triggered reveals, hover effects, and transitions
- **Performance Optimized**: Fast loading, efficient CSS and JavaScript

### Pages
1. **Home (index.html)**
   - Full-width hero section with brand logo and CTA
   - Featured collections grid
   - Purpose-driven fashion section (Faith, Urban Culture, Art)
   - New arrivals showcase
   - Call-to-action banner

2. **Collections (collections.html)**
   - Collection categories overview
   - Urban Street collection products
   - Performance athletic wear
   - Faith essentials line
   - Newsletter signup CTA

3. **About (about.html)**
   - Brand story and mission
   - Core values showcase
   - Team member profiles
   - Community engagement CTA

### Components
- **Sticky Navigation**: Fixed header with smooth scroll
- **Mobile Menu**: Hamburger menu for responsive navigation
- **Product Cards**: Hover effects with overlay CTAs
- **Performance Cards**: Icon-based value propositions
- **Footer**: Comprehensive footer with social links

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No build tools required - pure HTML, CSS, JavaScript

### Installation

1. Clone or download this repository
2. Add your product images to `assets/images/` (see image guidelines below)
3. Open `index.html` in your browser
4. Or deploy to any web hosting service

### Folder Structure

```
ballylike/
├── index.html              # Home page
├── collections.html        # Collections page
├── about.html             # About page
├── assets/
│   ├── images/           # Product and brand images
│   └── fonts/            # Custom fonts (if needed)
├── css/
│   ├── reset.css         # CSS reset and base styles
│   ├── variables.css     # CSS custom properties
│   ├── layout.css        # Layout and grid system
│   ├── components.css    # Reusable UI components
│   └── animations.css    # Animation utilities
└── js/
    ├── main.js           # Core functionality
    ├── scroll.js         # Scroll effects
    ├── animations.js     # Animation utilities
    └── transitions.js    # Page transitions
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
- Product information in collection cards
- Team member details in about.html
- Contact information in footer

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

## 🔧 Development

### Adding New Products

1. Copy existing product card HTML
2. Update image source, title, description, and price
3. Ensure image exists in `assets/images/`
4. Product cards automatically inherit hover effects

### Adding New Sections

1. Use existing section structure as template
2. Apply `.scroll-reveal` class for scroll animations
3. Use grid classes: `.grid-2`, `.grid-3`, `.grid-4`
4. Follow spacing conventions with CSS variables

## 📞 Contact & Support

- **Website**: ballylike.co.zw
- **Email**: info@ballylike.co.zw
- **Location**: Harare, Zimbabwe

## 📄 License

All rights reserved © 2025 Ballylike

## 🙏 Credits

Design inspired by Nike's modern athletic fashion aesthetic, customized for Ballylike's unique brand identity.

---

**Built with ❤️ for Ballylike - Where Faith Meets Fashion**
