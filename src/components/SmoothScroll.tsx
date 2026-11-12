"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenis } from "@/lib/lenis-store";

/**
 * Smooth, inertial page scrolling (Lenis) wired into GSAP ScrollTrigger so
 * scroll-linked animations stay in step. Adapted from the "infinite scroll
 * with parallax" demo — but WITHOUT its infinite loop and mandatory snapping,
 * which would fight the booking form, anchor links and sticky filters.
 *
 * Skipped entirely for visitors who prefer reduced motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      lerp: 0.1,
      // Let in-page links (#styles, #booking …) glide. Lenis already honours the
      // page's `scroll-padding-top`, which keeps targets clear of the fixed header.
      anchors: true,
      // While a dialog or the mobile menu has locked the page, leave scrolling alone.
      prevent: () => document.body.style.overflow === "hidden",
    });
    setLenis(lenis);

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
