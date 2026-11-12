/** Barber profiles. Names, experience and photos are placeholders — replace with your team. */
export interface Barber {
  id: string;
  name: string;
  role: string;
  experience: string;
  specialties: string[];
  image: string;
}

export const barbers: Barber[] = [
  {
    id: "barber-1",
    name: "Barber Name One",
    role: "Master Barber",
    experience: "10+ years",
    specialties: ["Skin fades", "Beard sculpting", "Hot towel shaves"],
    image: "1598524374912-6b0b0bab43dd",
  },
  {
    id: "barber-2",
    name: "Barber Name Two",
    role: "Senior Barber",
    experience: "7 years",
    specialties: ["Classic scissor cuts", "Pompadours", "Side parts"],
    image: "1635273051937-a0ddef9573b6",
  },
  {
    id: "barber-3",
    name: "Barber Name Three",
    role: "Barber",
    experience: "4 years",
    specialties: ["Tapers", "Textured crops", "Curly hair"],
    image: "1599351431202-1e0f0137899a",
  },
];

export function getBarber(id: string | null | undefined) {
  return barbers.find((b) => b.id === id);
}
