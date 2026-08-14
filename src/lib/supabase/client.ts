import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

console.log({
  supabaseUrl: url,
  hasSupabaseKey: Boolean(key),
});

let client: SupabaseClient | null | undefined;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (client !== undefined) return client;

  if (!url || !key || url === "your-supabase-url" || key === "your-supabase-anon-key") {
    client = null;
    return null;
  }

  try {
    client = createClient(url, key);
  } catch {
    client = null;
  }

  return client;
};

let _supabase: SupabaseClient | null | undefined;

const getSupabaseInstance = (): SupabaseClient | null => {
  if (_supabase !== undefined) return _supabase;

  _supabase = getSupabaseClient();

  if (!_supabase && typeof window !== "undefined") {
    console.error("Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
    _supabase = null as unknown as SupabaseClient;
  }

  return _supabase;
};

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const instance = getSupabaseInstance();
    if (instance === null) {
      return undefined;
    }
    return (instance as unknown as Record<string | symbol, unknown>)[prop];
  },
  set(_target, prop, value) {
    const instance = getSupabaseInstance();
    if (instance === null) {
      return true;
    }
    return (instance as unknown as Record<string | symbol, unknown>)[prop] = value;
  },
  apply(_target, _thisArg, args) {
    const instance = getSupabaseInstance();
    if (instance === null) {
      return undefined;
    }
    return (instance as unknown as (...args: unknown[]) => unknown)(...args);
  },
});
