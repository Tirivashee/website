// Supabase Configuration
// Replace these with your actual Supabase project credentials from https://app.supabase.com

const SUPABASE_CONFIG = {
  url: 'https://nmjocsaawzfcdfjecrrz.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tam9jc2Fhd3pmY2RmamVjcnJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3NzU3MzksImV4cCI6MjA4MzM1MTczOX0.zm8dD7s4LlxM2RDqzP8QsIRRk14jWpKM4AkoKg2zZek'
};

// Check if Supabase library is loaded
if (typeof supabase === 'undefined') {
  console.error('Supabase library not loaded. Make sure to include the Supabase CDN script before this file.');
}

// Initialize Supabase client
const supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.supabaseClient = supabaseClient;
  console.log('Supabase client initialized successfully');
}
