import { navLinks, site } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-cream/10 bg-ink">
      <div className="container-page py-14">
        <p aria-hidden="true" className="font-display text-[18vw] leading-[0.85] font-medium tracking-[-0.03em] text-cream/[0.07] lg:text-[13rem]">
          Our Craft.
        </p>

        <div className="mt-10 flex flex-col gap-8 border-t border-cream/10 pt-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="grid size-9 place-items-center border border-gold font-display text-lg leading-none font-semibold text-gold"
            >
              {site.shortName}
            </span>
            <span className="font-display text-xl text-cream">{site.name}</span>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="eyebrow inline-flex min-h-11 items-center text-cream/65 transition-colors hover:text-gold">
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#booking" className="eyebrow inline-flex min-h-11 items-center text-gold transition-colors hover:text-gold-soft">
                  Book
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-2 text-sm text-cream/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>
            Photography via{" "}
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-gold"
            >
              Unsplash
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
