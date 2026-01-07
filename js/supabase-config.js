// Supabase Configuration
// Replace these with your actual Supabase project credentials from https://app.supabase.com

const SUPABASE_CONFIG = {
  url: 'https://nmjocsaawzfcdfjecrrz.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tam9jc2Fhd3pmY2RmamVjcnJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3NzU3MzksImV4cCI6MjA4MzM1MTczOX0.zm8dD7s4LlxM2RDqzP8QsIRRk14jWpKM4AkoKg2zZek'
};

// Initialize Supabase client
const supabase = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.supabaseClient = supabase;
}
