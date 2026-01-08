// Authentication Module
// Handles all authentication-related functionality

class AuthManager {
  constructor() {
    this.user = null;
    this.session = undefined; // Set to undefined initially to indicate not yet loaded
    this.init();
  }

  async init() {
    // Get initial session
    const { data: { session } } = await supabaseClient.auth.getSession();
    this.session = session;
    this.user = session?.user || null;

    // Listen for auth state changes
    supabaseClient.auth.onAuthStateChange(async (_event, session) => {
      this.session = session;
      this.user = session?.user || null;
      this.updateUIForAuthState();
      
      // Reload cart and wishlist when auth state changes
      if (window.cartManager) {
        await window.cartManager.init();
      }
      if (window.wishlistManager) {
        await window.wishlistManager.init();
      }
    });

    this.updateUIForAuthState();
  }

  async signUp(email, password, fullName) {
    try {
      console.log('Starting signup process for:', email);
      
      if (!supabaseClient) {
        console.error('Supabase client not initialized');
        return { success: false, error: 'Authentication system not initialized' };
      }

      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      console.log('Supabase signUp response:', { data, error });

      if (error) {
        console.error('Supabase signup error:', error);
        throw error;
      }

      // Create user profile in database (optional - may fail if profiles table doesn't exist)
      if (data.user) {
        console.log('User created, attempting to create profile...');
        try {
          await this.createUserProfile(data.user.id, fullName, email);
        } catch (profileError) {
          console.warn('Profile creation failed (non-critical):', profileError);
          // Don't fail the signup if profile creation fails
        }
      }

      console.log('Signup successful');
      return { success: true, data };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message || 'Unknown error occurred' };
    }
  }

  async signIn(email, password) {
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  }

  async signOut() {
    try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) throw error;
      
      // Clear local cart and wishlist
      localStorage.removeItem('cart');
      localStorage.removeItem('wishlist');
      
      window.location.href = '/index.html';
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  }

  // Alias for logout (same as signOut)
  async logout() {
    return await this.signOut();
  }

  async createUserProfile(userId, fullName, email) {
    try {
      console.log('Creating user profile for:', userId);
      
      const { data, error } = await supabaseClient
        .from('profiles')
        .insert([
          {
            id: userId,
            full_name: fullName,
            email: email,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) {
        console.error('Profile creation error:', error);
        throw error;
      }
      
      console.log('Profile created successfully');
    } catch (error) {
      console.error('Error creating profile:', error);
      // Rethrow to let caller handle
      throw error;
    }
  }

  isAuthenticated() {
    return !!this.user;
  }

  getUserId() {
    return this.user?.id || null;
  }

  getUserEmail() {
    return this.user?.email || null;
  }

  getUserName() {
    return this.user?.user_metadata?.full_name || this.user?.email?.split('@')[0] || 'User';
  }

  updateUIForAuthState() {
    const authLinks = document.querySelectorAll('.auth-required');
    const guestLinks = document.querySelectorAll('.guest-only');
    const userNameElements = document.querySelectorAll('.user-name');

    if (this.isAuthenticated()) {
      // Show authenticated user elements
      authLinks.forEach(el => el.style.display = '');
      guestLinks.forEach(el => el.style.display = 'none');
      userNameElements.forEach(el => el.textContent = this.getUserName());
    } else {
      // Show guest elements
      authLinks.forEach(el => el.style.display = 'none');
      guestLinks.forEach(el => el.style.display = '');
    }

    // Update navbar
    this.updateNavbar();
  }

  updateNavbar() {
    // Update account icon based on auth state
    const accountIcon = document.getElementById('accountIcon');
    
    if (accountIcon) {
      if (this.isAuthenticated()) {
        // User is logged in - show account link
        accountIcon.href = 'account.html';
        accountIcon.setAttribute('aria-label', 'Account');
        accountIcon.setAttribute('title', 'Account');
        accountIcon.classList.add('navbar-icon-active');
      } else {
        // User is not logged in - show login link
        accountIcon.href = 'users/login.html';
        accountIcon.setAttribute('aria-label', 'Login');
        accountIcon.setAttribute('title', 'Login');
        accountIcon.classList.remove('navbar-icon-active');
      }
    }
  }
}

// Initialize Auth Manager
if (typeof window !== 'undefined' && window.supabaseClient) {
  window.authManager = new AuthManager();
}
