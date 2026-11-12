"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

interface ParallaxProps {
  children: React.ReactNode;
  /** Classes for the clipping frame. Give it a size and `relative` or `absolute`. */
  className?: string;
  /** How far the picture drifts, as a percentage of the frame height. */
  amount?: number;
  /** ScrollTrigger start. Use "top top" for something already at the top of the page. */
  start?: string;
}

/**
 * Image parallax, adapted from the "infinite scroll with parallax" demo: the
 * picture moves a little slower than the page as it scrolls through the frame.
 * The inner layer is taller than the frame so no edge ever shows.
 */
export function Parallax({ children, className, amount = 10, start = "top bottom" }: ParallaxProps) {
  const frame = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const a = amount / 100;
    // Travel measured against the layer's own height, so it never exceeds the overhang.
    const shift = (a / (1 + 2 * a)) * 100;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        layer.current,
        { yPercent: -shift },
        {
          yPercent: shift,
          ease: "none",
          scrollTrigger: { trigger: frame.current, start, end: "bottom top", scrub: true },
        },
      );
    }, frame);
    return () => ctx.revert();
  }, [amount, start]);

  return (
    <div ref={frame} className={cn("overflow-hidden", className)}>
      <div ref={layer} className="absolute will-change-transform" style={{ top: `-${amount}%`, bottom: `-${amount}%`, left: 0, right: 0 }}>
        {children}
      </div>
    </div>
  );
}
