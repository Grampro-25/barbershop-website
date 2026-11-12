# Luxury Barbershop — Next.js

Next.js (App Router) · TypeScript · Tailwind CSS 4 · Motion · Lucide · SQLite bookings

## Run it

Requires **Node 22.5 or newer** (the booking database uses Node's built-in `node:sqlite`).

```bash
npm install
npm run dev        # http://localhost:3000
```

Production: `npm run build` then `npm start`.

## Edit your content (no code needed)

Everything is placeholder content. Edit these files:

| What | File |
| --- | --- |
| Shop name, address, phone, Instagram, WhatsApp, Maps link, opening hours, timezone | `src/data/site.ts` |
| The 28 haircut and beard styles, descriptions, prices, photos | `src/data/styles.ts` |
| Services and euro prices, durations | `src/data/services.ts` |
| Barbers | `src/data/barbers.ts` |
| Gallery and before/after pairs | `src/data/gallery.ts` |
| Reviews (currently labelled "Sample") | `src/data/reviews.ts` |
| Colours | `src/app/globals.css` (`@theme` block) |

Photos are Unsplash stock images referenced by id. To use your own, put files in `public/images/` and use `"/images/name.jpg"` as the `image` value (and change `photo()` in `src/lib/utils.ts` to return it unchanged).

## How booking works

- `GET /api/availability` returns real free times from the database, hiding past times, closed days and taken slots.
- `POST /api/bookings` re-validates everything on the server (ids, prices and durations come from the server, never the browser), then saves.
- **Double-booking is prevented by the database**: each booking reserves one row per 30-minute slot with a primary key on (barber, date, time). Overlapping or simultaneous requests fail with HTTP 409. Tested with 6 simultaneous requests: 1 succeeded, 5 were rejected.
- The confirmation screen only appears after the booking is saved.
- **Storage:** with no setup, `npm run dev` stores bookings in a local SQLite file, `data/bookings.db` (git-ignored). When `POSTGRES_URL` (or `DATABASE_URL`) is set, the same code uses PostgreSQL instead. Tables are created automatically on first use.
- **On Vercel:** add a Postgres database (Neon, from the Vercel Marketplace: `vercel integration add neon`), which sets `POSTGRES_URL` for you. Without it the live site shows an error rather than pretending to save, because Vercel's disk is temporary.

**Not built yet:** confirmation emails/SMS, an admin page to view or cancel bookings (view them with any SQLite tool), and online payment (price is paid in the shop).

## Project layout

```
src/app          pages, layout, API routes
src/components   sections (Hero, StyleCatalog, Booking, …) and ui/ primitives
src/data         all editable content
src/lib          schedule logic, database, validation, utilities
```

`src/components/ui/focus-cards.tsx` is adapted from Aceternity UI (used on the barber cards).
