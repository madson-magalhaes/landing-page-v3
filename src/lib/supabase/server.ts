import { createClient } from "@supabase/supabase-js";
import { config } from "@/lib/config";

let adminClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseAdmin() {
  if (adminClient) return adminClient;

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY não configurada. Configure em Vercel > Settings > Environment Variables",
    );
  }

  adminClient = createClient(config.supabaseUrl, serviceRoleKey);
  return adminClient;
}

export function getSupabaseClient() {
  return createClient(config.supabaseUrl, config.supabaseAnonKey);
}
