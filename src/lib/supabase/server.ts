import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client for use in Server Actions and API routes.
 * Uses same env vars as client; no auth cookies in this app.
 */
export function createClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  return createSupabaseClient(url, anonKey);
}
