import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

interface SectionHeadingProps {
  /** Two-digit index shown beside the label, e.g. "01". */
  index: string;
  label: string;
  title: React.ReactNode;
  intro?: string;
  id?: string;
  tone?: "dark" | "light";
  className?: string;
}

/** Shared heading block: numbered eyebrow, serif title, optional intro. */
export function SectionHeading({ index, label, title, intro, id, tone = "dark", className }: SectionHeadingProps) {
  const light = tone === "light";
  return (
    <Reveal className={cn("max-w-3xl", className)}>
      <p className={cn("eyebrow flex items-center gap-3", light ? "text-gold-deep" : "text-gold")}>
        <span aria-hidden="true">({index})</span>
        <span aria-hidden="true" className={cn("h-px w-10", light ? "bg-gold-deep/60" : "bg-gold/60")} />
        {label}
      </p>
      <h2
        id={id}
        className={cn(
          "mt-5 font-display text-[2.5rem] leading-[1.02] font-medium tracking-[-0.01em] sm:text-6xl lg:text-7xl",
          light ? "text-ink" : "text-cream",
        )}
      >
        {title}
      </h2>
      {intro && (
        <p className={cn("mt-5 max-w-xl text-base leading-7 sm:text-lg", light ? "text-ink/70" : "text-cream/70")}>
          {intro}
        </p>
      )}
    </Reveal>
  );
}
