"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { photo } from "@/lib/utils";

export interface LightboxItem {
  id: string;
  image: string;
  alt: string;
  title?: string;
  subtitle?: string;
}

interface LightboxProps {
  items: LightboxItem[];
  /** Index of the open item, or null when closed. */
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
  /** Optional content under the caption, e.g. a "Choose This Style" button. */
  renderActions?: (item: LightboxItem) => React.ReactNode;
}

/** Full-screen image preview with keyboard navigation and focus handling. */
export function Lightbox({ items, index, onClose, onNavigate, renderActions }: LightboxProps) {
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const open = index !== null;
  const item = open ? items[index] : null;
  const many = items.length > 1;

  useEffect(() => {
    if (!open) return;
    const trigger = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      trigger?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (many && e.key === "ArrowRight") onNavigate((index + 1) % items.length);
      if (many && e.key === "ArrowLeft") onNavigate((index - 1 + items.length) % items.length);
      if (e.key === "Tab" && dialogRef.current) {
        // Keep focus inside the dialog.
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>("button, a[href]");
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, items.length, many, onClose, onNavigate]);

  return (
    <AnimatePresence>
      {item && index !== null && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={item.title ?? item.alt}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-sm sm:p-8"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="absolute right-4 top-4 z-10 grid size-11 place-items-center border border-cream/25 bg-ink/60 text-cream transition-colors hover:border-gold hover:text-gold sm:right-8 sm:top-8"
          >
            <X className="size-5" aria-hidden="true" />
          </button>

          {many && (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate((index - 1 + items.length) % items.length);
                }}
                className="absolute left-2 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center border border-cream/25 bg-ink/60 text-cream transition-colors hover:border-gold hover:text-gold sm:left-8"
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate((index + 1) % items.length);
                }}
                className="absolute right-2 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center border border-cream/25 bg-ink/60 text-cream transition-colors hover:border-gold hover:text-gold sm:right-8"
              >
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>
            </>
          )}

          <motion.figure
            key={item.id}
            className="flex max-h-full w-full max-w-3xl flex-col"
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[58vh] w-full sm:h-[68vh]">
              <Image
                src={photo(item.image, 1600)}
                alt={item.alt}
                fill
                sizes="(min-width: 768px) 768px, 100vw"
                className="object-contain"
              />
            </div>
            <figcaption className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                {item.title && <p className="font-display text-3xl text-cream">{item.title}</p>}
                {item.subtitle && <p className="mt-1 max-w-md text-sm leading-6 text-cream/70">{item.subtitle}</p>}
                {many && (
                  <p className="eyebrow mt-2 text-cream/50">
                    {index + 1} / {items.length}
                  </p>
                )}
              </div>
              {renderActions?.(item)}
            </figcaption>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
