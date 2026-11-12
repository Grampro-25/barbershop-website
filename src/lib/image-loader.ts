/**
 * Custom loader for next/image.
 *
 * Unsplash photos are already served by an image CDN that resizes and converts
 * to WebP/AVIF on request, so we ask it for the exact width instead of
 * proxying every photo through the Next.js server. next/image still builds the
 * responsive `srcset`, lazy-loads and reserves layout space.
 *
 * Local files (e.g. /images/my-cut.jpg in /public) are returned as they are —
 * export them at a sensible size (around 1600px wide) before adding them.
 */
export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (src.startsWith("https://images.unsplash.com/")) {
    const url = new URL(src);
    url.searchParams.set("auto", "format");
    url.searchParams.set("fit", "crop");
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality ?? 70));
    return url.toString();
  }
  return src;
}
