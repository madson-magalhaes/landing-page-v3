function getEnv(key: string): string {
  if (typeof window === "undefined") return "";
  return (globalThis as any)[`__ENV_${key}`] || "";
}

export const config = {
  get metaPixelId() {
    return process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";
  },
  get supabaseUrl() {
    return process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  },
  get supabaseAnonKey() {
    return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  },
  get schemaId() {
    return process.env.NEXT_PUBLIC_SCHEMA_ID ?? "";
  },
  get whatsappNumber() {
    return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  },
  get whatsappMessage() {
    return process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ?? "Quero saber mais";
  },
} as const;

export function isPixelConfigured(): boolean {
  return config.metaPixelId.trim().length > 0;
}

export function isWhatsAppConfigured(): boolean {
  return config.whatsappNumber.trim().length > 0;
}

export function isSchemaConfigured(): boolean {
  return config.schemaId.trim().length > 0;
}
