"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { heroImage } from "@/data/gallery";
import { site, weekdayNames } from "@/data/site";
import { Parallax } from "@/components/ui/Parallax";
import { MovingBorderLink } from "@/components/ui/moving-border";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { photo } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

function hoursSummary() {
  const open = Object.entries(site.hours).filter(([, h]) => h !== null);
  if (open.length === 0) return "By appointment";
  const first = weekdayNames[Number(open[0][0])].slice(0, 3);
  const last = weekdayNames[Number(open[open.length - 1][0])].slice(0, 3);
  return `${first}–${last}`;
}

export function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) => ({
    initial: reduce ? false : ({ opacity: 0, y: 36 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease },
  });

  return (
    <section id="top" className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden">
      {/* Background photograph with a slow settle-in */}
      <Parallax className="absolute inset-0 -z-20" amount={12} start="top top">
        <motion.div
          className="absolute inset-0"
          initial={reduce ? false : { scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.4, ease }}
        >
          <Image
            src={photo(heroImage, 2400)}
            alt="Row of leather barber chairs"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </Parallax>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,#0d0d0d_4%,rgb(13_13_13/0.72)_42%,rgb(13_13_13/0.45)_70%,rgb(13_13_13/0.78)_100%)]"
      />

      {/* Editorial corner marks */}
      <span aria-hidden="true" className="absolute left-5 top-24 text-xl leading-none text-gold/70 sm:left-8 lg:left-12 lg:top-28">+</span>
      <span aria-hidden="true" className="absolute right-5 top-24 text-xl leading-none text-gold/70 sm:right-8 lg:right-12 lg:top-28">+</span>

      <div className="container-page pb-10 pt-32 sm:pb-14">
        <motion.p {...rise(0.15)} className="eyebrow flex items-center gap-3 text-gold">
          <span aria-hidden="true" className="h-px w-10 bg-gold/70" />
          {site.name} · Barbershop
        </motion.p>

        <h1 className="mt-6 font-display text-[3.5rem] leading-[0.92] font-medium tracking-[-0.02em] text-cream sm:text-8xl lg:text-[9.5rem]">
          <span className="block overflow-hidden pb-2">
            <motion.span
              className="block"
              initial={reduce ? false : { y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.25, ease }}
            >
              Your Style.
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-6 -mb-3">
            <motion.span
              className="block italic text-gold"
              initial={reduce ? false : { y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease }}
            >
              Our Craft.
            </motion.span>
          </span>
        </h1>

        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <motion.div {...rise(0.65)} className="max-w-md">
            <TextGenerateEffect
              words={site.tagline}
              delay={1.1}
              className="text-lg leading-8 text-cream/85 sm:text-xl"
            />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <MovingBorderLink href="#booking">
                Book Appointment
                <ArrowRight className="size-4" aria-hidden="true" />
              </MovingBorderLink>
              <a href="#styles" className="btn btn-outline">
                Explore Styles
              </a>
            </div>
          </motion.div>

          <motion.dl
            {...rise(0.8)}
            className="grid grid-cols-3 gap-6 border-t border-cream/15 pt-6 lg:min-w-[26rem] lg:gap-10"
          >
            {[
              { k: "Styles", v: "28" },
              { k: "Open", v: hoursSummary() },
              { k: "Booking", v: "Online" },
            ].map((item) => (
              <div key={item.k}>
                <dt className="eyebrow text-cream/55">{item.k}</dt>
                <dd className="mt-2 font-display text-2xl text-cream sm:text-3xl">{item.v}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.a
          {...rise(1)}
          href="#styles"
          className="eyebrow mt-10 hidden items-center gap-2 text-cream/60 transition-colors hover:text-gold sm:inline-flex"
        >
          <ArrowDown className="size-3.5" aria-hidden="true" />
          Scroll to the catalog
        </motion.a>
      </div>
    </section>
  );
}
