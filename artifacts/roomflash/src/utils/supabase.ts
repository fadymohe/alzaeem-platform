import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://cfpmbasxvjlcfcteyyaa.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_sCozsAhhHZ9v9nWEkiNVlQ_Ne5IoXq2';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});
