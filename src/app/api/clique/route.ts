import { NextResponse } from "next/server";
import {
  MAX_BODY_BYTES,
  sanitizeFbcFbp,
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
      "[api/clique] NEXT_PUBLIC_SCHEMA_ID não configurado — ver .env.example",
    );
    return jsonError("schema não configurado", 500);
  }

  const fbc = sanitizeFbcFbp(record.fbc);
  const fbp = sanitizeFbcFbp(record.fbp);

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.schema(config.schemaId).rpc(
      "registrar_clique_wpp_landing",
      {
        p_ref_id: refIdResult.data,
        p_fbc: fbc,
        p_fbp: fbp,
      },
    );

    if (error) {
      console.error("[api/clique] falha ao gravar no Supabase", error.message);
      return jsonError("falha ao registrar clique", 502);
    }
  } catch (err) {
    console.error("[api/clique] erro inesperado", err);
    return jsonError("erro inesperado", 500);
  }

  const response: ApiOkResponse = { ok: true, ref_id: refIdResult.data };
  return NextResponse.json(response);
}

function jsonError(error: string, status: number): NextResponse {
  const body: ApiErrorResponse = { ok: false, error };
  return NextResponse.json(body, { status });
}
