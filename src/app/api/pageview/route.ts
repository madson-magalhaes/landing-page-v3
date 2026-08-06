import { NextResponse } from "next/server";
import {
  MAX_BODY_BYTES,
  sanitizeFbcFbp,
  sanitizeOptionalString,
  sanitizeUserAgent,
  validateRefId,
} from "@/lib/security/validation";
import { config, isSchemaConfigured } from "@/lib/config";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { ApiErrorResponse, ApiOkResponse } from "@/types/tracking";

export async function POST(request: Request): Promise<NextResponse> {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > MAX_BODY_BYTES) {
    return jsonError("payload excede o limite permitido", 413);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("corpo inválido: esperado JSON", 400);
  }

  if (typeof body !== "object" || body === null) {
    return jsonError("corpo inválido: esperado objeto JSON", 400);
  }

  const record = body as Record<string, unknown>;
  const refIdResult = validateRefId(record.ref_id);
  if (!refIdResult.ok || !refIdResult.data) {
    return jsonError(refIdResult.error ?? "ref_id inválido", 400);
  }

  if (!isSchemaConfigured()) {
    console.error(
      "[api/pageview] NEXT_PUBLIC_SCHEMA_ID não configurado — ver .env.example",
    );
    return jsonError("schema não configurado", 500);
  }

  const sanitized = {
    ref_id: refIdResult.data,
    landing_url: sanitizeOptionalString(record.landing_url, 2048),
    user_agent: sanitizeUserAgent(record.user_agent),
    fbc: sanitizeFbcFbp(record.fbc),
    fbp: sanitizeFbcFbp(record.fbp),
    fbclid: sanitizeOptionalString(record.fbclid),
    utm_source: sanitizeOptionalString(record.utm_source),
    utm_medium: sanitizeOptionalString(record.utm_medium),
    utm_campaign: sanitizeOptionalString(record.utm_campaign),
    utm_content: sanitizeOptionalString(record.utm_content),
    utm_term: sanitizeOptionalString(record.utm_term),
    utm_id: sanitizeOptionalString(record.utm_id),
  };

  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    null;

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.schema(config.schemaId).rpc(
      "registrar_pageview_landing",
      {
        p_ref_id: sanitized.ref_id,
        p_fbc: sanitized.fbc,
        p_fbp: sanitized.fbp,
        p_fbclid: sanitized.fbclid,
        p_utm_source: sanitized.utm_source,
        p_utm_medium: sanitized.utm_medium,
        p_utm_campaign: sanitized.utm_campaign,
        p_utm_content: sanitized.utm_content,
        p_utm_term: sanitized.utm_term,
        p_landing_url: sanitized.landing_url,
        p_user_agent: sanitized.user_agent,
        p_client_ip: clientIp,
        p_utm_id: sanitized.utm_id,
      },
    );

    if (error) {
      console.error("[api/pageview] falha ao gravar no Supabase", error);
      return jsonError("falha ao registrar pageview", 502);
    }
  } catch (err) {
    console.error("[api/pageview] erro inesperado", err);
    return jsonError("erro inesperado", 500);
  }

  const response: ApiOkResponse = { ok: true, ref_id: sanitized.ref_id };
  return NextResponse.json(response);
}

function jsonError(error: string, status: number): NextResponse {
  const body: ApiErrorResponse = { ok: false, error };
  return NextResponse.json(body, { status });
}
