"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Moving Border — adapted from Aceternity UI.
 * A bright spot travels around the outline of a link or button.
 *
 * Changes from the registry version: rendered as a link/button we can style
 * with our own `.btn` classes, gold glow instead of blue, and the spot stays
 * still when the visitor prefers reduced motion.
 */
export function MovingBorderLink({
  href,
  children,
  className,
  duration = 3600,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  duration?: number;
}) {
  return (
    <a href={href} className={cn("relative inline-flex overflow-hidden p-px", className)}>
      <span aria-hidden="true" className="absolute inset-0">
        <MovingBorder duration={duration}>
          <span className="block size-20 bg-[radial-gradient(var(--color-gold-soft)_35%,transparent_65%)] opacity-90" />
        </MovingBorder>
      </span>
      <span className="btn btn-gold relative w-full">{children}</span>
    </a>
  );
}

function MovingBorder({ children, duration }: { children: React.ReactNode; duration: number }) {
  const pathRef = useRef<SVGRectElement>(null);
  const progress = useMotionValue(0);
  const reduce = useReducedMotion();

  useAnimationFrame((time) => {
    if (reduce) return;
    const length = pathRef.current?.getTotalLength();
    if (length) progress.set((time * (length / duration)) % length);
  });

  const x = useTransform(progress, (v) => pathRef.current?.getPointAtLength(v).x ?? 0);
  const y = useTransform(progress, (v) => pathRef.current?.getPointAtLength(v).y ?? 0);
  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute size-full"
        width="100%"
        height="100%"
      >
        <rect fill="none" width="100%" height="100%" ref={pathRef} />
      </svg>
      <motion.span style={{ position: "absolute", top: 0, left: 0, display: "inline-block", transform }}>
        {children}
      </motion.span>
    </>
  );
}
