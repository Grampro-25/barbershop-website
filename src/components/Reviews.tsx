import { Star } from "lucide-react";
import { reviews } from "@/data/reviews";
import { site } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

function Stars({ rating }: { rating: number }) {
  return (
    <div role="img" aria-label={`${rating} out of 5 stars`} className="flex gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={cn("size-4", i < rating ? "fill-gold-deep text-gold-deep" : "text-ink/25")}
        />
      ))}
    </div>
  );
}

export function Reviews() {
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="bg-cream py-20 text-ink sm:py-28 lg:py-36">
      <div className="container-page">
        <SectionHeading
          index="06"
          label="Reviews"
          id="reviews-title"
          tone="light"
          title={
            <>
              What our clients <em className="text-gold-deep">say.</em>
            </>
          }
        />

        <ul className="mt-12 grid gap-6 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <li key={review.id} className="flex">
              <Reveal delay={i * 0.08} className="flex w-full">
                <figure className="flex w-full flex-col border border-ink/15 bg-white p-6 sm:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <Stars rating={review.rating} />
                    {review.isPlaceholder && (
                      <span className="eyebrow border border-ink/25 px-2 py-1 text-ink/60">Sample</span>
                    )}
                  </div>
                  <blockquote className="mt-6 flex-1 font-display text-2xl leading-snug text-ink">
                    “{review.text}”
                  </blockquote>
                  <figcaption className="mt-8 flex items-center gap-4 border-t border-ink/15 pt-5">
                    <span
                      aria-hidden="true"
                      className="grid size-11 shrink-0 place-items-center bg-ink font-display text-xl text-gold"
                    >
                      {review.name.charAt(0)}
                    </span>
                    <span>
                      <span className="block font-semibold text-ink">{review.name}</span>
                      <span className="eyebrow mt-1 block text-ink/55">{review.service}</span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="mt-10 flex flex-col items-start justify-between gap-5 border-t border-ink/15 pt-8 sm:flex-row sm:items-center">
          <p className="max-w-xl text-ink/70">Been in the chair recently? We'd like to hear how it went.</p>
          <a href={site.contact.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
            Leave a review on Google
          </a>
        </Reveal>
      </div>
    </section>
  );
}
