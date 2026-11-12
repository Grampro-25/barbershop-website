/**
 * Testimonials. These are PLACEHOLDERS, clearly labelled as samples on the
 * site. Replace them with real reviews from your customers (with permission)
 * and set `isPlaceholder` to false to remove the "Sample" label.
 */
export interface Review {
  id: string;
  name: string;
  service: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  isPlaceholder: boolean;
}

export const reviews: Review[] = [
  {
    id: "r1",
    name: "Customer name",
    service: "Skin Fade",
    rating: 5,
    text: "Your first customer review goes here. Two or three sentences about the cut and the visit work best.",
    isPlaceholder: true,
  },
  {
    id: "r2",
    name: "Customer name",
    service: "Haircut + Beard",
    rating: 5,
    text: "Add a second review here. Reviews that mention a barber by name or a specific service feel the most genuine.",
    isPlaceholder: true,
  },
  {
    id: "r3",
    name: "Customer name",
    service: "Hot Towel Shave",
    rating: 5,
    text: "And a third. You can copy reviews from your Google Business profile once you have asked the customer.",
    isPlaceholder: true,
  },
];
