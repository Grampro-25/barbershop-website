/** Gallery photos (Unsplash ids). Replace with photos of your own work. */
export type GalleryCategory = "Fades & Tapers" | "Classic" | "Beards" | "The Shop";

export interface GalleryItem {
  id: string;
  image: string;
  alt: string;
  category: GalleryCategory;
  /** Taller tile in the grid. */
  tall?: boolean;
}

export const galleryCategories: GalleryCategory[] = ["Fades & Tapers", "Classic", "Beards", "The Shop"];

export const galleryItems: GalleryItem[] = [
  { id: "g1", image: "1618049049816-43a00d5b0c3d", alt: "Fresh fade with a textured quiff", category: "Fades & Tapers", tall: true },
  { id: "g2", image: "1781455793310-8427c96454c7", alt: "Barbershop interior with chairs and mirrors", category: "The Shop" },
  { id: "g3", image: "1630827020718-3433092696e7", alt: "Profile of a sculpted full beard", category: "Beards" },
  { id: "g4", image: "1627100232173-acf3733f02bc", alt: "Side profile of a tight fade", category: "Fades & Tapers" },
  { id: "g5", image: "1653848067570-ccc640e5b3cc", alt: "Classic side-swept cut", category: "Classic", tall: true },
  { id: "g6", image: "1792523227995-9ac04cf1d94d", alt: "Black and gold barber chairs", category: "The Shop" },
  { id: "g7", image: "1619233543640-af09c173763b", alt: "Fade blended into a full beard", category: "Beards" },
  { id: "g8", image: "1648742468740-6347e05c7faa", alt: "Short crop with a clean taper", category: "Fades & Tapers" },
  { id: "g9", image: "1717089256239-dc2ed4d9dfc6", alt: "Straight-razor beard line-up", category: "Beards", tall: true },
  { id: "g11", image: "1582771498000-8ad44e6c84db", alt: "Scissor work in the chair", category: "Classic" },
  { id: "g12", image: "1599351431613-18ef1fdd27e1", alt: "Clippers laid out on the station", category: "The Shop" },
  { id: "g13", image: "1517832606299-7ae9b720a186", alt: "Hot towel shave in progress", category: "Beards" },
  { id: "g14", image: "1675599193741-e6f078a65fbd", alt: "Scissors and combs on a wooden bench", category: "The Shop" },
  { id: "g15", image: "1533245270348-821d4d5c7514", alt: "Detailing a fade with clippers", category: "Fades & Tapers" },
  { id: "g16", image: "1781925856343-c97d0d44f94c", alt: "Waiting area of the barbershop", category: "The Shop" },
];

/**
 * Before / after pairs. These are ILLUSTRATIVE stock photos (not the same
 * client) so the slider has something to show — replace each pair with real
 * before and after shots of the same person.
 */
export const beforeAfter = [
  {
    id: "ba1",
    label: "Overgrown to textured crop",
    before: { image: "1541260894924-7ff059b93d54", alt: "Long, overgrown fringe before the cut" },
    after: { image: "1619182597083-17bda72c1d56", alt: "Short textured crop after the cut" },
  },
  {
    id: "ba2",
    label: "Full beard reshaped",
    before: { image: "1522075469751-3a6694fb2f61", alt: "Untrimmed curly hair and beard before" },
    after: { image: "1629189784191-9afdcbcb0398", alt: "Sharp beard fade after" },
  },
];

export const heroImage = "1792735207211-a96ca7e6ea77";
export const interiorImage = "1610475680335-dafab5475150";
