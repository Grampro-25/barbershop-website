"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Expand, Search, X } from "lucide-react";
import { hairStyles, styleCategories, type HairStyle, type StyleCategory } from "@/data/styles";
import { useBooking } from "@/components/BookingContext";
import { Lightbox, type LightboxItem } from "@/components/ui/Lightbox";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn, formatPrice, photo } from "@/lib/utils";

type Filter = "All" | StyleCategory;
const filters: Filter[] = ["All", ...styleCategories];

export function StyleCatalog() {
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState<number | null>(null);
  const { styleId, chooseStyle } = useBooking();
  const reduce = useReducedMotion();

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: hairStyles.length };
    for (const s of hairStyles) map[s.category] = (map[s.category] ?? 0) + 1;
    return map;
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return hairStyles.filter((s) => {
      if (filter !== "All" && s.category !== filter) return false;
      if (!q) return true;
      return `${s.name} ${s.category} ${s.description}`.toLowerCase().includes(q);
    });
  }, [filter, query]);

  const lightboxItems: LightboxItem[] = useMemo(
    () =>
      visible.map((s) => ({
        id: s.id,
        image: s.image,
        alt: `${s.name} reference photo`,
        title: s.name,
        subtitle: s.description,
      })),
    [visible],
  );

  const closePreview = useCallback(() => setPreview(null), []);

  const reset = () => {
    setFilter("All");
    setQuery("");
  };

  return (
    <section id="styles" aria-labelledby="styles-title" className="relative bg-ink py-20 sm:py-28 lg:py-36">
      <div className="container-page">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="01"
            label="The cut catalog"
            id="styles-title"
            title={
              <>
                Find Your <em className="text-gold">Perfect</em> Cut.
              </>
            }
            intro="Twenty-eight cuts and beard styles, each with a reference photo. Pick the one you want and we'll carry it straight into your booking."
          />
          <p className="eyebrow shrink-0 text-cream/50" aria-live="polite">
            Showing {visible.length} of {hairStyles.length}
          </p>
        </div>

        {/* Controls */}
        <div className="sticky top-16 z-30 -mx-5 mt-10 border-y border-cream/10 bg-ink/95 px-5 py-3 backdrop-blur-md sm:-mx-8 sm:px-8 lg:top-20 lg:-mx-12 lg:px-12">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div
              role="group"
              aria-label="Filter styles by category"
              className="scroll-slim -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
            >
              {filters.map((f) => {
                const active = filter === f;
                return (
                  <button
                    key={f}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "eyebrow flex min-h-11 shrink-0 items-center gap-2 border px-4 transition-colors",
                      active
                        ? "border-gold bg-gold text-ink"
                        : "border-cream/20 text-cream/75 hover:border-gold hover:text-gold",
                    )}
                  >
                    {f}
                    <span className={cn("tabular-nums", active ? "text-ink/60" : "text-cream/40")}>{counts[f] ?? 0}</span>
                  </button>
                );
              })}
            </div>

            <div className="relative w-full lg:w-72">
              <label htmlFor="style-search" className="sr-only">
                Search styles
              </label>
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-cream/45"
                aria-hidden="true"
              />
              <input
                id="style-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search — fade, crop, beard…"
                autoComplete="off"
                className="field min-h-11 py-2 pl-10 pr-10 text-sm [&::-webkit-search-cancel-button]:hidden"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-0 top-0 grid size-11 place-items-center text-cream/60 hover:text-gold"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Grid */}
        {visible.length > 0 ? (
          <ul className="mt-10 grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((style, i) => (
                <motion.li
                  key={style.id}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <StyleCard
                    style={style}
                    number={hairStyles.indexOf(style) + 1}
                    selected={styleId === style.id}
                    onPreview={() => setPreview(i)}
                    onChoose={() => chooseStyle(style.id)}
                    priority={i < 4}
                  />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        ) : (
          <div className="mt-10 border border-dashed border-cream/20 px-6 py-16 text-center">
            <p className="font-display text-3xl text-cream">No styles match “{query.trim()}”.</p>
            <p className="mt-3 text-cream/65">
              Try a shorter word like “fade” or “beard”, or see the full catalog again.
            </p>
            <button type="button" onClick={reset} className="btn btn-outline mt-6">
              Show all styles
            </button>
          </div>
        )}
      </div>

      <Lightbox
        items={lightboxItems}
        index={preview}
        onClose={closePreview}
        onNavigate={setPreview}
        renderActions={(item) => (
          <button
            type="button"
            className="btn btn-gold shrink-0"
            onClick={() => {
              setPreview(null);
              chooseStyle(item.id);
            }}
          >
            Choose This Style
          </button>
        )}
      />
    </section>
  );
}

interface StyleCardProps {
  style: HairStyle;
  number: number;
  selected: boolean;
  priority?: boolean;
  onPreview: () => void;
  onChoose: () => void;
}

function StyleCard({ style, number, selected, priority, onPreview, onChoose }: StyleCardProps) {
  return (
    <article className="group flex h-full flex-col">
      <button
        type="button"
        onClick={onPreview}
        aria-label={`Enlarge photo of ${style.name}`}
        className={cn(
          "relative block aspect-[4/5] w-full overflow-hidden bg-charcoal outline-offset-4",
          selected && "ring-1 ring-gold ring-offset-4 ring-offset-ink",
        )}
      >
        <Image
          src={photo(style.image, 900)}
          alt={`${style.name} reference photo`}
          fill
          priority={priority}
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.06]"
          style={{ objectPosition: style.focus ?? "center 25%" }}
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/5 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100"
        />
        <span className="eyebrow absolute left-3 top-3 bg-ink/75 px-2.5 py-1.5 text-gold backdrop-blur-sm">
          {style.category}
        </span>
        <span
          aria-hidden="true"
          className="absolute right-3 top-3 grid size-9 place-items-center bg-ink/75 text-cream opacity-100 backdrop-blur-sm transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100"
        >
          <Expand className="size-4" />
        </span>
        <span aria-hidden="true" className="eyebrow absolute bottom-3 left-3 tabular-nums text-cream/70">
          No. {String(number).padStart(2, "0")}
        </span>
        {selected && (
          <span className="eyebrow absolute bottom-3 right-3 flex items-center gap-1.5 bg-gold px-2.5 py-1.5 text-ink">
            <Check className="size-3.5" aria-hidden="true" />
            Selected
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col pt-4">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-[1.75rem] leading-tight font-medium text-cream">{style.name}</h3>
          {style.priceFrom !== undefined && (
            <p className="shrink-0 text-sm text-cream/60">
              from <span className="font-semibold text-gold">{formatPrice(style.priceFrom)}</span>
            </p>
          )}
        </div>
        <p className="mt-2 flex-1 text-sm leading-6 text-cream/65">{style.description}</p>
        <button
          type="button"
          onClick={onChoose}
          className={cn("btn mt-5 w-full", selected ? "btn-gold" : "btn-outline")}
        >
          {selected ? "Continue to booking" : "Choose This Style"}
        </button>
      </div>
    </article>
  );
}
