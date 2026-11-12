"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

/** A thin gold line across the top that fills as the page is scrolled. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduce = useReducedMotion();
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gold"
      style={{ scaleX: reduce ? scrollYProgress : smooth }}
    />
  );
}
