export const MAX_BODY_BYTES = 10 * 1024; // 10KB

export function validateRefId(
  value: unknown,
): { ok: boolean; data?: string; error?: string } {
  if (typeof value !== "string") {
    return { ok: false, error: "ref_id deve ser string" };
  }
  if (value.length < 8 || value.length > 100) {
    return { ok: false, error: "ref_id deve ter 8-100 caracteres" };
  }
  if (!/^[A-Z0-9]+$/.test(value)) {
    return { ok: false, error: "ref_id deve conter apenas A-Z e 0-9" };
  }
  return { ok: true, data: value };
}

export function sanitizeFbcFbp(value: unknown): string | null {
  if (!value) return null;
  if (typeof value !== "string") return null;
  if (value.length > 2048) return null;
  return value;
}

export function sanitizeOptionalString(
  value: unknown,
  maxLength: number = 255,
): string | null {
  if (!value) return null;
  if (typeof value !== "string") return null;
  if (value.length > maxLength) return null;
  return value;
}

export function sanitizeUserAgent(value: unknown): string | null {
  if (!value) return null;
  if (typeof value !== "string") return null;
  if (value.length > 512) return null;
  return value;
}
