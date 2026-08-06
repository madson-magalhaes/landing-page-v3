import { createClient } from "@supabase/supabase-js";
import { config } from "@/lib/config";

export function getSupabaseAdmin() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY não configurada");
  }

  return createClient(config.supabaseUrl, serviceRoleKey);
}

export function getSupabaseClient() {
  return createClient(config.supabaseUrl, config.supabaseAnonKey);
}
