"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { MoveHorizontal } from "lucide-react";
import { photo } from "@/lib/utils";

interface BeforeAfterProps {
  label: string;
  before: { image: string; alt: string };
  after: { image: string; alt: string };
}

/**
 * Before / after comparison. Drag the handle, or focus it and use the arrow
 * keys — it is a native range input, so it works with touch, mouse and keyboard.
 */
export function BeforeAfter({ label, before, after }: BeforeAfterProps) {
  const [position, setPosition] = useState(50);
  const id = useId();

  return (
    <figure>
      <div className="group relative aspect-[4/5] select-none overflow-hidden bg-charcoal sm:aspect-[4/3]">
        <Image
          src={photo(after.image, 1200)}
          alt={after.alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          style={{ objectPosition: "center 25%" }}
          draggable={false}
        />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          <Image
            src={photo(before.image, 1200)}
            alt={before.alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            style={{ objectPosition: "center 25%" }}
            draggable={false}
          />
        </div>

        <span className="eyebrow absolute left-3 top-3 bg-ink/75 px-2.5 py-1.5 text-cream backdrop-blur-sm">Before</span>
        <span className="eyebrow absolute right-3 top-3 bg-gold px-2.5 py-1.5 text-ink">After</span>

        {/* Divider and handle */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 w-px bg-gold"
          style={{ left: `${position}%` }}
        >
          <span className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gold text-ink shadow-lg">
            <MoveHorizontal className="size-5" />
          </span>
        </div>

        <label htmlFor={id} className="sr-only">
          {label}: drag to compare before and after
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          className="peer absolute inset-0 size-full cursor-ew-resize opacity-0"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden outline-2 -outline-offset-2 outline-gold peer-focus-visible:block peer-focus-visible:outline"
        />
      </div>
      <figcaption className="mt-3 flex items-baseline justify-between gap-4">
        <span className="font-display text-2xl text-cream">{label}</span>
        <span className="eyebrow text-cream/45">Sample pair</span>
      </figcaption>
    </figure>
  );
}
