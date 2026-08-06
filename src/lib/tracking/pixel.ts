export function trackLead(eventId: string): void {
  if (typeof window === "undefined") return;
  if (typeof window.fbq === "undefined") {
    console.warn("[pixel] fbq não disponível");
    return;
  }

  try {
    window.fbq("trackEvent", "Lead", { event_id: eventId });
  } catch (err) {
    console.warn("[pixel] erro ao disparar fbq", err);
  }
}
