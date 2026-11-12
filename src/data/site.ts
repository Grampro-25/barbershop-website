/**
 * Business details. EVERYTHING in this file is placeholder content —
 * replace it with your real shop information before going live.
 */
export const site = {
  name: "Your Barbershop",
  shortName: "YB",
  tagline: "Premium Cuts. Timeless Confidence.",
  description:
    "A modern barbershop for fades, tapers, classic cuts and beard work. Browse the cut catalog and book your chair online.",
  url: "https://example.com",

  contact: {
    addressLines: ["123 Example Street", "0000 Your City"],
    phone: "+00 000 000 000",
    phoneHref: "tel:+00000000000",
    email: "hello@example.com",
    instagramHandle: "@yourbarbershop",
    instagramUrl: "https://www.instagram.com/",
    // Replace the number: https://wa.me/<countrycode><number>
    whatsappUrl: "https://wa.me/",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=barbershop",
  },

  /** IANA timezone the shop operates in. Used to hide time slots that have already passed. */
  timezone: "Europe/Berlin",

  /** How far ahead customers can book. */
  bookingWindowDays: 45,

  /** Length of one bookable slot in minutes. Service durations should be multiples of this. */
  slotMinutes: 30,

  /**
   * Opening hours by weekday (0 = Sunday … 6 = Saturday).
   * `null` means closed. Times are 24h "HH:MM".
   */
  hours: {
    0: null,
    1: null,
    2: { open: "09:00", close: "19:00" },
    3: { open: "09:00", close: "19:00" },
    4: { open: "09:00", close: "20:00" },
    5: { open: "09:00", close: "20:00" },
    6: { open: "09:00", close: "17:00" },
  } as Record<number, { open: string; close: string } | null>,
} as const;

export const weekdayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const navLinks = [
  { href: "#styles", label: "Styles" },
  { href: "#services", label: "Services" },
  { href: "#barbers", label: "Barbers" },
  { href: "#gallery", label: "Gallery" },
  { href: "#reviews", label: "Reviews" },
  { href: "#contact", label: "Contact" },
];
