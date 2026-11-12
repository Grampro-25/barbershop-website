import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { site } from "@/data/site";
import { heroImage } from "@/data/gallery";
import { photo } from "@/lib/utils";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Your Style. Our Craft.`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    "barbershop",
    "barber",
    "skin fade",
    "taper fade",
    "beard trim",
    "hot towel shave",
    "men's haircut",
    "book barber online",
  ],
  openGraph: {
    type: "website",
    title: `${site.name} — Your Style. Our Craft.`,
    description: site.description,
    siteName: site.name,
    images: [{ url: photo(heroImage, 1200), width: 1200, height: 800, alt: "Inside the barbershop" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Your Style. Our Craft.`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0D0D0D",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable}`}>
      <body>
        <a
          href="#main"
          className="btn btn-gold sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
