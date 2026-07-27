import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!url || !key || url === "your-supabase-url" || key === "your-supabase-anon-key") {
    return null;
  }
  return createClient(url, key);
};

export const supabase = (() => {
  const result = getSupabaseClient();
  if (!result) {
    if (typeof window !== "undefined") {
      console.error("Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
    }
    return null as unknown as SupabaseClient;
  }
  return result;
})();
