// Authentication Module
// Handles all authentication-related functionality

class AuthManager {
  constructor() {
    this.user = null;
    this.session = null;
    this.init();
  }

  async init() {
    // Get initial session
    const { data: { session } } = await supabaseClient.auth.getSession();
    this.session = session;
    this.user = session?.user || null;

    // Listen for auth state changes
    supabaseClient.auth.onAuthStateChange((_event, session) => {
      this.session = session;
      this.user = session?.user || null;
      this.updateUIForAuthState();
    });

    this.updateUIForAuthState();
  }

  async signUp(email, password, fullName) {
    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) throw error;

      // Create user profile in database
      if (data.user) {
        await this.createUserProfile(data.user.id, fullName, email);
      }

      return { success: true, data };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
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

  async createUserProfile(userId, fullName, email) {
    try {
      const { error } = await supabaseClient
        .from('profiles')
        .insert([
          {
            id: userId,
            full_name: fullName,
            email: email,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;
    } catch (error) {
      console.error('Error creating profile:', error);
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
    const navbar = document.querySelector('.navbar-menu');
    if (!navbar) return;

    // Remove existing auth links
    const existingAuthLinks = navbar.querySelectorAll('.auth-link');
    existingAuthLinks.forEach(link => link.remove());

    if (this.isAuthenticated()) {
      // Add authenticated user links
      const cartLink = document.createElement('a');
      cartLink.href = '/cart.html';
      cartLink.className = 'navbar-link auth-link';
      cartLink.innerHTML = '🛒 CART';
      
      const wishlistLink = document.createElement('a');
      wishlistLink.href = '/wishlist.html';
      wishlistLink.className = 'navbar-link auth-link';
      wishlistLink.innerHTML = '🔖 WISHLIST';
      
      const accountLink = document.createElement('a');
      accountLink.href = '#';
      accountLink.className = 'navbar-link auth-link';
      accountLink.innerHTML = `👤 ${this.getUserName().toUpperCase()}`;
      
      const logoutLink = document.createElement('a');
      logoutLink.href = '#';
      logoutLink.className = 'navbar-link auth-link';
      logoutLink.innerHTML = 'LOGOUT';
      logoutLink.addEventListener('click', async (e) => {
        e.preventDefault();
        await this.signOut();
      });

      navbar.appendChild(cartLink);
      navbar.appendChild(wishlistLink);
      navbar.appendChild(accountLink);
      navbar.appendChild(logoutLink);
    } else {
      // Add guest links
      const loginLink = document.createElement('a');
      loginLink.href = '/users/login.html';
      loginLink.className = 'navbar-link auth-link guest-only';
      loginLink.innerHTML = 'LOGIN';
      
      const signupLink = document.createElement('a');
      signupLink.href = '/users/signup.html';
      signupLink.className = 'navbar-link auth-link guest-only';
      signupLink.innerHTML = 'SIGN UP';

      navbar.appendChild(loginLink);
      navbar.appendChild(signupLink);
    }
  }
}

// Initialize Auth Manager
if (typeof window !== 'undefined' && window.supabaseClient) {
  window.authManager = new AuthManager();
}
