import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Temporary console log to debug environment variables
console.log("VITE_SUPABASE_URL:", supabaseUrl ? "Loaded" : "MISSING");
console.log("VITE_SUPABASE_ANON_KEY:", supabaseAnonKey ? "Loaded" : "MISSING");
console.log("All VITE_ env variables:", Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));


if (!supabaseUrl) {
  throw new Error("VITE_SUPABASE_URL is missing. Please set it in your .env file.");
}

if (!supabaseAnonKey) {
  throw new Error("VITE_SUPABASE_ANON_KEY is missing. Please set it in your .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);