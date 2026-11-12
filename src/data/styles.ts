/**
 * The haircut catalog. Prices are placeholders in euros — edit freely.
 * `image` is an Unsplash photo id (see `photo()` in lib/utils). The photos are
 * stock references chosen to resemble each cut; swap in your own work when you can.
 */
export type StyleCategory = "Fade" | "Taper" | "Modern" | "Classic" | "Beard";

export interface HairStyle {
  id: string;
  name: string;
  category: StyleCategory;
  description: string;
  /** Starting price in euros (optional). */
  priceFrom?: number;
  /** Service this style is usually booked as (id from data/services.ts). */
  serviceId: string;
  image: string;
  /** CSS object-position for the card crop. */
  focus?: string;
}

export const styleCategories: StyleCategory[] = ["Fade", "Taper", "Modern", "Classic", "Beard"];

export const hairStyles: HairStyle[] = [
  // ── Fade styles ────────────────────────────────────────────────
  {
    id: "low-fade",
    name: "Low Fade",
    category: "Fade",
    description: "The blend starts just above the ear and stays close to the hairline. Subtle, tidy and easy to wear to work.",
    priceFrom: 28,
    serviceId: "standard-haircut",
    image: "1578390432942-d323db577792",
  },
  {
    id: "mid-fade",
    name: "Mid Fade",
    category: "Fade",
    description: "Fades out around the temple. The most balanced fade — clean on the sides without going too bold.",
    priceFrom: 28,
    serviceId: "standard-haircut",
    image: "1562004760-aceed7bb0fe3",
  },
  {
    id: "high-fade",
    name: "High Fade",
    category: "Fade",
    description: "The blend climbs high on the head for strong contrast with the length on top. Sharp and low maintenance.",
    priceFrom: 28,
    serviceId: "standard-haircut",
    image: "1640301133543-41fe25ad6450",
  },
  {
    id: "skin-fade",
    name: "Skin Fade",
    category: "Fade",
    description: "Taken right down to the skin at the bottom, then blended up seamlessly. The cleanest finish we do.",
    priceFrom: 32,
    serviceId: "skin-fade",
    image: "1593702275687-f8b402bf1fb5",
  },
  {
    id: "drop-fade",
    name: "Drop Fade",
    category: "Fade",
    description: "The fade line curves down behind the ear and follows the shape of the head. Looks great from every angle.",
    priceFrom: 32,
    serviceId: "skin-fade",
    image: "1568339434343-2a640a1a9946",
  },
  {
    id: "burst-fade",
    name: "Burst Fade",
    category: "Fade",
    description: "A rounded fade that radiates out around the ear, leaving length at the back. Pairs well with curls or a mullet.",
    priceFrom: 32,
    serviceId: "skin-fade",
    image: "1633601851802-ad8eb2bcf1f4",
  },

  // ── Taper styles ───────────────────────────────────────────────
  {
    id: "low-taper-fade",
    name: "Low Taper Fade",
    category: "Taper",
    description: "Only the sideburns and neckline are tapered. Keeps most of your length and grows out naturally.",
    priceFrom: 30,
    serviceId: "taper-fade",
    image: "1792636893217-4a317c0e4661",
  },
  {
    id: "mid-taper-fade",
    name: "Mid Taper Fade",
    category: "Taper",
    description: "The taper rises to mid-ear height for a little more definition while the sides stay full.",
    priceFrom: 30,
    serviceId: "taper-fade",
    image: "1793844857636-2a9c6b2ed927",
  },
  {
    id: "high-taper-fade",
    name: "High Taper Fade",
    category: "Taper",
    description: "A taller taper that tightens the whole outline. A good step up if you are not ready for a full fade.",
    priceFrom: 30,
    serviceId: "taper-fade",
    image: "1456327102063-fb5054efe647",
  },
  {
    id: "temple-taper",
    name: "Temple Taper",
    category: "Taper",
    description: "A small, precise fade at the temples and nape with a crisp line-up. Sharpens any cut without changing it.",
    priceFrom: 30,
    serviceId: "taper-fade",
    image: "1684778243737-bd5b1d4c1b75",
  },

  // ── Modern styles ──────────────────────────────────────────────
  {
    id: "textured-crop",
    name: "Textured Crop",
    category: "Modern",
    description: "Short, choppy layers on top pushed forward, with tight sides. Style it in under a minute.",
    priceFrom: 28,
    serviceId: "standard-haircut",
    image: "1619182597083-17bda72c1d56",
  },
  {
    id: "french-crop",
    name: "French Crop",
    category: "Modern",
    description: "A blunt, straight fringe over faded sides. Structured, bold and very easy to maintain.",
    priceFrom: 28,
    serviceId: "standard-haircut",
    image: "1673118306590-0a82988ba2c3",
  },
  {
    id: "buzz-cut",
    name: "Buzz Cut",
    category: "Modern",
    description: "One short length all over, finished with a clean outline. Zero styling required.",
    priceFrom: 22,
    serviceId: "standard-haircut",
    image: "1645857196258-0cfa436b38db",
  },
  {
    id: "modern-mullet",
    name: "Modern Mullet",
    category: "Modern",
    description: "Shorter, textured sides with length kept at the back. The updated take — softer and more wearable.",
    priceFrom: 30,
    serviceId: "standard-haircut",
    image: "1700585560130-84a0a58e420f",
  },
  {
    id: "curly-top-fade",
    name: "Curly Top Fade",
    category: "Modern",
    description: "Natural curls shaped and left full on top, with faded sides to keep everything defined.",
    priceFrom: 30,
    serviceId: "standard-haircut",
    image: "1790270577169-39ca3de9f98c",
  },
  {
    id: "messy-fringe",
    name: "Messy Fringe",
    category: "Modern",
    description: "Longer, layered hair falling loosely over the forehead. Relaxed, textured and deliberately undone.",
    priceFrom: 28,
    serviceId: "standard-haircut",
    image: "1639930609449-18868948701d",
  },
  {
    id: "two-block",
    name: "Two-Block Haircut",
    category: "Modern",
    description: "Short undercut sides sitting beneath a longer, fuller top section. Clean contrast with lots of movement.",
    priceFrom: 30,
    serviceId: "standard-haircut",
    image: "1509112552557-8eb3dab85cfc",
  },
  {
    id: "crew-cut",
    name: "Crew Cut",
    category: "Modern",
    description: "Short on top, shorter on the sides, slightly longer at the front. A timeless, athletic shape.",
    priceFrom: 25,
    serviceId: "standard-haircut",
    image: "1582852629465-2dc90cbcc6d2",
  },

  // ── Classic styles ─────────────────────────────────────────────
  {
    id: "pompadour",
    name: "Pompadour",
    category: "Classic",
    description: "Volume swept up and back from the forehead with tight sides. A statement cut with real presence.",
    priceFrom: 30,
    serviceId: "standard-haircut",
    image: "1695662917617-a1bfc0e2fbed",
  },
  {
    id: "slick-back",
    name: "Slick Back",
    category: "Classic",
    description: "Medium length combed straight back with a polished finish. Smart, confident and always in style.",
    priceFrom: 28,
    serviceId: "standard-haircut",
    image: "1566070294271-0cb77eb47f6e",
  },
  {
    id: "side-part",
    name: "Side Part",
    category: "Classic",
    description: "A defined parting with hair combed neatly across. The gentleman's cut — sharp in any setting.",
    priceFrom: 28,
    serviceId: "standard-haircut",
    image: "1588153909116-0769ecca086d",
  },
  {
    id: "comb-over",
    name: "Comb Over",
    category: "Classic",
    description: "Length on top swept to one side over tapered sides. Softer than a side part, with more volume.",
    priceFrom: 28,
    serviceId: "standard-haircut",
    image: "1584029307290-2acd5258bde4",
  },
  {
    id: "classic-scissor-cut",
    name: "Classic Scissor Cut",
    category: "Classic",
    description: "Cut entirely with scissors for a natural, soft finish. Ideal for medium and longer hair.",
    priceFrom: 30,
    serviceId: "standard-haircut",
    image: "1553521041-d168abd31de3",
  },

  // ── Beard styles ───────────────────────────────────────────────
  {
    id: "beard-fade",
    name: "Beard Fade",
    category: "Beard",
    description: "The beard is blended into the sideburns so hair and beard flow together without a hard line.",
    priceFrom: 15,
    serviceId: "beard-trim",
    image: "1629189784191-9afdcbcb0398",
  },
  {
    id: "short-boxed-beard",
    name: "Short Boxed Beard",
    category: "Beard",
    description: "Kept short with sharp, squared cheek and neck lines. Neat, professional and easy to keep up.",
    priceFrom: 15,
    serviceId: "beard-trim",
    image: "1618306842557-a2515acf2112",
  },
  {
    id: "full-beard",
    name: "Full Beard",
    category: "Beard",
    description: "Grown out and shaped for density and balance. We trim, line up and condition it.",
    priceFrom: 18,
    serviceId: "beard-trim",
    image: "1607346256330-dee7af15f7c5",
  },
  {
    id: "goatee",
    name: "Goatee",
    category: "Beard",
    description: "Hair kept around the chin and mouth with clean-shaven cheeks. Defines the jaw.",
    priceFrom: 15,
    serviceId: "beard-trim",
    image: "1768693480279-5e1a5a5b2590",
  },
  {
    id: "clean-shave",
    name: "Clean Shave",
    category: "Beard",
    description: "A close straight-razor shave with hot towels before and after. Smooth skin, nothing left behind.",
    priceFrom: 25,
    serviceId: "hot-towel-shave",
    image: "1600603406200-5b2a104684ac",
  },
];

export function getStyle(id: string | null | undefined) {
  return hairStyles.find((s) => s.id === id);
}
