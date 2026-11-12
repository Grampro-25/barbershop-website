"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { photo } from "@/lib/utils";

/**
 * Scroll-driven clip-path text, ported from the "TextClipScroll" demo.
 *
 * Each word is an SVG <clipPath> made of one <text> per letter. A photo is
 * clipped to that shape, so the picture only shows *through the letters*.
 * As you scroll, the word slides across the screen (scrubbed to the scroll
 * position) while its letters grow up from the baseline and the photo drifts.
 */
const rows = [
  { word: "FADES", image: "1640301133543-41fe25ad6450", dir: 1 },
  { word: "TAPERS", image: "1792523227995-9ac04cf1d94d", dir: -1 },
  { word: "BEARDS", image: "1717089256239-dc2ed4d9dfc6", dir: 1 },
] as const;

export function ClipTextSection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = root.current;
    if (!section) return;
    gsap.registerPlugin(ScrollTrigger);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ctx: gsap.Context | null = null;
    let cancelled = false;

    const setup = () => {
      ctx?.revert();
      ctx = gsap.context(() => {
        rows.forEach((row, i) => {
          const clip = section.querySelector<SVGClipPathElement>(`#clip-${i}`)!;
          const letters = Array.from(clip.querySelectorAll<SVGTextElement>("text"));
          const poster = section.querySelector<HTMLElement>(`[data-poster="${i}"]`)!;
          const inner = poster.firstElementChild as HTMLElement;

          // Measure the word so each letter can be placed at its true position
          // (letters are separate elements, so the browser can't kern them for us).
          const probe = document.createElementNS("http://www.w3.org/2000/svg", "text");
          probe.setAttribute("class", "clip-letter");
          probe.textContent = row.word;
          clip.ownerSVGElement!.appendChild(probe);
          const total = probe.getComputedTextLength();
          letters.forEach((el, k) => el.setAttribute("x", String(k === 0 ? 0 : probe.getSubStringLength(0, k))));
          probe.remove();

          const frameWidth = () => poster.clientWidth;

          if (reduce) {
            // No motion: park the word, centred, with the photo showing through.
            gsap.set(clip, { x: () => (frameWidth() - total) / 2 });
            return;
          }

          gsap
            .timeline({
              scrollTrigger: {
                trigger: poster,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
              },
            })
            // The word crosses the whole screen once; it is centred at the midpoint.
            .fromTo(
              clip,
              { x: () => (row.dir > 0 ? frameWidth() : -total) },
              { x: () => (row.dir > 0 ? -total : frameWidth()), ease: "none", duration: 1 },
              0,
            )
            .fromTo(inner, { scale: 1.3, xPercent: row.dir * 4 }, { scale: 1, xPercent: -row.dir * 4, ease: "none", duration: 1 }, 0)
            .fromTo(
              letters,
              { transformOrigin: "50% 100%", scaleY: 0 },
              { scaleY: 1, ease: "power2.out", duration: 0.22, stagger: 0.04 },
              0.02,
            );
        });
      }, section);
    };

    // Wait for the web font so letter widths are measured correctly.
    document.fonts.ready.then(() => {
      if (!cancelled) setup();
    });

    let lastWidth = window.innerWidth;
    let timer: number | undefined;
    const onResize = () => {
      if (window.innerWidth === lastWidth) return; // ignore mobile toolbar height changes
      lastWidth = window.innerWidth;
      window.clearTimeout(timer);
      timer = window.setTimeout(setup, 200);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.removeEventListener("resize", onResize);
      ctx?.revert();
    };
  }, []);

  return (
    <section ref={root} aria-labelledby="clip-title" className="overflow-hidden bg-ink py-16 sm:py-24">
      <h2 id="clip-title" className="sr-only">
        Fades, tapers and beards
      </h2>

      {/* The clip shapes. The letters are decorative: the heading above carries the meaning. */}
      <svg aria-hidden="true" focusable="false" width="0" height="0" className="absolute">
        {rows.map((row, i) => (
          <clipPath key={row.word} id={`clip-${i}`}>
            {Array.from(row.word).map((char, k) => (
              <text key={k} x={`${k}ch`} y="0.78em" className="clip-letter">
                {char}
              </text>
            ))}
          </clipPath>
        ))}
      </svg>

      <div aria-hidden="true" className="flex flex-col gap-3 sm:gap-5">
        {rows.map((row, i) => (
          <div
            key={row.word}
            data-poster={i}
            className="relative w-full"
            style={{
              height: "calc(var(--clip-size) * 0.82)",
              clipPath: `url(#clip-${i})`,
            }}
          >
            <div
              className="size-full bg-cover bg-center"
              style={{ backgroundImage: `url(${photo(row.image, 1600)})` }}
            />
          </div>
        ))}
      </div>

      <p className="container-page mt-12 max-w-xl text-lg leading-8 text-cream/70 sm:mt-16">
        Whatever you walk in with, you leave sharper. Browse the catalog, pick a cut, and we'll take it from there.
      </p>
    </section>
  );
}
