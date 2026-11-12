"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Focus Cards — adapted from Aceternity UI (ui.aceternity.com/components/focus-cards).
 * Hovering or focusing one card softly blurs and shrinks the others.
 *
 * Changes from the registry version: it renders any content through `render`
 * (instead of a fixed image + title), reacts to keyboard focus as well as
 * hover, and skips the blur for visitors who prefer reduced motion.
 */
interface FocusCardsProps<T> {
  items: T[];
  getKey: (item: T) => string;
  render: (item: T, state: { active: boolean; index: number }) => React.ReactNode;
  className?: string;
}

export function FocusCards<T>({ items, getKey, render, className }: FocusCardsProps<T>) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <ul className={className}>
      {items.map((item, index) => (
        <li
          key={getKey(item)}
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
          onFocus={() => setHovered(index)}
          onBlur={() => setHovered(null)}
          className={cn(
            "transition-[filter,transform,opacity] duration-300 ease-out",
            hovered !== null &&
              hovered !== index &&
              "opacity-60 motion-safe:scale-[0.98] motion-safe:blur-[2px]",
          )}
        >
          {render(item, { active: hovered === index, index })}
        </li>
      ))}
    </ul>
  );
}
