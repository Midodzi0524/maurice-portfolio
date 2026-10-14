// assets/js/supabase-client.js
// Safe connection to Supabase

const SUPABASE_URL = 'https://anjcknkqqpgvmrbjaisn.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_C2dzFZ4kh1m7W6WAMDgJMg_9fUfhsUN';

// Create the client and make it available globally
const { createClient } = supabase;
window.supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
