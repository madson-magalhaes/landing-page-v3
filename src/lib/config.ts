/**
 * Config pública do tenant. Nesta etapa é lida de env vars locais; quando o
 * Supabase entrar, isto vira um fetch em core.tenants (ARQ_02 §5,
 * GET /api/tenant/:id) — nunca retornando token CAPI, só o que já é público
 * no HTML de qualquer forma (ARQ_04 §3.2).
 */

export const config = {
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  whatsappMessage:
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ?? "Quero saber mais",
  // Schema do cliente (v2 schema-per-client). Ex: schema_test, eng_pratice
  schemaId: process.env.NEXT_PUBLIC_SCHEMA_ID ?? "",
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
