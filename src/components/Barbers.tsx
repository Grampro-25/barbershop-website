"use client";

import Image from "next/image";
import { barbers } from "@/data/barbers";
import { useBooking } from "@/components/BookingContext";
import { FocusCards } from "@/components/ui/focus-cards";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { photo } from "@/lib/utils";

export function Barbers() {
  const { chooseBarber } = useBooking();

  return (
    <section id="barbers" aria-labelledby="barbers-title" className="bg-charcoal py-20 sm:py-28 lg:py-36">
      <div className="container-page">
        <SectionHeading
          index="04"
          label="Meet our barbers"
          id="barbers-title"
          title={
            <>
              The hands behind <em className="text-gold">the chair.</em>
            </>
          }
          intro="Pick the barber whose work fits the look you're after. You can book any of them directly."
        />

        <FocusCards
          items={barbers}
          getKey={(barber) => barber.id}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
          render={(barber, { index: i }) => (
              <Reveal delay={i * 0.08}>
                <article className="group">
                  <div className="relative aspect-[4/5] overflow-hidden bg-smoke">
                    <Image
                      src={photo(barber.image, 900)}
                      alt={`${barber.name}, ${barber.role}`}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover grayscale transition-[filter,transform] duration-700 ease-out-soft group-hover:scale-[1.04] group-hover:grayscale-0"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent"
                    />
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
                      <div>
                        <p className="eyebrow text-gold">{barber.role}</p>
                        <h3 className="mt-1.5 font-display text-3xl leading-tight font-medium text-cream">{barber.name}</h3>
                      </div>
                      <p className="eyebrow shrink-0 text-cream/70">{barber.experience}</p>
                    </div>
                  </div>

                  <div className="pt-5">
                    <p className="eyebrow text-cream/50">Specialties</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {barber.specialties.map((s) => (
                        <li key={s} className="border border-cream/15 px-3 py-1.5 text-sm text-cream/80">
                          {s}
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={() => chooseBarber(barber.id)}
                      className="btn btn-outline mt-6 w-full"
                    >
                      Book this barber
                      <span className="sr-only"> — {barber.name}</span>
                    </button>
                  </div>
                </article>
              </Reveal>
          )}
        />
      </div>
    </section>
  );
}
