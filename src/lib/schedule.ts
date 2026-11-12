import { site } from "@/data/site";

/** Pure scheduling helpers shared by the server routes and the booking form. */

export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
export const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function toTime(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Parse "YYYY-MM-DD" strictly; returns null for impossible dates such as 2026-02-31. */
export function parseDate(isoDate: string) {
  if (!DATE_RE.test(isoDate)) return null;
  const [y, m, d] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) return null;
  return date;
}

export function weekdayOf(isoDate: string) {
  const date = parseDate(isoDate);
  return date ? date.getUTCDay() : null;
}

/** Current date and time in the shop's timezone. */
export function shopNow(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: site.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

export function addDays(isoDate: string, days: number) {
  const date = parseDate(isoDate)!;
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** Every date customers may currently pick, starting today (shop time). */
export function bookableDates(now = new Date()) {
  const today = shopNow(now).date;
  const dates: { date: string; open: boolean }[] = [];
  for (let i = 0; i <= site.bookingWindowDays; i++) {
    const date = addDays(today, i);
    dates.push({ date, open: site.hours[weekdayOf(date)!] !== null });
  }
  return dates;
}

export function isWithinBookingWindow(isoDate: string, now = new Date()) {
  const today = shopNow(now).date;
  return isoDate >= today && isoDate <= addDays(today, site.bookingWindowDays);
}

/**
 * Start times on `isoDate` at which a service of `duration` minutes fits
 * inside opening hours. Does not consider existing bookings.
 */
export function startTimesFor(isoDate: string, duration: number) {
  const weekday = weekdayOf(isoDate);
  if (weekday === null) return [];
  const hours = site.hours[weekday];
  if (!hours) return [];
  const open = toMinutes(hours.open);
  const close = toMinutes(hours.close);
  const times: string[] = [];
  for (let t = open; t + duration <= close; t += site.slotMinutes) times.push(toTime(t));
  return times;
}

/** The individual slots a booking occupies, e.g. 10:00 for 60 min -> ["10:00", "10:30"]. */
export function slotsCovered(start: string, duration: number) {
  const slots: string[] = [];
  const begin = toMinutes(start);
  for (let t = begin; t < begin + duration; t += site.slotMinutes) slots.push(toTime(t));
  return slots;
}
