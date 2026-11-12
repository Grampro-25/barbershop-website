"use client";

import { useEffect } from "react";
import { motion, stagger, useAnimate, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Text Generate Effect — adapted from Aceternity UI.
 * Words fade in one after another, from blurred to sharp.
 *
 * Changes from the registry version: inherits colour from its parent (no
 * hard-coded black/white), shows the text immediately when the visitor prefers
 * reduced motion, and keeps the full sentence readable to screen readers.
 */
export function TextGenerateEffect({
  words,
  className,
  delay = 0,
  duration = 0.6,
}: {
  words: string;
  className?: string;
  /** Seconds to wait before the first word appears. */
  delay?: number;
  duration?: number;
}) {
  const [scope, animate] = useAnimate();
  const reduce = useReducedMotion();
  const list = words.split(" ");

  useEffect(() => {
    if (reduce) return;
    animate(
      "span",
      { opacity: 1, filter: "blur(0px)" },
      { duration, delay: stagger(0.18, { startDelay: delay }) },
    );
  }, [animate, reduce, duration, delay]);

  return (
    <p className={cn(className)} aria-label={words}>
      <motion.span ref={scope} aria-hidden="true">
        {list.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            className="inline-block"
            style={reduce ? undefined : { opacity: 0, filter: "blur(10px)" }}
          >
            {word}
            {i < list.length - 1 ? " " : ""}
          </motion.span>
        ))}
      </motion.span>
    </p>
  );
}
