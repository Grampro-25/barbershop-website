"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { getStyle } from "@/data/styles";
import { scrollToElement } from "@/lib/lenis-store";

/**
 * Shares the customer's selections between the catalog, service cards,
 * barber cards and the booking form, so a choice made anywhere on the page
 * is already filled in when they reach the form.
 */
interface BookingSelection {
  styleId: string | null;
  serviceId: string | null;
  barberId: string | null;
  /** Bumped whenever a selection is made outside the form, so the form can react. */
  version: number;
  setStyleId: (id: string | null) => void;
  setServiceId: (id: string | null) => void;
  setBarberId: (id: string | null) => void;
  chooseStyle: (id: string) => void;
  chooseService: (id: string) => void;
  chooseBarber: (id: string) => void;
}

const BookingContext = createContext<BookingSelection | null>(null);

export function scrollToBooking() {
  // Land on the form itself so the carried-over selection is visible straight away.
  const el = document.getElementById("booking-form") ?? document.getElementById("booking");
  if (!el) return;
  scrollToElement(el);
}

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [styleId, setStyleId] = useState<string | null>(null);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [barberId, setBarberId] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  const chooseStyle = useCallback((id: string) => {
    const style = getStyle(id);
    setStyleId(id);
    // Each style maps to the service it is normally booked as.
    if (style) setServiceId(style.serviceId);
    setVersion((v) => v + 1);
    scrollToBooking();
  }, []);

  const chooseService = useCallback((id: string) => {
    setServiceId(id);
    setVersion((v) => v + 1);
    scrollToBooking();
  }, []);

  const chooseBarber = useCallback((id: string) => {
    setBarberId(id);
    setVersion((v) => v + 1);
    scrollToBooking();
  }, []);

  const value = useMemo(
    () => ({
      styleId,
      serviceId,
      barberId,
      version,
      setStyleId,
      setServiceId,
      setBarberId,
      chooseStyle,
      chooseService,
      chooseBarber,
    }),
    [styleId, serviceId, barberId, version, chooseStyle, chooseService, chooseBarber],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}
