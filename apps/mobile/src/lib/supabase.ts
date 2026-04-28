import "react-native-url-polyfill/auto";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

const supabaseUrl = normalizeSupabaseUrl(
  Constants.expoConfig?.extra?.supabaseUrl ?? process.env.SUPABASE_URL
);
const supabasePublishableKey =
  Constants.expoConfig?.extra?.supabasePublishableKey ??
  process.env.SUPABASE_PUBLISHABLE_KEY;

export function createSupabaseClient() {
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "Missing mobile Supabase environment variables: SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY."
    );
  }

  return createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: false,
      persistSession: true,
      storage: AsyncStorage
    }
  });
}

export const supabase = createSupabaseClient();

function normalizeSupabaseUrl(value: string | undefined) {
  return value?.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
}
