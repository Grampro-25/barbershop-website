"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { Expand } from "lucide-react";
import { beforeAfter, galleryCategories, galleryItems, type GalleryCategory } from "@/data/gallery";
import { BeforeAfter } from "@/components/BeforeAfter";
import { Lightbox, type LightboxItem } from "@/components/ui/Lightbox";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn, photo } from "@/lib/utils";

type Filter = "All" | GalleryCategory;
const filters: Filter[] = ["All", ...galleryCategories];

export function Gallery() {
  const [filter, setFilter] = useState<Filter>("All");
  const [preview, setPreview] = useState<number | null>(null);

  const visible = useMemo(
    () => galleryItems.filter((item) => filter === "All" || item.category === filter),
    [filter],
  );

  const lightboxItems: LightboxItem[] = useMemo(
    () => visible.map((g) => ({ id: g.id, image: g.image, alt: g.alt, title: g.alt, subtitle: g.category })),
    [visible],
  );

  const closePreview = useCallback(() => setPreview(null), []);

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="bg-ink py-20 sm:py-28 lg:py-36">
      <div className="container-page">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="05"
            label="Gallery"
            id="gallery-title"
            title={
              <>
                Fresh from <em className="text-gold">the chair.</em>
              </>
            }
            intro="Fades, tapers, classic cuts, beard work and a look around the shop."
          />
          <div role="group" aria-label="Filter gallery" className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={cn(
                  "eyebrow min-h-11 border px-4 transition-colors",
                  filter === f
                    ? "border-gold bg-gold text-ink"
                    : "border-cream/20 text-cream/75 hover:border-gold hover:text-gold",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry-style columns */}
        <ul className="mt-12 columns-2 gap-3 sm:gap-4 lg:columns-3 xl:columns-4">
          {visible.map((item, i) => (
            <li key={item.id} className="mb-3 break-inside-avoid sm:mb-4">
              <Reveal delay={(i % 4) * 0.05} y={16}>
                <button
                  type="button"
                  onClick={() => setPreview(i)}
                  aria-label={`Enlarge photo: ${item.alt}`}
                  className={cn(
                    "group relative block w-full overflow-hidden bg-charcoal",
                    item.tall ? "aspect-[3/4]" : "aspect-square",
                  )}
                >
                  <Image
                    src={photo(item.image, 800)}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.06]"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 flex items-end justify-between gap-3 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                  >
                    <span className="eyebrow text-left text-cream">{item.category}</span>
                    <Expand className="size-4 shrink-0 text-gold" />
                  </span>
                </button>
              </Reveal>
            </li>
          ))}
        </ul>

        {/* Before & after */}
        <div className="mt-20 border-t border-cream/10 pt-14 lg:mt-28 lg:pt-20">
          <Reveal>
            <p className="eyebrow text-gold">Before &amp; after</p>
            <h3 className="mt-4 max-w-2xl font-display text-4xl leading-tight font-medium text-cream sm:text-5xl">
              Drag to see the difference.
            </h3>
            <p className="mt-4 max-w-xl text-cream/65">
              These pairs are sample photos showing how the comparison works. Swap in your own before-and-after shots in{" "}
              <code className="text-cream/85">src/data/gallery.ts</code>.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            {beforeAfter.map((pair) => (
              <Reveal key={pair.id}>
                <BeforeAfter label={pair.label} before={pair.before} after={pair.after} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <Lightbox items={lightboxItems} index={preview} onClose={closePreview} onNavigate={setPreview} />
    </section>
  );
}
