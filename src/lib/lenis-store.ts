import type Lenis from "lenis";

/** Holds the running Lenis instance so other components can scroll through it. */
let instance: Lenis | null = null;

export const getLenis = () => instance;
export const setLenis = (lenis: Lenis | null) => {
  instance = lenis;
};

/**
 * Smooth-scroll to an element, using Lenis when it is running and the browser
 * otherwise. Both respect the page's `scroll-padding-top` and the element's own
 * `scroll-margin-top`, so the landing spot is the same either way.
 */
export function scrollToElement(el: HTMLElement) {
  if (instance) {
    instance.scrollTo(el);
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}
