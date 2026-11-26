/** Browser-side Meta Pixel helpers for ad landing pages (no-op without a pixel). */

type Fbq = (...args: unknown[]) => void;

function fbq(): Fbq | null {
  if (typeof window === "undefined") return null;
  return ((window as unknown as { fbq?: Fbq }).fbq ?? null) as Fbq | null;
}

export function trackPixel(event: string, params: Record<string, unknown>, eventId?: string) {
  const f = fbq();
  if (!f) return;
  if (eventId) f("track", event, params, { eventID: eventId });
  else f("track", event, params);
}

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.split("; ").find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
}

/** _fbp / _fbc for the Conversions API; builds fbc from ?fbclid= when the cookie isn't set yet. */
export function getMetaClickIds(): { fbp?: string; fbc?: string } {
  const fbp = readCookie("_fbp");
  let fbc = readCookie("_fbc");
  if (!fbc && typeof window !== "undefined") {
    const fbclid = new URLSearchParams(window.location.search).get("fbclid");
    if (fbclid) fbc = `fb.1.${Date.now()}.${fbclid}`;
  }
  return { fbp, fbc };
}
