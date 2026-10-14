// assets/js/supabase-client.js
// This file connects the website to your Supabase database.
// The "anon" / Publishable key is safe to use in the front-end
// because we turned on Row Level Security earlier.

const SUPABASE_URL = 'https://anjcknkqqpgvmrbjaisn.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_C2dzFZ4kh1m7W6WAMDgJMg_9fUfhsUN';

// Create the Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
