import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// Replace these with your actual Supabase project values
const supabaseUrl = 'https://slvxiposfuukhpcbbqgj.supabase.co'; // e.g., 'https://your-project.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsdnhpcG9zZnV1a2hwY2JicWdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNjEyOTEsImV4cCI6MjA4MjYzNzI5MX0.EWFqbMLxf65KozsDxe5lTQMkmiIF-DCMqp-6dzfk7GQ'; // Replace with your actual anon key

// Check if Supabase is configured
const isSupabaseConfigured = supabaseUrl !== 'YOUR_SUPABASE_URL' && 
                             supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase client
let supabase = null;

if (isSupabaseConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('Supabase initialization error:', error);
  }
} else {
  console.warn('⚠️ Supabase not configured yet. Image uploads will not work.');
  console.warn('Please configure Supabase in src/supabase/config.js');
}

export { supabase };
export default supabase;