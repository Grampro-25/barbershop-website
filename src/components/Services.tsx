"use client";

import { ArrowUpRight, Clock } from "lucide-react";
import { services } from "@/data/services";
import { useBooking } from "@/components/BookingContext";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn, formatPrice } from "@/lib/utils";

export function Services() {
  const { chooseService } = useBooking();

  return (
    <section id="services" aria-labelledby="services-title" className="bg-cream py-20 text-ink sm:py-28 lg:py-36">
      <div className="container-page">
        <SectionHeading
          index="02"
          label="Services & prices"
          id="services-title"
          tone="light"
          title={
            <>
              Honest prices, <em className="text-gold-deep">unhurried</em> work.
            </>
          }
          intro="Every visit starts with a short consultation. Prices are fixed — what you see here is what you pay."
        />

        <ul className="mt-12 grid gap-px border border-ink/15 bg-ink/15 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <li
              key={service.id}
              className={cn("flex", service.featured ? "bg-ink text-cream" : "bg-cream", i === services.length - 1 && "sm:col-span-2 lg:col-span-3")}
            >
              <Reveal delay={(i % 3) * 0.06} className="flex w-full">
                <article
                  className={cn(
                    "flex w-full flex-col p-6 sm:p-8",
                    i === services.length - 1 && "lg:flex-row lg:items-center lg:gap-12",
                  )}
                >
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        {service.featured && <p className="eyebrow mb-3 text-gold">Most booked</p>}
                        <h3 className="font-display text-3xl leading-tight font-medium">{service.name}</h3>
                      </div>
                      <p
                        className={cn(
                          "font-display text-4xl leading-none font-medium tabular-nums",
                          service.featured ? "text-gold" : "text-gold-deep",
                        )}
                      >
                        {formatPrice(service.price)}
                      </p>
                    </div>
                    <p className={cn("mt-3 text-sm leading-6", service.featured ? "text-cream/70" : "text-ink/70")}>
                      {service.description}
                    </p>
                    <ul
                      className={cn(
                        "mt-5 flex flex-wrap gap-x-4 gap-y-1.5 text-sm",
                        service.featured ? "text-cream/80" : "text-ink/80",
                      )}
                    >
                      {service.includes.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <span
                            aria-hidden="true"
                            className={cn("size-1 rounded-full", service.featured ? "bg-gold" : "bg-gold-deep")}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div
                    className={cn(
                      "mt-8 flex items-center justify-between gap-4 border-t pt-5",
                      service.featured ? "border-cream/15" : "border-ink/15",
                      i === services.length - 1 && "lg:mt-0 lg:w-72 lg:flex-col lg:items-stretch lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0",
                    )}
                  >
                    <p className={cn("eyebrow flex items-center gap-2", service.featured ? "text-cream/60" : "text-ink/60")}>
                      <Clock className="size-3.5" aria-hidden="true" />
                      {service.duration} min
                    </p>
                    <button
                      type="button"
                      onClick={() => chooseService(service.id)}
                      aria-label={`Book ${service.name}`}
                      className={cn("btn min-h-11 px-4 py-2", service.featured ? "btn-gold" : "btn-dark")}
                    >
                      Book
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
