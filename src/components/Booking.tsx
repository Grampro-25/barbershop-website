"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, CalendarCheck, Check, Clock, LoaderCircle, RefreshCw, TriangleAlert, X } from "lucide-react";
import { barbers, getBarber } from "@/data/barbers";
import { getService, services } from "@/data/services";
import { site } from "@/data/site";
import { getStyle, hairStyles, styleCategories } from "@/data/styles";
import { useBooking } from "@/components/BookingContext";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { bookableDates } from "@/lib/schedule";
import { cn, formatLongDate, formatPrice, photo } from "@/lib/utils";
import { validateContact, type FieldErrors } from "@/lib/validation";

const steps = ["Service", "Barber", "Date & time", "Your details", "Review"] as const;

interface Slot {
  time: string;
  available: boolean;
}

type SlotState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; slots: Slot[] }
  | { status: "error"; message: string };

interface Confirmation {
  reference: string;
  service: string;
  style: string | null;
  barber: string;
  date: string;
  time: string;
  duration: number;
  price: number;
}

const emptyContact = { name: "", phone: "", email: "", notes: "" };

export function Booking() {
  const { styleId, serviceId, barberId, version, setStyleId, setServiceId, setBarberId } = useBooking();
  const reduce = useReducedMotion();

  const [step, setStep] = useState(0);
  const [dates, setDates] = useState<{ date: string; open: boolean }[]>([]);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [slotState, setSlotState] = useState<SlotState>({ status: "idle" });
  const [reloadKey, setReloadKey] = useState(0);
  const [contact, setContact] = useState(emptyContact);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  const panelRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  const service = getService(serviceId);
  const style = getStyle(styleId);
  const barber = getBarber(barberId);

  // Dates depend on "now", so build them on the client only.
  useEffect(() => setDates(bookableDates()), []);

  // A selection made elsewhere on the page (catalog, service or barber card)
  // brings the customer back to the first step with that choice filled in.
  useEffect(() => {
    if (version === 0) return;
    setConfirmation(null);
    setStep(0);
  }, [version]);

  // Changing service, barber or date invalidates the chosen time.
  useEffect(() => setTime(null), [serviceId, barberId, date]);

  // Load real availability from the server.
  useEffect(() => {
    if (!serviceId || !barberId || !date) {
      setSlotState({ status: "idle" });
      return;
    }
    const controller = new AbortController();
    setSlotState({ status: "loading" });
    const params = new URLSearchParams({ service: serviceId, barber: barberId, date });
    fetch(`/api/availability?${params}`, { signal: controller.signal, cache: "no-store" })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error ?? "We couldn't load the schedule.");
        setSlotState({ status: "ready", slots: data.slots as Slot[] });
      })
      .catch((error: Error) => {
        if (error.name === "AbortError") return;
        setSlotState({
          status: "error",
          message: error.message || "We couldn't load the schedule. Check your connection and try again.",
        });
      });
    return () => controller.abort();
  }, [serviceId, barberId, date, reloadKey]);

  // Move focus to the step heading when the step changes (not on first load).
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    panelRef.current?.focus({ preventScroll: true });
  }, [step, confirmation]);

  const stepComplete = [Boolean(service), Boolean(barber), Boolean(date && time), true, true];
  const missingHint = [
    "Choose a service to continue.",
    "Choose a barber to continue.",
    date ? "Choose a time to continue." : "Choose a date to continue.",
    "",
    "",
  ][step];

  const goNext = () => {
    setNotice(null);
    if (step === 3) {
      const found = validateContact(contact);
      setErrors(found);
      const firstInvalid = (["name", "phone", "email", "notes"] as const).find((k) => found[k]);
      if (firstInvalid) {
        document.getElementById(`booking-${firstInvalid}`)?.focus();
        return;
      }
    }
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const goBack = () => {
    setSubmitError(null);
    setStep((s) => Math.max(s - 1, 0));
  };

  const confirm = useCallback(async () => {
    if (!service || !barber || !date || !time) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: service.id,
          styleId: style?.id ?? null,
          barberId: barber.id,
          date,
          time,
          ...contact,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.status === 201) {
        setConfirmation(data as Confirmation);
        return;
      }
      if (res.status === 409) {
        // The slot was taken while the customer was filling in the form.
        setTime(null);
        setReloadKey((k) => k + 1);
        setNotice(data.error ?? "Someone just booked that time. Pick another slot.");
        setStep(2);
        return;
      }
      if (data.fieldErrors) {
        setErrors(data.fieldErrors as FieldErrors);
        setStep(3);
        return;
      }
      setSubmitError(data.error ?? "We couldn't save your booking. Nothing was booked — try again.");
    } catch {
      setSubmitError("We couldn't reach the server. Nothing was booked — check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }, [service, style, barber, date, time, contact]);

  const startOver = () => {
    setConfirmation(null);
    setStyleId(null);
    setServiceId(null);
    setBarberId(null);
    setDate(null);
    setTime(null);
    setContact(emptyContact);
    setErrors({});
    setSubmitError(null);
    setNotice(null);
    setReloadKey((k) => k + 1);
    setStep(0);
  };

  const stylesByCategory = useMemo(
    () => styleCategories.map((category) => ({ category, items: hairStyles.filter((s) => s.category === category) })),
    [],
  );

  return (
    <section id="booking" aria-labelledby="booking-title" className="relative bg-ink py-20 sm:py-28 lg:py-36">
      <div className="container-page">
        <SectionHeading
          index="03"
          label="Online booking"
          id="booking-title"
          title={
            <>
              Reserve <em className="text-gold">your chair.</em>
            </>
          }
          intro="Five short steps. Times shown are live — once you confirm, the slot is yours."
        />

        <div id="booking-form" className="mt-12 grid scroll-mt-4 gap-8 lg:grid-cols-12 lg:gap-10">
          {/* ── Form ─────────────────────────────────────────── */}
          <div className="border border-cream/12 bg-charcoal lg:col-span-8">
            {confirmation ? (
              <div ref={panelRef} tabIndex={-1} className="p-6 outline-none sm:p-10" role="status">
                <span className="grid size-14 place-items-center bg-gold text-ink">
                  <CalendarCheck className="size-7" aria-hidden="true" />
                </span>
                <h3 className="mt-6 font-display text-4xl leading-tight font-medium text-cream sm:text-5xl">
                  You're booked.
                </h3>
                <p className="mt-3 max-w-lg text-cream/70">
                  Your appointment is saved. Keep your booking reference — quote it if you need to change or cancel.
                </p>

                <dl className="mt-8 grid gap-px border border-cream/12 bg-cream/12 sm:grid-cols-2">
                  {[
                    ["Reference", confirmation.reference],
                    ["When", `${formatLongDate(confirmation.date)} at ${confirmation.time}`],
                    ["Service", confirmation.style ? `${confirmation.service} — ${confirmation.style}` : confirmation.service],
                    ["Barber", confirmation.barber],
                    ["Duration", `${confirmation.duration} min`],
                    ["Price", `${formatPrice(confirmation.price)}, paid in the shop`],
                  ].map(([k, v]) => (
                    <div key={k} className="bg-charcoal p-4">
                      <dt className="eyebrow text-cream/50">{k}</dt>
                      <dd className={cn("mt-1.5 text-cream", k === "Reference" && "font-display text-3xl tracking-[0.12em] text-gold")}>
                        {v}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button type="button" onClick={startOver} className="btn btn-outline">
                    Book another appointment
                  </button>
                  <a href="#contact" className="btn btn-outline">
                    Find the shop
                  </a>
                </div>
              </div>
            ) : (
              <>
                {/* Stepper */}
                <ol className="grid grid-cols-5 border-b border-cream/12" aria-label="Booking steps">
                  {steps.map((label, i) => {
                    const done = i < step;
                    const current = i === step;
                    const reachable = i <= step || stepComplete.slice(0, i).every(Boolean);
                    return (
                      <li key={label} className="border-r border-cream/12 last:border-r-0">
                        <button
                          type="button"
                          disabled={!reachable || i > step}
                          onClick={() => setStep(i)}
                          aria-current={current ? "step" : undefined}
                          className={cn(
                            "flex min-h-14 w-full flex-col items-center justify-center gap-1 px-1 py-3 text-center transition-colors disabled:cursor-default lg:flex-row lg:gap-2.5",
                            current ? "bg-ink text-gold" : done ? "text-cream hover:text-gold" : "text-cream/40",
                          )}
                        >
                          <span
                            className={cn(
                              "grid size-6 shrink-0 place-items-center border text-[0.6875rem] font-bold tabular-nums",
                              current ? "border-gold" : done ? "border-gold bg-gold text-ink" : "border-cream/25",
                            )}
                          >
                            {done ? <Check className="size-3.5" aria-hidden="true" /> : i + 1}
                          </span>
                          <span className="eyebrow hidden sm:block">{label}</span>
                          <span className="sr-only sm:hidden">{label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ol>

                <div className="p-5 sm:p-8">
                  {/* Keyed so each step fades in; no exit animation, so the next
                      step is on screen immediately and never waits on motion. */}
                    <motion.div
                      key={step}
                      ref={panelRef}
                      tabIndex={-1}
                      className="outline-none"
                      initial={reduce ? false : { opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="eyebrow text-cream/50">
                        Step {step + 1} of {steps.length}
                      </p>

                      {/* Step 1 — service and style */}
                      {step === 0 && (
                        <div>
                          <h3 className="mt-2 font-display text-3xl font-medium text-cream sm:text-4xl">
                            What are you coming in for?
                          </h3>

                          <fieldset className="mt-6">
                            <legend className="eyebrow text-gold">Service</legend>
                            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                              {services.map((s) => {
                                const selected = serviceId === s.id;
                                return (
                                  <label
                                    key={s.id}
                                    className={cn(
                                      "flex cursor-pointer items-center justify-between gap-4 border p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold",
                                      selected ? "border-gold bg-ink" : "border-cream/15 hover:border-cream/40",
                                    )}
                                  >
                                    <input
                                      type="radio"
                                      name="service"
                                      value={s.id}
                                      checked={selected}
                                      onChange={() => setServiceId(s.id)}
                                      className="sr-only"
                                    />
                                    <span>
                                      <span className="block font-semibold text-cream">{s.name}</span>
                                      <span className="mt-1 flex items-center gap-1.5 text-sm text-cream/55">
                                        <Clock className="size-3.5" aria-hidden="true" />
                                        {s.duration} min
                                      </span>
                                    </span>
                                    <span className="flex items-center gap-3">
                                      <span className="font-display text-2xl tabular-nums text-gold">{formatPrice(s.price)}</span>
                                      <span
                                        aria-hidden="true"
                                        className={cn(
                                          "grid size-5 place-items-center border",
                                          selected ? "border-gold bg-gold text-ink" : "border-cream/30",
                                        )}
                                      >
                                        {selected && <Check className="size-3.5" />}
                                      </span>
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          </fieldset>

                          <div className="mt-8">
                            <label htmlFor="booking-style" className="eyebrow text-gold">
                              Style <span className="text-cream/45">(optional)</span>
                            </label>
                            <div className="mt-3 flex items-stretch gap-3">
                              {style && (
                                <span className="relative block w-14 shrink-0 overflow-hidden bg-smoke">
                                  <Image
                                    src={photo(style.image, 200)}
                                    alt=""
                                    fill
                                    sizes="56px"
                                    className="object-cover"
                                    style={{ objectPosition: "center 25%" }}
                                  />
                                </span>
                              )}
                              <select
                                id="booking-style"
                                value={styleId ?? ""}
                                onChange={(e) => setStyleId(e.target.value || null)}
                                className="field"
                                aria-describedby="booking-style-hint"
                              >
                                <option value="">No specific style — I'll decide with my barber</option>
                                {stylesByCategory.map((group) => (
                                  <optgroup key={group.category} label={`${group.category} styles`}>
                                    {group.items.map((s) => (
                                      <option key={s.id} value={s.id}>
                                        {s.name}
                                      </option>
                                    ))}
                                  </optgroup>
                                ))}
                              </select>
                              {style && (
                                <button
                                  type="button"
                                  onClick={() => setStyleId(null)}
                                  aria-label={`Remove ${style.name}`}
                                  className="grid w-12 shrink-0 place-items-center border border-cream/18 text-cream/70 transition-colors hover:border-gold hover:text-gold"
                                >
                                  <X className="size-4" aria-hidden="true" />
                                </button>
                              )}
                            </div>
                            <p id="booking-style-hint" className="mt-2 text-sm text-cream/55">
                              {style
                                ? `${style.name} — your barber will see this before you arrive.`
                                : "Not sure yet? Browse the catalog above and tap “Choose This Style”."}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Step 2 — barber */}
                      {step === 1 && (
                        <fieldset>
                          <legend className="mt-2 font-display text-3xl font-medium text-cream sm:text-4xl">
                            Who would you like?
                          </legend>
                          <div className="mt-6 grid gap-3 sm:grid-cols-3">
                            {barbers.map((b) => {
                              const selected = barberId === b.id;
                              return (
                                <label
                                  key={b.id}
                                  className={cn(
                                    "flex cursor-pointer gap-4 border p-3 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold sm:flex-col sm:gap-0 sm:p-0",
                                    selected ? "border-gold bg-ink" : "border-cream/15 hover:border-cream/40",
                                  )}
                                >
                                  <input
                                    type="radio"
                                    name="barber"
                                    value={b.id}
                                    checked={selected}
                                    onChange={() => setBarberId(b.id)}
                                    className="sr-only"
                                  />
                                  <span className="relative block size-20 shrink-0 overflow-hidden bg-smoke sm:aspect-[4/3] sm:size-auto sm:w-full">
                                    <Image
                                      src={photo(b.image, 500)}
                                      alt=""
                                      fill
                                      sizes="(min-width: 640px) 240px, 80px"
                                      className={cn("object-cover transition-[filter] duration-500", !selected && "grayscale")}
                                    />
                                  </span>
                                  <span className="flex flex-1 items-start justify-between gap-3 sm:p-4">
                                    <span>
                                      <span className="block font-semibold text-cream">{b.name}</span>
                                      <span className="mt-1 block text-sm text-cream/55">
                                        {b.role} · {b.experience}
                                      </span>
                                      <span className="mt-2 block text-sm leading-5 text-cream/55">{b.specialties.join(", ")}</span>
                                    </span>
                                    <span
                                      aria-hidden="true"
                                      className={cn(
                                        "grid size-5 shrink-0 place-items-center border",
                                        selected ? "border-gold bg-gold text-ink" : "border-cream/30",
                                      )}
                                    >
                                      {selected && <Check className="size-3.5" />}
                                    </span>
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </fieldset>
                      )}

                      {/* Step 3 — date and time */}
                      {step === 2 && (
                        <div>
                          <h3 className="mt-2 font-display text-3xl font-medium text-cream sm:text-4xl">Pick a date and time.</h3>

                          {notice && (
                            <p role="alert" className="mt-5 flex items-start gap-3 border border-gold/50 bg-gold/10 p-4 text-sm text-cream">
                              <TriangleAlert className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                              {notice}
                            </p>
                          )}

                          <fieldset className="mt-6">
                            <legend className="eyebrow text-gold">Date</legend>
                            <div className="scroll-slim -mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-3 sm:-mx-8 sm:px-8">
                              {dates.map((d) => {
                                const selected = date === d.date;
                                const [y, m, day] = d.date.split("-").map(Number);
                                const utc = new Date(Date.UTC(y, m - 1, day));
                                const weekday = utc.toLocaleDateString("en-GB", { weekday: "short", timeZone: "UTC" });
                                const month = utc.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" });
                                return (
                                  <label
                                    key={d.date}
                                    className={cn(
                                      "flex w-16 shrink-0 flex-col items-center border py-3 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold",
                                      !d.open
                                        ? "cursor-not-allowed border-cream/8 text-cream/25"
                                        : selected
                                          ? "cursor-pointer border-gold bg-gold text-ink"
                                          : "cursor-pointer border-cream/15 text-cream hover:border-cream/45",
                                    )}
                                  >
                                    <input
                                      type="radio"
                                      name="date"
                                      value={d.date}
                                      checked={selected}
                                      disabled={!d.open}
                                      onChange={() => {
                                        setNotice(null);
                                        setDate(d.date);
                                      }}
                                      className="sr-only"
                                      aria-label={`${formatLongDate(d.date)}${d.open ? "" : " — closed"}`}
                                    />
                                    <span aria-hidden="true" className="eyebrow">{weekday}</span>
                                    <span aria-hidden="true" className="mt-1 font-display text-3xl leading-none tabular-nums">{day}</span>
                                    <span aria-hidden="true" className="eyebrow mt-1">{d.open ? month : "Closed"}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </fieldset>

                          <fieldset className="mt-6" aria-live="polite">
                            <legend className="eyebrow text-gold">
                              Time{date && <span className="text-cream/50"> — {formatLongDate(date)}</span>}
                            </legend>

                            {!date && <p className="mt-3 text-cream/55">Choose a date to see available times.</p>}

                            {date && slotState.status === "loading" && (
                              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5" aria-label="Loading times">
                                {Array.from({ length: 10 }, (_, i) => (
                                  <span key={i} className="h-11 animate-pulse bg-cream/8" />
                                ))}
                              </div>
                            )}

                            {date && slotState.status === "error" && (
                              <div role="alert" className="mt-3 border border-[#e0786c]/50 bg-[#e0786c]/10 p-4">
                                <p className="text-sm text-cream">{slotState.message}</p>
                                <button
                                  type="button"
                                  onClick={() => setReloadKey((k) => k + 1)}
                                  className="btn btn-outline mt-3 min-h-11 px-4 py-2"
                                >
                                  <RefreshCw className="size-4" aria-hidden="true" />
                                  Try again
                                </button>
                              </div>
                            )}

                            {date && slotState.status === "ready" && (
                              slotState.slots.some((s) => s.available) ? (
                                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                                  {slotState.slots.map((slot) => {
                                    const selected = time === slot.time;
                                    return (
                                      <label
                                        key={slot.time}
                                        className={cn(
                                          "grid min-h-11 place-items-center border text-sm font-semibold tabular-nums transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold",
                                          !slot.available
                                            ? "cursor-not-allowed border-cream/8 text-cream/25 line-through"
                                            : selected
                                              ? "cursor-pointer border-gold bg-gold text-ink"
                                              : "cursor-pointer border-cream/15 text-cream hover:border-gold hover:text-gold",
                                        )}
                                      >
                                        <input
                                          type="radio"
                                          name="time"
                                          value={slot.time}
                                          checked={selected}
                                          disabled={!slot.available}
                                          onChange={() => {
                                            setNotice(null);
                                            setTime(slot.time);
                                          }}
                                          className="sr-only"
                                          aria-label={`${slot.time}${slot.available ? "" : " — unavailable"}`}
                                        />
                                        <span aria-hidden="true">{slot.time}</span>
                                      </label>
                                    );
                                  })}
                                </div>
                              ) : (
                                <p className="mt-3 border border-cream/15 p-4 text-cream/75">
                                  {barber?.name ?? "This barber"} has no free times for this service on that day. Try another date,
                                  or go back and choose a different barber.
                                </p>
                              )
                            )}
                          </fieldset>
                        </div>
                      )}

                      {/* Step 4 — contact details */}
                      {step === 3 && (
                        <div>
                          <h3 className="mt-2 font-display text-3xl font-medium text-cream sm:text-4xl">Your details.</h3>
                          <p className="mt-2 text-sm text-cream/55">
                            We only use these to manage your appointment. Fields marked * are required.
                          </p>
                          <div className="mt-6 grid gap-5 sm:grid-cols-2">
                            <Field
                              id="booking-name"
                              label="Full name *"
                              error={errors.name}
                              input={
                                <input
                                  id="booking-name"
                                  type="text"
                                  autoComplete="name"
                                  required
                                  value={contact.name}
                                  onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
                                  aria-invalid={Boolean(errors.name)}
                                  aria-describedby={errors.name ? "booking-name-error" : undefined}
                                  className="field"
                                />
                              }
                            />
                            <Field
                              id="booking-phone"
                              label="Phone number *"
                              error={errors.phone}
                              input={
                                <input
                                  id="booking-phone"
                                  type="tel"
                                  inputMode="tel"
                                  autoComplete="tel"
                                  required
                                  placeholder="+49 170 1234567"
                                  value={contact.phone}
                                  onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                                  aria-invalid={Boolean(errors.phone)}
                                  aria-describedby={errors.phone ? "booking-phone-error" : undefined}
                                  className="field"
                                />
                              }
                            />
                            <Field
                              id="booking-email"
                              label="Email *"
                              error={errors.email}
                              className="sm:col-span-2"
                              input={
                                <input
                                  id="booking-email"
                                  type="email"
                                  inputMode="email"
                                  autoComplete="email"
                                  required
                                  placeholder="name@example.com"
                                  value={contact.email}
                                  onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                                  aria-invalid={Boolean(errors.email)}
                                  aria-describedby={errors.email ? "booking-email-error" : undefined}
                                  className="field"
                                />
                              }
                            />
                            <Field
                              id="booking-notes"
                              label="Notes for your barber (optional)"
                              error={errors.notes}
                              className="sm:col-span-2"
                              input={
                                <textarea
                                  id="booking-notes"
                                  rows={3}
                                  maxLength={500}
                                  value={contact.notes}
                                  onChange={(e) => setContact((c) => ({ ...c, notes: e.target.value }))}
                                  aria-invalid={Boolean(errors.notes)}
                                  aria-describedby={errors.notes ? "booking-notes-error" : undefined}
                                  className="field resize-y"
                                />
                              }
                            />
                          </div>
                        </div>
                      )}

                      {/* Step 5 — review */}
                      {step === 4 && (
                        <div>
                          <h3 className="mt-2 font-display text-3xl font-medium text-cream sm:text-4xl">Check your appointment.</h3>
                          <dl className="mt-6 divide-y divide-cream/12 border-y border-cream/12">
                            {[
                              { k: "Service", v: service ? `${service.name} · ${service.duration} min` : "—", to: 0 },
                              { k: "Style", v: style?.name ?? "To be decided with your barber", to: 0 },
                              { k: "Barber", v: barber?.name ?? "—", to: 1 },
                              { k: "When", v: date && time ? `${formatLongDate(date)} at ${time}` : "—", to: 2 },
                              { k: "Name", v: contact.name, to: 3 },
                              { k: "Phone", v: contact.phone, to: 3 },
                              { k: "Email", v: contact.email, to: 3 },
                              ...(contact.notes.trim() ? [{ k: "Notes", v: contact.notes, to: 3 }] : []),
                            ].map((row) => (
                              <div key={row.k} className="flex items-start justify-between gap-4 py-3.5">
                                <div className="min-w-0">
                                  <dt className="eyebrow text-cream/50">{row.k}</dt>
                                  <dd className="mt-1 break-words text-cream">{row.v}</dd>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setStep(row.to)}
                                  aria-label={`Change ${row.k.toLowerCase()}`}
                                  className="eyebrow -my-1 shrink-0 px-2 py-3 text-gold underline-offset-4 hover:underline"
                                >
                                  Change
                                </button>
                              </div>
                            ))}
                          </dl>
                          <p className="mt-5 flex items-baseline justify-between gap-4">
                            <span className="eyebrow text-cream/50">Total, paid in the shop</span>
                            <span className="font-display text-4xl tabular-nums text-gold">{service ? formatPrice(service.price) : "—"}</span>
                          </p>

                          {submitError && (
                            <p role="alert" className="mt-5 flex items-start gap-3 border border-[#e0786c]/50 bg-[#e0786c]/10 p-4 text-sm text-cream">
                              <TriangleAlert className="mt-0.5 size-4 shrink-0 text-[#e0786c]" aria-hidden="true" />
                              {submitError}
                            </p>
                          )}
                        </div>
                      )}
                    </motion.div>

                  {/* Step navigation */}
                  <div className="mt-8 flex flex-col-reverse gap-3 border-t border-cream/12 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    {step > 0 ? (
                      <button type="button" onClick={goBack} disabled={submitting} className="btn btn-outline">
                        <ArrowLeft className="size-4" aria-hidden="true" />
                        Back
                      </button>
                    ) : (
                      <span />
                    )}
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                      {!stepComplete[step] && (
                        <p id="booking-next-hint" className="text-sm text-cream/55">
                          {missingHint}
                        </p>
                      )}
                      {step < steps.length - 1 ? (
                        <button
                          type="button"
                          onClick={goNext}
                          disabled={!stepComplete[step]}
                          aria-describedby={!stepComplete[step] ? "booking-next-hint" : undefined}
                          className="btn btn-gold"
                        >
                          Continue
                          <ArrowRight className="size-4" aria-hidden="true" />
                        </button>
                      ) : (
                        <button type="button" onClick={confirm} disabled={submitting} className="btn btn-gold">
                          {submitting ? (
                            <>
                              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                              Saving your booking…
                            </>
                          ) : (
                            <>
                              Confirm Booking
                              <Check className="size-4" aria-hidden="true" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ── Live summary ─────────────────────────────────── */}
          <aside aria-label="Your appointment so far" className="lg:col-span-4">
            <div className="border border-cream/12 lg:sticky lg:top-28">
              <div className="relative aspect-[16/10] overflow-hidden bg-charcoal">
                {style ? (
                  <Image
                    src={photo(style.image, 800)}
                    alt={`${style.name} reference photo`}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover"
                    style={{ objectPosition: "center 25%" }}
                  />
                ) : (
                  <div className="grid size-full place-items-center px-6 text-center">
                    <p className="text-sm text-cream/50">Your chosen style will appear here.</p>
                  </div>
                )}
                {style && (
                  <>
                    <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/90 to-transparent" />
                    <p className="absolute inset-x-0 bottom-0 p-4">
                      <span className="eyebrow block text-gold">Selected style</span>
                      <span className="mt-1 block font-display text-3xl text-cream">{style.name}</span>
                    </p>
                  </>
                )}
              </div>
              <dl className="divide-y divide-cream/12 px-5">
                {[
                  ["Service", service?.name],
                  ["Barber", barber?.name],
                  ["Date", date ? formatLongDate(date) : undefined],
                  ["Time", time ?? undefined],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4 py-3.5">
                    <dt className="eyebrow text-cream/50">{k}</dt>
                    <dd className={cn("text-right", v ? "text-cream" : "text-cream/30")}>{v ?? "Not chosen"}</dd>
                  </div>
                ))}
                <div className="flex items-baseline justify-between gap-4 py-4">
                  <dt className="eyebrow text-cream/50">Total</dt>
                  <dd className="font-display text-3xl tabular-nums text-gold">{service ? formatPrice(service.price) : "—"}</dd>
                </div>
              </dl>
              <p className="border-t border-cream/12 px-5 py-4 text-sm leading-6 text-cream/55">
                Prefer to talk? Call{" "}
                <a href={site.contact.phoneHref} className="text-cream underline underline-offset-4 hover:text-gold">
                  {site.contact.phone}
                </a>
                .
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  error,
  input,
  className,
}: {
  id: string;
  label: string;
  error?: string;
  input: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="eyebrow mb-2 block text-cream/70">
        {label}
      </label>
      {input}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-[#f0a79e]">
          {error}
        </p>
      )}
    </div>
  );
}
