import { NextResponse } from "next/server";
import { getBarber } from "@/data/barbers";
import { getService } from "@/data/services";
import { getStyle } from "@/data/styles";
import { createBooking, SlotTakenError } from "@/lib/db";
import { isWithinBookingWindow, parseDate, shopNow, startTimesFor, toMinutes } from "@/lib/schedule";
import { bookingSchema, type FieldErrors } from "@/lib/validation";

export const dynamic = "force-dynamic";

/**
 * POST /api/bookings
 * Validates everything again on the server, then saves the booking.
 * Responds 201 only after the row is committed to the database.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "The request could not be read." }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: FieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof FieldErrors;
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json({ error: "Check the highlighted fields.", fieldErrors }, { status: 400 });
  }
  const input = parsed.data;

  // Never trust ids, prices or durations from the browser — look them up here.
  const service = getService(input.serviceId);
  const barber = getBarber(input.barberId);
  const style = input.styleId ? getStyle(input.styleId) : undefined;
  if (!service) return NextResponse.json({ error: "That service is not available." }, { status: 400 });
  if (!barber) return NextResponse.json({ error: "That barber is not available." }, { status: 400 });
  if (input.styleId && !style) return NextResponse.json({ error: "That style is not available." }, { status: 400 });

  if (!parseDate(input.date) || !isWithinBookingWindow(input.date)) {
    return NextResponse.json({ error: "Choose a date within the booking window." }, { status: 400 });
  }
  if (!startTimesFor(input.date, service.duration).includes(input.time)) {
    return NextResponse.json(
      { error: "That time is outside opening hours for this service. Choose another time." },
      { status: 400 },
    );
  }
  const now = shopNow();
  if (input.date === now.date && toMinutes(input.time) <= now.minutes) {
    return NextResponse.json({ error: "That time has already passed. Choose a later time." }, { status: 400 });
  }

  try {
    const booking = await createBooking({
      serviceId: service.id,
      styleId: style?.id ?? null,
      barberId: barber.id,
      date: input.date,
      time: input.time,
      duration: service.duration,
      price: service.price,
      name: input.name,
      phone: input.phone,
      email: input.email,
      notes: input.notes || null,
    });

    return NextResponse.json(
      {
        reference: booking.reference,
        service: service.name,
        style: style?.name ?? null,
        barber: barber.name,
        date: input.date,
        time: input.time,
        duration: service.duration,
        price: service.price,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof SlotTakenError) {
      return NextResponse.json(
        { error: "Someone just booked that time. Pick another slot.", code: "SLOT_TAKEN" },
        { status: 409 },
      );
    }
    console.error("[bookings] database error", error);
    return NextResponse.json(
      { error: "We couldn't save your booking. Nothing was booked — try again, or call us." },
      { status: 500 },
    );
  }
}
