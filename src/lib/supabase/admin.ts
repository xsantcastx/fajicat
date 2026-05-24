import { createClient } from "@supabase/supabase-js";

// Service-role client for server-only contexts (webhooks, order creation).
// Bypasses Row-Level Security — NEVER import this into client code.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
