import { createClient } from '@supabase/supabase-js';

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl.startsWith('http')) {
  supabaseUrl = 'https://placeholder.supabase.co';
}
if (!supabaseAnonKey || supabaseAnonKey.includes('your_')) {
  supabaseAnonKey = 'placeholder';
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
