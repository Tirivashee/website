# BALLYLIKE - Next.js/React Migration Guide

## Project Overview

**BALLYLIKE** is a faith-driven fashion e-commerce website for Zimbabwe's premier online clothing shop, currently built with vanilla HTML, CSS, and JavaScript. This document provides comprehensive instructions for recreating the entire project using **Next.js 14+ (App Router)** and **React**.

### Current Tech Stack
- Pure HTML/CSS/JavaScript
- Supabase (Authentication & Database)
- Nike-inspired brutalist design aesthetic
- Static site with dynamic cart/wishlist/auth features

### Target Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Modules (for complex animations)
- **UI Library**: Headless UI or Radix UI (for modals, dropdowns)
- **State Management**: React Context API + Zustand (for cart/wishlist)
- **Backend**: Supabase (maintain existing database)
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion
- **Image Optimization**: Next.js Image component
- **SEO**: Next.js Metadata API

---

## 1. Brand Identity & Design System

### Color Palette
```typescript
// tailwind.config.ts - extend theme
colors: {
  brand: {
    primary: '#FF6600',  // Orange
    black: '#000000',
    white: '#FFFFFF',
    gray: {
      100: '#F8F8F8',
      200: '#E8E8E8',
      300: '#D0D0D0',
      400: '#A0A0A0',
      500: '#5A5A5A',
      900: '#1A1A1A',
    }
  }
}
```

### Typography
- **Primary Font**: System fonts (-apple-system, BlinkMacSystemFont, "Helvetica Neue", "Arial", sans-serif)
- **Monospace Font**: "Courier New", Courier, monospace
- **Font Weights**: 400 (normal), 500 (medium), 700 (bold)

### Design Principles
- **Nike-inspired**: Athletic, bold, clean aesthetic
- **Brutalist touches**: Sharp edges, high contrast, minimal decoration
- **Mobile-first**: Responsive design scaling from mobile to desktop
- **Performance**: Fast loading, optimized images, efficient code
- **Accessibility**: WCAG 2.1 AA compliant

---

## 2. Project Structure

```
ballylike-nextjs/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (shop)/
│   │   ├── shop/
│   │   │   └── page.tsx
│   │   ├── product/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── cart/
│   │   │   └── page.tsx
│   │   ├── checkout/
│   │   │   └── page.tsx
│   │   └── wishlist/
│   │       └── page.tsx
│   ├── (content)/
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── explore/
│   │   │   └── page.tsx
│   │   ├── gallery/
│   │   │   └── page.tsx
│   │   ├── trending-fashion-zimbabwe/
│   │   │   └── page.tsx
│   │   ├── online-shopping-guide-zimbabwe/
│   │   │   └── page.tsx
│   │   └── lifestyle-zimbabwe/
│   │       └── page.tsx
│   ├── (interactive)/
│   │   ├── faithmeter/
│   │   │   └── page.tsx
│   │   ├── fitcheck/
│   │   │   └── page.tsx
│   │   └── quiz/
│   │       └── page.tsx
│   ├── account/
│   │   ├── page.tsx
│   │   ├── orders/
│   │   │   └── page.tsx
│   │   └── profile/
│   │       └── page.tsx
│   ├── system/
│   │   ├── admin/
│   │   │   └── products/
│   │   │       └── page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   ├── products/
│   │   │   └── route.ts
│   │   ├── cart/
│   │   │   └── route.ts
│   │   └── wishlist/
│   │       └── route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   ├── not-found.tsx (404 page)
│   └── error.tsx
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── MobileMenu.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   └── Badge.tsx
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductFilter.tsx
│   │   └── ProductQuickView.tsx
│   ├── cart/
│   │   ├── CartItem.tsx
│   │   ├── CartSummary.tsx
│   │   └── CartDrawer.tsx
│   ├── wishlist/
│   │   ├── WishlistButton.tsx
│   │   └── WishlistItem.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── AuthGuard.tsx
│   └── animations/
│       ├── FadeIn.tsx
│       ├── SlideIn.tsx
│       └── ScrollReveal.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── stores/
│   │   ├── cartStore.ts
│   │   ├── wishlistStore.ts
│   │   └── authStore.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   ├── useWishlist.ts
│   │   └── useProducts.ts
│   ├── utils/
│   │   ├── validation.ts
│   │   ├── formatting.ts
│   │   └── constants.ts
│   └── types/
│       ├── product.ts
│       ├── cart.ts
│       ├── user.ts
│       └── order.ts
├── public/
│   ├── assets/
│   │   └── images/
│   │       ├── products/
│   │       ├── team/
│   │       ├── urban/
│   │       └── blueprints/
│   ├── robots.txt
│   ├── sitemap.xml
│   └── favicon.ico
├── styles/
│   └── globals.css
├── middleware.ts
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 3. Database Schema (Supabase)

Keep the existing Supabase database schema. Here's the complete structure:

### Tables

#### `profiles`
```sql
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'customer' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

#### `products`
```sql
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  tags TEXT[],
  base_price DECIMAL(10, 2) NOT NULL,
  compare_at_price DECIMAL(10, 2),
  cost_per_item DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  featured_order INTEGER,
  track_inventory BOOLEAN DEFAULT true,
  continue_selling_when_out_of_stock BOOLEAN DEFAULT false,
  main_image TEXT,
  additional_images TEXT[],
  weight DECIMAL(10, 2),
  weight_unit TEXT DEFAULT 'kg',
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

#### `product_variants`
```sql
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  size TEXT,
  color TEXT,
  price DECIMAL(10, 2),
  compare_at_price DECIMAL(10, 2),
  inventory_quantity INTEGER DEFAULT 0,
  inventory_policy TEXT DEFAULT 'deny',
  barcode TEXT,
  image TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(product_id, size, color)
);
```

#### `cart_items`
```sql
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, product_id, variant_id)
);
```

#### `wishlist_items`
```sql
CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, product_id)
);
```

#### `orders`
```sql
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  subtotal DECIMAL(10, 2) NOT NULL,
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  tax DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  shipping_address JSONB,
  billing_address JSONB,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'unpaid',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

#### `order_items`
```sql
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  variant_details TEXT,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

#### `post_comments` (for gallery)
```sql
CREATE TABLE IF NOT EXISTS public.post_comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

#### `post_likes` (for gallery)
```sql
CREATE TABLE IF NOT EXISTS public.post_likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(post_id, user_id)
);
```

---

## 4. Pages & Features Implementation

### 4.1 Home Page (`app/page.tsx`)

**Features:**
- Full-width hero section with brand logo and animated CTA
- Featured collections grid (6-8 products)
- Purpose-driven fashion section (3 pillars: Faith, Urban Culture, Art)
- New arrivals showcase
- Call-to-action banner
- Scroll-triggered animations
- SEO optimization with metadata

**Components Needed:**
- `<HeroSection />` - Full-width hero with logo and CTA
- `<FeaturedCollections />` - Product grid from database
- `<PurposePillars />` - 3-column feature cards
- `<NewArrivals />` - Latest products carousel
- `<CTABanner />` - Full-width call-to-action

**Key Functionality:**
```typescript
// Fetch featured products
async function getFeaturedProducts() {
  const supabase = createClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .eq('is_active', true)
    .order('featured_order', { ascending: true })
    .limit(8)
  return data
}
```

**SEO Metadata:**
```typescript
export const metadata: Metadata = {
  title: 'BALLYLIKE - Faith-Driven Trending Fashion Zimbabwe | Online Clothing Shop',
  description: 'BALLYLIKE - Faith-driven trending fashion in Zimbabwe. Online clothing shop blending faith, urban culture, and lifestyle apparel. Premium unisex streetwear from Harare.',
  keywords: ['BALLYLIKE', 'trending fashion zimbabwe', 'online shopping zimbabwe clothes', 'faith-driven fashion'],
  openGraph: {
    title: 'BALLYLIKE - Faith-Driven Fashion Zimbabwe',
    description: 'Zimbabwe\'s premier online clothing shop for faith-driven unisex fashion.',
    url: 'https://www.ballylike.co.zw',
    siteName: 'BALLYLIKE',
    locale: 'en_US',
    type: 'website',
  },
  // Add structured data via JSON-LD
}
```

---

### 4.2 Shop Page (`app/(shop)/shop/page.tsx`)

**Features:**
- Full product catalog from Supabase
- Category filtering (T-Shirts, Hoodies, Bags, Caps, Accessories)
- Price range filtering
- Sort options (Featured, Newest, Price: Low to High, High to Low)
- Search functionality
- Grid view (responsive: 2 cols mobile, 3 tablet, 4 desktop)
- Add to cart/wishlist buttons on hover
- Pagination or infinite scroll
- Loading states and skeleton screens

**Components Needed:**
- `<ProductGrid />` - Main product display
- `<ProductCard />` - Individual product card with hover effects
- `<FilterSidebar />` - Category and price filters
- `<SortDropdown />` - Sort options
- `<SearchBar />` - Product search

**Key Functionality:**
```typescript
// Product filtering and search
async function getProducts(params: {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: string
}) {
  const supabase = createClient()
  let query = supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
  
  if (params.category) {
    query = query.eq('category', params.category)
  }
  
  if (params.search) {
    query = query.ilike('name', `%${params.search}%`)
  }
  
  if (params.minPrice) {
    query = query.gte('base_price', params.minPrice)
  }
  
  if (params.maxPrice) {
    query = query.lte('base_price', params.maxPrice)
  }
  
  // Add sorting
  if (params.sortBy === 'price_asc') {
    query = query.order('base_price', { ascending: true })
  } else if (params.sortBy === 'price_desc') {
    query = query.order('base_price', { ascending: false })
  } else {
    query = query.order('created_at', { ascending: false })
  }
  
  const { data } = await query
  return data
}
```

**Product Card Interactions:**
- Hover effect: Overlay appears with "Add to Cart" and "Add to Wishlist" buttons
- Quick view modal
- Product image optimization with Next.js Image

---

### 4.3 Product Detail Page (`app/(shop)/product/[id]/page.tsx`)

**Features:**
- Product image gallery (main image + thumbnails)
- Product information (name, price, description)
- Size/color variant selection
- Quantity selector
- Add to cart button
- Add to wishlist button
- Product tabs (Description, Specifications, Reviews)
- Related products section
- Breadcrumb navigation
- Share buttons

**Components Needed:**
- `<ProductGallery />` - Image gallery with zoom
- `<VariantSelector />` - Size/color selection
- `<QuantityInput />` - Quantity selector
- `<ProductTabs />` - Description/specs/reviews tabs
- `<RelatedProducts />` - Similar products

---

### 4.4 Cart Page (`app/(shop)/cart/page.tsx`)

**Features:**
- Cart items list with product details
- Quantity adjustment (+ / - buttons)
- Remove item functionality
- Cart summary (subtotal, shipping, total)
- Promo code input
- "Continue Shopping" and "Checkout" buttons
- Empty cart state
- Persist cart in Supabase for authenticated users, localStorage for guests

**State Management (Zustand):**
```typescript
// lib/stores/cartStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  product_id: string
  product_name: string
  product_image: string
  price: number
  quantity: number
  size?: string
  color?: string
  variant_id?: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string, variantId?: string) => void
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  syncWithDatabase: () => Promise<void>
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.product_id === item.product_id && i.variant_id === item.variant_id
          )
          
          if (existingIndex > -1) {
            const newItems = [...state.items]
            newItems[existingIndex].quantity += item.quantity
            return { items: newItems }
          }
          
          return { items: [...state.items, item] }
        })
      },
      
      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.product_id === productId && item.variant_id === variantId)
          )
        }))
      },
      
      updateQuantity: (productId, quantity, variantId) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.product_id === productId && item.variant_id === variantId
              ? { ...item, quantity }
              : item
          )
        }))
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
      },
      
      syncWithDatabase: async () => {
        // Sync with Supabase for authenticated users
      }
    }),
    {
      name: 'cart-storage',
    }
  )
)
```

---

### 4.5 Checkout Page (`app/(shop)/checkout/page.tsx`)

**Features:**
- Multi-step form (Shipping → Payment → Review)
- Shipping address form with validation
- Payment method selection (Cash on Delivery, Mobile Money, Card)
- Order review section
- Order summary sidebar
- Form validation with React Hook Form + Zod
- Order creation in Supabase

**Form Validation:**
```typescript
import { z } from 'zod'

const checkoutSchema = z.object({
  email: z.string().email('Invalid email address'),
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Invalid phone number'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().optional(),
  paymentMethod: z.enum(['cash', 'mobile_money', 'card']),
})
```

---

### 4.6 Wishlist Page (`app/(shop)/wishlist/page.tsx`)

**Features:**
- Grid of wishlist items
- Remove from wishlist button
- Add to cart button
- Empty wishlist state
- Sync with Supabase for authenticated users

**State Management (Zustand):**
```typescript
// lib/stores/wishlistStore.ts
import { create } from 'zustand'

interface WishlistItem {
  product_id: string
  product_name: string
  product_image: string
  price: number
}

interface WishlistStore {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  syncWithDatabase: () => Promise<void>
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],
  
  addItem: (item) => {
    set((state) => {
      if (state.items.find((i) => i.product_id === item.product_id)) {
        return state
      }
      return { items: [...state.items, item] }
    })
  },
  
  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.product_id !== productId)
    }))
  },
  
  isInWishlist: (productId) => {
    return get().items.some((item) => item.product_id === productId)
  },
  
  syncWithDatabase: async () => {
    // Sync with Supabase
  }
}))
```

---

### 4.7 Authentication Pages

#### Login (`app/(auth)/login/page.tsx`)
- Email and password fields
- "Remember me" checkbox
- "Forgot password?" link
- Social auth buttons (Google, Facebook)
- Redirect to previous page after login

#### Signup (`app/(auth)/signup/page.tsx`)
- Full name, email, password, confirm password fields
- Terms and conditions checkbox
- Form validation
- Auto-login after successful signup

**Authentication Hook:**
```typescript
// lib/hooks/useAuth.ts
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const supabase = createClient()
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    
    return () => subscription.unsubscribe()
  }, [])
  
  return { user, loading }
}
```

---

### 4.8 About Page (`app/(content)/about/page.tsx`)

**Features:**
- Brand story section
- Mission statement
- Core values (3 pillars: Faith, Urban Culture, Art)
- Team member profiles with images
- Community engagement CTA
- Timeline/history section

**Components:**
- `<BrandStory />` - Hero section with story
- `<CoreValues />` - 3-column value cards
- `<TeamGrid />` - Team member cards with images
- `<CommunityCTA />` - Call-to-action section

---

### 4.9 Explore Page (`app/(content)/explore/page.tsx`)

**Features:**
- Collection showcases
- Lookbook galleries
- Trend highlights
- Featured content
- Instagram-style grid layout

---

### 4.10 Gallery Page (`app/(content)/gallery/page.tsx`)

**Features:**
- Masonry grid layout of lifestyle images
- Lightbox for image viewing
- Like and comment functionality
- Filter by category/tag
- Infinite scroll

**Components:**
- `<GalleryMasonry />` - Masonry grid layout
- `<GalleryLightbox />` - Full-screen image viewer
- `<CommentSection />` - Comments and likes
- `<GalleryFilter />` - Category filters

**Key Functionality:**
```typescript
// Like a post
async function likePost(postId: string, userId: string) {
  const supabase = createClient()
  await supabase.from('post_likes').insert({
    post_id: postId,
    user_id: userId
  })
}

// Add comment
async function addComment(postId: string, userId: string, comment: string) {
  const supabase = createClient()
  await supabase.from('post_comments').insert({
    post_id: postId,
    user_id: userId,
    comment_text: comment
  })
}
```

---

### 4.11 Faith Meter (`app/(interactive)/faithmeter/page.tsx`)

**Features:**
- 10-question assessment quiz
- Multiple-choice questions with weighted values
- Real-time score calculation
- Result visualization (radial gauge or progress ring)
- Personalized feedback based on score ranges
- Social sharing functionality
- Restart option

**Questions Categories:**
1. Faith in decision-making
2. Personal style and values
3. Community inspiration
4. Strength in challenges
5. Purpose in actions
6. Gratitude expression
7. Fashion as expression
8. Service to others
9. Spiritual growth
10. Lifestyle alignment

**Score Ranges:**
- 90-100: "Faith Champion"
- 75-89: "Purpose Driven"
- 60-74: "Growing Strong"
- 40-59: "On The Journey"
- 0-39: "Just Starting"

**Components:**
- `<QuizContainer />` - Main quiz wrapper
- `<QuestionCard />` - Individual question display
- `<ProgressBar />` - Quiz progress indicator
- `<ResultsDisplay />` - Score visualization and feedback
- `<ShareButtons />` - Social media sharing

---

### 4.12 Fit Check (`app/(interactive)/fitcheck/page.tsx`)

**Features:**
- Image upload functionality (drag & drop + file picker)
- Privacy policy modal (must accept before upload)
- AI-powered outfit analysis (mock API or integrate with actual AI service)
- Rating system (1-10 scale with emoji feedback)
- Style feedback and recommendations
- Product suggestions based on uploaded outfit
- Share results functionality
- "Try Again" to upload new image

**Rating Templates:**
- 10: "ABSOLUTE FIRE 🔥"
- 9: "ELITE STATUS 🌟"
- 8: "CERTIFIED FRESH ✨"
- 7: "SOLID VIBES 👌"
- 6: "DECENT FIT 👍"
- 5: "GOOD BASE 💯"
- 4: "ROOM TO GROW 🌱"
- 3: "NEEDS WORK 🔧"
- 2: "MAJOR ADJUSTMENTS ⚠️"
- 1: "START FRESH 🔄"

**Components:**
- `<ImageUploader />` - Drag & drop upload area
- `<PrivacyModal />` - Terms acceptance
- `<RatingDisplay />` - Score visualization
- `<FeedbackSection />` - Personalized feedback
- `<ProductSuggestions />` - Recommended products

**Implementation Notes:**
- Use Next.js API route for image processing
- Store uploads temporarily (or use Supabase Storage)
- Mock AI analysis initially, integrate real AI later
- Product suggestions based on outfit colors/style

---

### 4.13 Quiz Page (`app/(interactive)/quiz/page.tsx`)

**Features:**
- Brand/style personality quiz
- Multi-step form with animations
- Result calculation
- Personalized style profile
- Product recommendations based on results

---

### 4.14 SEO Content Pages

#### Trending Fashion Zimbabwe (`app/(content)/trending-fashion-zimbabwe/page.tsx`)
- Long-form content about fashion trends in Zimbabwe
- Keyword-optimized (trending fashion zimbabwe)
- Image galleries
- Internal links to products
- Blog-style layout

#### Online Shopping Guide Zimbabwe (`app/(content)/online-shopping-guide-zimbabwe/page.tsx`)
- Educational content about online shopping in Zimbabwe
- How-to guides
- FAQ section
- Trust badges
- CTA to shop

#### Lifestyle Zimbabwe (`app/(content)/lifestyle-zimbabwe/page.tsx`)
- Lifestyle content and stories
- Faith and culture focus
- Community highlights
- Event coverage

---

### 4.15 Account Page (`app/account/page.tsx`)

**Features:**
- User profile information
- Order history
- Saved addresses
- Account settings
- Password change

---

### 4.16 Admin Products Page (`app/system/admin/products/page.tsx`)

**Features:**
- Product management dashboard
- Add/edit/delete products
- Product variants management
- Image upload
- Inventory tracking
- Protected route (admin role only)

**Components:**
- `<ProductTable />` - Data table with search/filter
- `<ProductForm />` - Add/edit product form
- `<VariantManager />` - Manage product variants
- `<ImageUploader />` - Multiple image upload

---

## 5. Core Components

### 5.1 Navigation (`components/layout/Navbar.tsx`)

**Features:**
- Sticky navigation bar
- Logo (BALLYLIKE*)
- Navigation links: Home, Shop, About, Explore, Gallery
- Search icon (opens search modal)
- Account icon (login/account dropdown)
- Wishlist icon with badge count
- Cart icon with badge count
- Mobile hamburger menu
- Scroll behavior: adds shadow on scroll

**Implementation:**
```typescript
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { useCartStore } from '@/lib/stores/cartStore'
import { useWishlistStore } from '@/lib/stores/wishlistStore'
import { MobileMenu } from './MobileMenu'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()
  const cartItems = useCartStore((state) => state.getTotalItems())
  const wishlistItems = useWishlistStore((state) => state.items.length)
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all ${
      scrolled ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      {/* Navbar content */}
    </nav>
  )
}
```

---

### 5.2 Footer (`components/layout/Footer.tsx`)

**Sections:**
1. **About**: Brand description, mission
2. **Shop**: Links to categories
3. **Info**: Shipping, Returns, FAQ
4. **Connect**: Social media links (Instagram, TikTok, Facebook)
5. **Newsletter**: Email signup form
6. **Bottom Bar**: Copyright, terms, privacy policy

**Social Links:**
- Instagram: @ballylike_shop
- TikTok: @ballylike
- Facebook: /ballylikebrand

---

### 5.3 Product Card (`components/product/ProductCard.tsx`)

**Structure:**
```
<div class="product-card">
  <div class="image-wrapper">
    <Image src={product.main_image} />
    <div class="overlay"> {/* Shows on hover */}
      <button>Add to Cart</button>
      <button>Add to Wishlist</button>
      <button>Quick View</button>
    </div>
  </div>
  <div class="product-info">
    <h3>{product.name}</h3>
    <p class="category">{product.category}</p>
    <div class="price">
      {product.compare_at_price && (
        <span class="compare-price">${product.compare_at_price}</span>
      )}
      <span class="current-price">${product.base_price}</span>
    </div>
  </div>
</div>
```

**Interactions:**
- Hover: Show overlay with action buttons
- Click card: Navigate to product detail page
- Click "Add to Cart": Add product to cart with toast notification
- Click "Add to Wishlist": Toggle wishlist state
- Click "Quick View": Open modal with product details

---

### 5.4 Button Component (`components/ui/Button.tsx`)

**Variants:**
- Primary: Orange background, white text
- Secondary: Black background, white text
- Outline: White background, black border
- Ghost: Transparent background, hover effect

---

### 5.5 Modal Component (`components/ui/Modal.tsx`)

**Uses:**
- Quick view product
- Authentication forms
- Cart drawer
- Privacy policy
- Image lightbox

---

## 6. Animations & Interactions

### 6.1 Scroll Animations (Framer Motion)

**Fade In On Scroll:**
```typescript
// components/animations/FadeIn.tsx
'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export function FadeIn({ children, delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  )
}
```

**Slide In Animations:**
- From left, right, top, bottom
- Use for product cards, sections

---

### 6.2 Page Transitions

**Route transitions:**
```typescript
// app/template.tsx
'use client'

import { motion } from 'framer-motion'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
```

---

### 6.3 Hover Effects

**Product Cards:**
- Scale up image slightly on hover
- Show overlay with buttons
- Smooth transitions (0.3s cubic-bezier)

**Buttons:**
- Background color transition
- Slight scale effect
- Shadow on hover

---

## 7. State Management

### 7.1 Zustand Stores

Use Zustand for global state management:

1. **Cart Store** (`lib/stores/cartStore.ts`)
   - Cart items array
   - Add/remove/update items
   - Calculate totals
   - Persist to localStorage
   - Sync with Supabase for authenticated users

2. **Wishlist Store** (`lib/stores/wishlistStore.ts`)
   - Wishlist items array
   - Add/remove items
   - Check if item in wishlist
   - Sync with Supabase

3. **Auth Store** (`lib/stores/authStore.ts`)
   - User data
   - Authentication state
   - Login/logout/signup functions

---

## 8. Supabase Integration

### 8.1 Client Setup

**Browser Client:**
```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Server Client:**
```typescript
// lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}
```

### 8.2 Middleware for Auth

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options) {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/system/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // Check if user has admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Protect account routes
  if (request.nextUrl.pathname.startsWith('/account')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/account/:path*', '/system/admin/:path*']
}
```

---

## 9. SEO Implementation

### 9.1 Metadata API

**Page Metadata:**
```typescript
// app/shop/page.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Online Shopping Zimbabwe Clothes | BALLYLIKE - Trending Unisex Fashion',
  description: 'Online shopping Zimbabwe clothes - Shop BALLYLIKE\'s faith-driven trending fashion and lifestyle apparel. Premium unisex streetwear with free shipping.',
  keywords: ['online shopping zimbabwe clothes', 'online clothing shop zimbabwe', 'trending fashion zimbabwe'],
  openGraph: {
    title: 'Shop BALLYLIKE - Faith-Driven Fashion',
    description: 'Zimbabwe\'s best online clothing shop for faith-driven streetwear.',
    url: 'https://www.ballylike.co.zw/shop',
    siteName: 'BALLYLIKE',
    images: ['/assets/images/og-image-shop.jpg'],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop BALLYLIKE - Premium Streetwear Collections',
    description: 'Browse exclusive collections of faith-driven streetwear.',
    images: ['/assets/images/twitter-card-shop.jpg'],
    site: '@ballylike',
  },
  alternates: {
    canonical: 'https://www.ballylike.co.zw/shop',
  },
}
```

### 9.2 JSON-LD Structured Data

```typescript
// components/StructuredData.tsx
export function ProductStructuredData({ product }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.main_image,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: 'BALLYLIKE',
    },
    offers: {
      '@type': 'Offer',
      price: product.base_price,
      priceCurrency: 'USD',
      availability: product.is_active ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  }
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
```

### 9.3 Sitemap

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  
  // Get all products
  const { data: products } = await supabase
    .from('products')
    .select('slug, updated_at')
    .eq('is_active', true)
  
  const productUrls = products?.map((product) => ({
    url: `https://www.ballylike.co.zw/product/${product.slug}`,
    lastModified: product.updated_at,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) || []
  
  return [
    {
      url: 'https://www.ballylike.co.zw',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://www.ballylike.co.zw/shop',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://www.ballylike.co.zw/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...productUrls,
  ]
}
```

### 9.4 Robots.txt

```typescript
// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/system/admin/'],
    },
    sitemap: 'https://www.ballylike.co.zw/sitemap.xml',
  }
}
```

---

## 10. Performance Optimization

### 10.1 Image Optimization

**Use Next.js Image component:**
```typescript
import Image from 'next/image'

<Image
  src={product.main_image}
  alt={product.name}
  width={500}
  height={500}
  quality={85}
  placeholder="blur"
  blurDataURL="/placeholder.jpg"
/>
```

### 10.2 Code Splitting

- Use dynamic imports for heavy components
- Lazy load below-the-fold content

```typescript
import dynamic from 'next/dynamic'

const FitCheck = dynamic(() => import('@/components/FitCheck'), {
  loading: () => <p>Loading...</p>,
})
```

### 10.3 Caching Strategy

- Use Next.js built-in caching for API routes
- Implement Supabase query caching
- Use React Query for data fetching

---

## 11. Testing

### 11.1 Unit Tests (Jest + React Testing Library)

Test components, hooks, utilities:
```typescript
// __tests__/components/ProductCard.test.tsx
import { render, screen } from '@testing-library/react'
import { ProductCard } from '@/components/product/ProductCard'

describe('ProductCard', () => {
  it('renders product information', () => {
    const product = {
      id: '1',
      name: 'Test Product',
      price: 19.99,
      image: '/test.jpg',
    }
    
    render(<ProductCard product={product} />)
    expect(screen.getByText('Test Product')).toBeInTheDocument()
  })
})
```

### 11.2 E2E Tests (Playwright)

Test critical user flows:
- User registration and login
- Add to cart and checkout
- Product search and filtering
- Wishlist functionality

---

## 12. Deployment

### 12.1 Vercel Deployment

**vercel.json:**
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}
```

### 12.2 Environment Variables

**Required:**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-only)

---

## 13. Dependencies

### 13.1 Core Dependencies

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "typescript": "^5.4.0",
    "@supabase/ssr": "^0.5.0",
    "@supabase/supabase-js": "^2.45.0",
    "zustand": "^4.5.0",
    "framer-motion": "^11.0.0",
    "react-hook-form": "^7.51.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    "tailwindcss": "^3.4.0",
    "@headlessui/react": "^2.0.0",
    "@heroicons/react": "^2.1.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "sharp": "^0.33.0",
    "react-hot-toast": "^2.4.0",
    "embla-carousel-react": "^8.0.0",
    "date-fns": "^3.3.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^8",
    "eslint-config-next": "14.2.0",
    "prettier": "^3.2.0",
    "prettier-plugin-tailwindcss": "^0.5.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "jest": "^29.0.0",
    "@playwright/test": "^1.40.0"
  }
}
```

---

## 14. Implementation Checklist

### Phase 1: Setup & Core Structure (Week 1)
- [ ] Initialize Next.js project with TypeScript
- [ ] Configure Tailwind CSS
- [ ] Set up Supabase client and server utilities
- [ ] Create project folder structure
- [ ] Set up Zustand stores (cart, wishlist, auth)
- [ ] Implement authentication system
- [ ] Create Navbar and Footer components
- [ ] Set up middleware for auth protection

### Phase 2: Product System (Week 2)
- [ ] Create Product Card component
- [ ] Build Shop page with filtering/sorting
- [ ] Implement Product Detail page
- [ ] Create product image gallery
- [ ] Add variant selection
- [ ] Integrate with Supabase products table
- [ ] Implement search functionality

### Phase 3: Cart & Checkout (Week 3)
- [ ] Build Cart page
- [ ] Create Checkout flow
- [ ] Implement order creation
- [ ] Add payment method selection
- [ ] Create order confirmation page
- [ ] Set up email notifications (optional)

### Phase 4: User Features (Week 4)
- [ ] Build Wishlist system
- [ ] Create Account page
- [ ] Implement order history
- [ ] Build Login/Signup pages
- [ ] Add password reset
- [ ] Create profile management

### Phase 5: Content Pages (Week 5)
- [ ] Build Home page with all sections
- [ ] Create About page
- [ ] Build Explore page
- [ ] Implement Gallery with comments/likes
- [ ] Create SEO content pages (trending, guide, lifestyle)

### Phase 6: Interactive Features (Week 6)
- [ ] Build Faith Meter quiz
- [ ] Create Fit Check with image upload
- [ ] Implement style Quiz
- [ ] Add social sharing functionality
- [ ] Create results visualization

### Phase 7: Admin System (Week 7)
- [ ] Build admin dashboard
- [ ] Create product management interface
- [ ] Implement image upload system
- [ ] Add inventory management
- [ ] Create order management

### Phase 8: Optimization & Testing (Week 8)
- [ ] Add loading states and skeletons
- [ ] Implement error boundaries
- [ ] Optimize images
- [ ] Add animations with Framer Motion
- [ ] Write unit tests
- [ ] Perform E2E testing
- [ ] SEO audit and optimization
- [ ] Performance testing

### Phase 9: Deployment (Week 9)
- [ ] Set up Vercel project
- [ ] Configure environment variables
- [ ] Set up custom domain
- [ ] Configure analytics
- [ ] Set up error monitoring
- [ ] Create deployment pipeline
- [ ] Final testing on production

---

## 15. Key Features Summary

### E-commerce Features
✅ Product catalog with categories and filtering
✅ Product detail pages with variants
✅ Shopping cart with persistence
✅ Wishlist functionality
✅ Checkout process
✅ Order management
✅ User authentication (email/password + social)
✅ Account dashboard

### Content Features
✅ Blog-style content pages for SEO
✅ Gallery with social interactions (likes, comments)
✅ About page with team profiles
✅ Static content pages

### Interactive Features
✅ Faith Meter - values alignment quiz
✅ Fit Check - outfit rating with AI
✅ Style Quiz - personality assessment

### Technical Features
✅ Server-side rendering (SSR)
✅ Static site generation (SSG)
✅ Image optimization
✅ SEO optimization
✅ Mobile-responsive design
✅ Real-time database with Supabase
✅ Authentication & authorization
✅ Admin dashboard
✅ Analytics ready
✅ Performance optimized

---

## 16. Design Tokens

Use these consistently throughout the project:

### Colors
```typescript
// Use Tailwind classes
bg-brand-primary // #FF6600
bg-brand-black // #000000
bg-brand-white // #FFFFFF
text-brand-gray-500 // #5A5A5A
```

### Spacing
```typescript
// Spacing scale (use Tailwind)
space-xs: 0.5rem  // 8px
space-sm: 1rem    // 16px
space-md: 2rem    // 32px
space-lg: 3rem    // 48px
space-xl: 4rem    // 64px
```

### Typography
```typescript
// Text sizes (Tailwind)
text-xs   // 11px
text-sm   // 13px
text-base // 15px
text-lg   // 20px
text-xl   // 24px
text-2xl  // 32px
text-3xl  // 40px
text-4xl  // 56px
```

### Transitions
```typescript
transition-fast: 200ms cubic-bezier(0.4, 0, 0.2, 1)
transition-base: 300ms cubic-bezier(0.4, 0, 0.2, 1)
```

---

## 17. Brand Voice & Content Guidelines

### Tone
- **Bold & Confident**: "JUST DO IT" energy
- **Faith-driven**: Incorporate faith messaging naturally
- **Urban & Authentic**: Speak to street culture
- **Empowering**: Inspire action and self-expression

### Messaging Pillars
1. **Faith**: Purpose-driven fashion, values alignment
2. **Urban Culture**: Streetwear, trends, authenticity
3. **Artistic Expression**: Creativity, individuality, style

### Example Copy
- Hero CTA: "STEP INTO PURPOSE" or "WEAR YOUR FAITH"
- Product descriptions: Short, punchy, benefit-focused
- About page: Story-driven, mission-focused
- CTAs: Action-oriented ("SHOP NOW", "EXPLORE", "JOIN US")

---

## 18. Success Metrics

Track these KPIs:
- Page load time (< 3s)
- Time to Interactive (< 5s)
- Conversion rate (cart to checkout)
- Bounce rate
- Average order value
- User registration rate
- Return visitor rate
- Mobile vs desktop usage

---

## 19. Future Enhancements (Post-Launch)

### v1.1
- [ ] Customer reviews and ratings
- [ ] Product size guide
- [ ] Live chat support
- [ ] Newsletter system
- [ ] Loyalty program

### v1.2
- [ ] Mobile app (React Native)
- [ ] Gift cards
- [ ] Subscription boxes
- [ ] Advanced product recommendations
- [ ] AR try-on feature

### v2.0
- [ ] Multi-currency support
- [ ] International shipping
- [ ] Wholesale/B2B portal
- [ ] Affiliate program
- [ ] Advanced analytics dashboard

---

## 20. Notes & Best Practices

### Code Quality
- Use TypeScript strictly (no `any` types)
- Follow Next.js App Router conventions
- Write semantic HTML
- Use Tailwind utility classes
- Keep components small and focused
- Write self-documenting code

### Performance
- Use Next.js Image for all images
- Implement lazy loading
- Minimize client-side JavaScript
- Use server components by default
- Implement proper caching strategies

### Accessibility
- Use semantic HTML elements
- Add ARIA labels where needed
- Ensure keyboard navigation works
- Maintain color contrast ratios
- Test with screen readers

### Security
- Never expose Supabase service role key in client
- Implement Row Level Security (RLS) policies
- Validate all user inputs
- Use parameterized queries
- Implement rate limiting on API routes

### SEO
- Use proper heading hierarchy (h1 → h2 → h3)
- Add alt text to all images
- Implement structured data
- Create XML sitemap
- Add canonical URLs
- Optimize for Core Web Vitals

---

## Final Notes

This is a comprehensive recreation guide. The AI agent should:

1. **Follow the structure exactly** - Use the folder structure provided
2. **Maintain brand identity** - Use exact colors, fonts, and design principles
3. **Implement all features** - Don't skip any functionality from the original
4. **Use modern best practices** - TypeScript, Server Components, proper state management
5. **Optimize performance** - Image optimization, code splitting, caching
6. **Ensure accessibility** - WCAG 2.1 AA compliance
7. **SEO optimization** - Metadata, structured data, sitemap
8. **Mobile-first** - Responsive design that works on all devices

The existing Supabase database should be **maintained and reused**. Only the frontend is being migrated from vanilla JS to Next.js/React.

**Domain**: ballylike.co.zw
**Location**: Harare, Zimbabwe
**Contact**: info@ballylike.co.zw | +263781457106

This guide provides everything needed to recreate the BALLYLIKE website in Next.js/React while maintaining all functionality, design, and brand identity.
