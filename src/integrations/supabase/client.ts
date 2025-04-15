
import { createClient } from '@supabase/supabase-js';

// Use fixed values for the URL and key
const supabaseUrl = 'https://srncxxtvmcdcsvqwtjgu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNybmN4eHR2bWNkY3N2cXd0amd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2ODg3NTgsImV4cCI6MjA2MDI2NDc1OH0.SZBPBuJlv5lC5u9PmuwlpsY632F8f9TSyv1Xxcbpy68';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
