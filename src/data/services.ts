/** Services and prices. Prices are placeholders in euros — edit them here. */
export interface Service {
  id: string;
  name: string;
  description: string;
  /** Price in euros. */
  price: number;
  /** Duration in minutes. Keep it a multiple of `site.slotMinutes`. */
  duration: number;
  includes: string[];
  featured?: boolean;
}

export const services: Service[] = [
  {
    id: "standard-haircut",
    name: "Standard Haircut",
    description: "Consultation, cut and style with scissors or clippers.",
    price: 28,
    duration: 30,
    includes: ["Consultation", "Wash on request", "Styled finish"],
  },
  {
    id: "skin-fade",
    name: "Skin Fade",
    description: "A fade taken down to the skin and blended by hand.",
    price: 32,
    duration: 60,
    includes: ["Consultation", "Foil-shaver finish", "Line-up"],
  },
  {
    id: "taper-fade",
    name: "Taper Fade",
    description: "A clean taper at the sideburns and neckline.",
    price: 30,
    duration: 30,
    includes: ["Consultation", "Edge line-up", "Styled finish"],
  },
  {
    id: "haircut-beard",
    name: "Haircut + Beard",
    description: "Any haircut together with a full beard shape-up.",
    price: 42,
    duration: 60,
    includes: ["Any haircut", "Beard trim and line-up", "Beard oil"],
    featured: true,
  },
  {
    id: "beard-trim",
    name: "Beard Trim",
    description: "Trim, shape and line-up for any beard length.",
    price: 15,
    duration: 30,
    includes: ["Shape and trim", "Razor line-up", "Beard oil"],
  },
  {
    id: "hot-towel-shave",
    name: "Hot Towel Shave",
    description: "A traditional straight-razor shave with hot towels.",
    price: 25,
    duration: 30,
    includes: ["Hot towel prep", "Straight-razor shave", "Aftershave balm"],
  },
  {
    id: "premium-grooming",
    name: "Premium Grooming Package",
    description: "The full visit: haircut, beard, hot towel and finishing.",
    price: 65,
    duration: 90,
    includes: ["Any haircut", "Beard or hot towel shave", "Wash and scalp massage", "Styled finish"],
  },
];

export function getService(id: string | null | undefined) {
  return services.find((s) => s.id === id);
}
