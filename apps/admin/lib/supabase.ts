import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

export function createSupabaseClient() {
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "Missing admin Supabase environment variables: SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY."
    );
  }

  return createClient(supabaseUrl, supabasePublishableKey);
}

export function createSupabaseAdminClient() {
  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error(
      "Missing admin Supabase service environment variables: SUPABASE_URL and SUPABASE_SECRET_KEY."
    );
  }

  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
