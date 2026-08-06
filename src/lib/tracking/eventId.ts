export function buildEventId(refId: string, eventType: string): string {
  return `${refId}_${eventType}_${Date.now()}`;
}
