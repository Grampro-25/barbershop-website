import { NextResponse } from "next/server";
import { getBarber } from "@/data/barbers";
import { getService } from "@/data/services";
import { takenSlots } from "@/lib/db";
import { isWithinBookingWindow, parseDate, shopNow, slotsCovered, startTimesFor, toMinutes } from "@/lib/schedule";

export const dynamic = "force-dynamic";

/**
 * GET /api/availability?barber=<id>&service=<id>&date=YYYY-MM-DD
 * Returns the real start times for that barber and service, read from the database.
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const barber = getBarber(params.get("barber"));
  const service = getService(params.get("service"));
  const date = params.get("date") ?? "";

  if (!barber || !service || !parseDate(date)) {
    return NextResponse.json({ error: "Choose a service, a barber and a date." }, { status: 400 });
  }
  if (!isWithinBookingWindow(date)) {
    return NextResponse.json({ error: "That date is outside the booking window." }, { status: 400 });
  }

  let taken: Set<string>;
  try {
    taken = await takenSlots(barber.id, date);
  } catch (error) {
    console.error("[availability] database error", error);
    return NextResponse.json(
      { error: "We couldn't load the schedule. Try again in a moment." },
      { status: 500 },
    );
  }

  const now = shopNow();
  const slots = startTimesFor(date, service.duration).map((time) => {
    const inPast = date === now.date && toMinutes(time) <= now.minutes;
    const clash = slotsCovered(time, service.duration).some((slot) => taken.has(slot));
    return { time, available: !inPast && !clash };
  });

  return NextResponse.json({ date, slots }, { headers: { "Cache-Control": "no-store" } });
}
