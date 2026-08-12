"use client";

import { useState } from "react";
import { config, isWhatsAppConfigured } from "@/lib/config";
import { getOrCreateRefId } from "@/components/analytics/MetaPixel";
import { buildEventId } from "@/lib/tracking/eventId";
import { trackLead } from "@/lib/tracking/pixel";
import type { CliqueWppPayload } from "@/types/tracking";

async function registrarClique(payload: CliqueWppPayload): Promise<void> {
  try {
    const res = await fetch("/api/clique", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    console.log("[clique]", `status ${res.status}`);
  } catch (err) {
    console.warn("[clique] falha ao registrar", err);
  }
}

function buildWhatsAppUrl(refId: string): string {
  const message = config.whatsappMessage.replace(/{cupom}/g, refId);
  return `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function readCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name}=([^;]*)`),
  );
  const value = match?.[1];
  return value ? decodeURIComponent(value) : null;
}

export function WhatsAppButton() {
  const [redirecting, setRedirecting] = useState(false);

  async function handleClick() {
    console.log("[clique] botão WhatsApp clicado");
    if (redirecting) return;
    setRedirecting(true);

    const refId = getOrCreateRefId();
    const eventId = buildEventId(refId, "clicou_wpp");
    console.log("[clique] ref_id/event_id", `${refId} / ${eventId}`);

    trackLead(eventId);

    const payload: CliqueWppPayload = {
      ref_id: refId,
      fbc: readCookie("_fbc"),
      fbp: readCookie("_fbp"),
    };

    await registrarClique(payload).finally(() => {
      if (!isWhatsAppConfigured()) {
        console.log("[clique] redirect abortado - número vazio");
        setRedirecting(false);
        return;
      }
      const url = buildWhatsAppUrl(refId);
      console.log("[clique] redirecionando para", url);
      window.location.href = url;
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={redirecting}
      className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
    >
      {redirecting ? "Te levando para o WhatsApp…" : "📱 Falar no WhatsApp"}
    </button>
  );
}
