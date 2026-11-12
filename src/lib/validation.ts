import { z } from "zod";
import { DATE_RE, TIME_RE } from "@/lib/schedule";

/** Shape of a booking request. Used by the API route; the form mirrors these rules. */
export const bookingSchema = z.object({
  serviceId: z.string().min(1).max(60),
  styleId: z.string().max(60).nullable().optional(),
  barberId: z.string().min(1).max(60),
  date: z.string().regex(DATE_RE, "Choose a date."),
  time: z.string().regex(TIME_RE, "Choose a time."),
  name: z
    .string()
    .trim()
    .min(2, "Enter your full name.")
    .max(80, "That name is too long."),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9 ()\-.]{7,20}$/, "Enter a phone number we can reach you on, e.g. +49 170 1234567."),
  email: z.string().trim().toLowerCase().email("Enter a valid email address.").max(120),
  notes: z.string().trim().max(500, "Keep notes under 500 characters.").optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export type FieldErrors = Partial<Record<keyof BookingInput, string>>;

/** Client-side check of the contact fields, using the same rules as the server. */
export function validateContact(values: { name: string; phone: string; email: string; notes: string }) {
  const result = bookingSchema.pick({ name: true, phone: true, email: true, notes: true }).safeParse(values);
  const errors: FieldErrors = {};
  if (!result.success) {
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof BookingInput;
      if (!errors[key]) errors[key] = issue.message;
    }
  }
  return errors;
}
