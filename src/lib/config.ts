export const config = {
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  schemaId: process.env.NEXT_PUBLIC_SCHEMA_ID ?? "",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  whatsappMessage: process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ?? "Quero saber mais",
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
