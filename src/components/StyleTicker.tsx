import { hairStyles } from "@/data/styles";

/**
 * A slow, endless strip of style names between the hero and the catalog.
 * Pure CSS (see `.ticker-track` in globals.css): it pauses on hover and stops
 * entirely for visitors who prefer reduced motion. Decorative, so hidden from
 * screen readers — the catalog below lists every style properly.
 */
export function StyleTicker() {
  const names = hairStyles.map((s) => s.name);

  return (
    <div aria-hidden="true" className="overflow-hidden border-y border-cream/10 bg-charcoal py-5">
      <div className="ticker-track flex w-max">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center">
            {names.map((name) => (
              <li key={name} className="flex items-center">
                <span className="px-6 font-display text-3xl whitespace-nowrap text-cream/80 italic sm:text-4xl">
                  {name}
                </span>
                <span className="text-gold">✦</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
