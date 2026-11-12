import Image from "next/image";
import { AtSign, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { interiorImage } from "@/data/gallery";
import { site, weekdayNames } from "@/data/site";
import { Parallax } from "@/components/ui/Parallax";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { photo } from "@/lib/utils";

// Show the week Monday-first.
const weekOrder = [1, 2, 3, 4, 5, 6, 0];

export function Contact() {
  const { contact } = site;

  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-charcoal py-20 sm:py-28 lg:py-36">
      <div className="container-page">
        <SectionHeading
          index="07"
          label="Visit us"
          id="contact-title"
          title={
            <>
              Come by <em className="text-gold">the shop.</em>
            </>
          }
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Opening hours */}
          <Reveal className="lg:col-span-4">
            <h3 className="eyebrow text-gold">Opening hours</h3>
            <dl className="mt-5 divide-y divide-cream/10 border-y border-cream/10">
              {weekOrder.map((day) => {
                const hours = site.hours[day];
                return (
                  <div key={day} className="flex items-baseline justify-between gap-4 py-3">
                    <dt className="text-cream/85">{weekdayNames[day]}</dt>
                    <dd className={hours ? "tabular-nums text-cream" : "text-cream/45"}>
                      {hours ? `${hours.open} – ${hours.close}` : "Closed"}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </Reveal>

          {/* Contact details */}
          <Reveal delay={0.08} className="lg:col-span-4">
            <h3 className="eyebrow text-gold">Contact</h3>
            <ul className="mt-5 space-y-1">
              <li>
                <a
                  href={contact.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-11 items-start gap-4 py-2.5 text-cream/85 transition-colors hover:text-gold"
                >
                  <MapPin className="mt-1 size-4 shrink-0 text-gold" aria-hidden="true" />
                  <span>
                    {contact.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                    <span className="eyebrow mt-1.5 block text-cream/50 group-hover:text-gold">Open in Google Maps</span>
                  </span>
                </a>
              </li>
              <li>
                <a href={contact.phoneHref} className="flex min-h-11 items-center gap-4 py-2.5 text-cream/85 transition-colors hover:text-gold">
                  <Phone className="size-4 shrink-0 text-gold" aria-hidden="true" />
                  {contact.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className="flex min-h-11 items-center gap-4 py-2.5 text-cream/85 transition-colors hover:text-gold">
                  <Mail className="size-4 shrink-0 text-gold" aria-hidden="true" />
                  {contact.email}
                </a>
              </li>
              <li>
                <a
                  href={contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-11 items-center gap-4 py-2.5 text-cream/85 transition-colors hover:text-gold"
                >
                  <AtSign className="size-4 shrink-0 text-gold" aria-hidden="true" />
                  <span>
                    Instagram <span className="text-cream/50">{contact.instagramHandle}</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-11 items-center gap-4 py-2.5 text-cream/85 transition-colors hover:text-gold"
                >
                  <MessageCircle className="size-4 shrink-0 text-gold" aria-hidden="true" />
                  Message us on WhatsApp
                </a>
              </li>
            </ul>
            <a href="#booking" className="btn btn-gold mt-8 w-full sm:w-auto">
              Book Appointment
            </a>
          </Reveal>

          {/* Shop photo linking to the map */}
          <Reveal delay={0.16} className="lg:col-span-4">
            <a
              href={contact.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Get directions in Google Maps"
              className="group relative block aspect-[4/3] overflow-hidden bg-smoke lg:aspect-auto lg:h-full lg:min-h-80"
            >
              <Parallax className="absolute inset-0" amount={8}>
                <Image
                  src={photo(interiorImage, 1000)}
                  alt="Barber chairs inside the shop"
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.04]"
                />
              </Parallax>
              <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 p-5">
                <span className="font-display text-2xl text-cream">Get directions</span>
                <span className="grid size-11 place-items-center bg-gold text-ink">
                  <MapPin className="size-5" aria-hidden="true" />
                </span>
              </span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
