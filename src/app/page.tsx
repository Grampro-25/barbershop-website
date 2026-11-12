import { Barbers } from "@/components/Barbers";
import { Booking } from "@/components/Booking";
import { BookingProvider } from "@/components/BookingContext";
import { ClipTextSection } from "@/components/ClipTextSection";
import { Contact } from "@/components/Contact";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { Reviews } from "@/components/Reviews";
import { ScrollProgress } from "@/components/ScrollProgress";
import { StyleTicker } from "@/components/StyleTicker";
import { Services } from "@/components/Services";
import { StyleCatalog } from "@/components/StyleCatalog";
import { site } from "@/data/site";

export default function HomePage() {
  // Structured data so search engines understand the business.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BarberShop",
    name: site.name,
    description: site.description,
    url: site.url,
    telephone: site.contact.phone,
    email: site.contact.email,
    address: { "@type": "PostalAddress", streetAddress: site.contact.addressLines.join(", ") },
    priceRange: "€€",
  };

  return (
    <BookingProvider>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SmoothScroll />
      <ScrollProgress />
      <Navbar />
      <main id="main">
        <Hero />
        <StyleTicker />
        <StyleCatalog />
        <ClipTextSection />
        <Services />
        <Booking />
        <Barbers />
        <Gallery />
        <Reviews />
        <Contact />
      </main>
      <Footer />
    </BookingProvider>
  );
}
