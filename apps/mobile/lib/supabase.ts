import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

const supabaseUrl =
  Constants.expoConfig?.extra?.supabaseUrl ?? process.env.SUPABASE_URL;
const supabasePublishableKey =
  Constants.expoConfig?.extra?.supabasePublishableKey ??
  process.env.SUPABASE_PUBLISHABLE_KEY;

export function createSupabaseClient() {
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "Missing mobile Supabase environment variables: SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY."
    );
  }

  return createClient(supabaseUrl, supabasePublishableKey);
}
