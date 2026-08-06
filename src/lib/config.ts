export const config = {
  metaPixelId: typeof window !== "undefined" ? process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "" : "",
  supabaseUrl: typeof window !== "undefined" ? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "" : "",
  supabaseAnonKey: typeof window !== "undefined" ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "" : "",
  schemaId: typeof window !== "undefined" ? process.env.NEXT_PUBLIC_SCHEMA_ID ?? "" : "",
  whatsappNumber: typeof window !== "undefined" ? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "" : "",
  whatsappMessage: typeof window !== "undefined" ? process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ?? "Quero saber mais" : "Quero saber mais",
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
