import "server-only";
import type { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { Pool } from "pg";
import { slotsCovered } from "@/lib/schedule";

/**
 * Booking storage with two interchangeable backends:
 *
 *  - PostgreSQL when `POSTGRES_URL` / `DATABASE_URL` is set (production on
 *    Vercel, using a Neon database from the Vercel Marketplace).
 *  - A local SQLite file at /data/bookings.db otherwise (development), so
 *    `npm run dev` works with no setup.
 *
 * Double-booking prevention is the same in both: every booking writes one row
 * per 30-minute slot it occupies into `booking_slots`, whose primary key is
 * (barber, date, time). Two overlapping bookings collide on that key and the
 * second one is rolled back — the database enforces it, not just app code.
 */

export interface NewBooking {
  serviceId: string;
  styleId: string | null;
  barberId: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  name: string;
  phone: string;
  email: string;
  notes: string | null;
}

export class SlotTakenError extends Error {
  constructor() {
    super("That time has just been booked.");
    this.name = "SlotTakenError";
  }
}

/** Slots already taken for a barber on a date, e.g. Set {"10:00", "10:30"}. */
export async function takenSlots(barberId: string, date: string): Promise<Set<string>> {
  return (await backend()).takenSlots(barberId, date);
}

/**
 * Save a booking and reserve its slots in one transaction.
 * Throws SlotTakenError if any slot is already reserved.
 */
export async function createBooking(input: NewBooking): Promise<{ reference: string }> {
  return (await backend()).createBooking(input, newReference());
}

function newReference() {
  // 8 characters, no look-alike letters or digits.
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from(randomBytes(8), (b) => alphabet[b % alphabet.length]).join("");
}

interface Backend {
  takenSlots(barberId: string, date: string): Promise<Set<string>>;
  createBooking(input: NewBooking, reference: string): Promise<{ reference: string }>;
}

const globalForDb = globalThis as unknown as { __bookingsBackend?: Promise<Backend> };

function backend() {
  if (!globalForDb.__bookingsBackend) {
    const url = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;
    globalForDb.__bookingsBackend = url ? postgresBackend(url) : sqliteBackend();
    // If setup fails, allow a retry on the next request instead of caching the failure.
    globalForDb.__bookingsBackend.catch(() => {
      globalForDb.__bookingsBackend = undefined;
    });
  }
  return globalForDb.__bookingsBackend;
}

// ── PostgreSQL ────────────────────────────────────────────────────────────

async function postgresBackend(url: string): Promise<Backend> {
  // Hosted databases (Neon) require TLS. The connection string carries sslmode=require.
  const pool = new Pool({ connectionString: url, max: 3 });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id          BIGSERIAL PRIMARY KEY,
      reference   TEXT NOT NULL UNIQUE,
      service_id  TEXT NOT NULL,
      style_id    TEXT,
      barber_id   TEXT NOT NULL,
      date        TEXT NOT NULL,
      start_time  TEXT NOT NULL,
      duration    INTEGER NOT NULL,
      price       INTEGER NOT NULL,
      name        TEXT NOT NULL,
      phone       TEXT NOT NULL,
      email       TEXT NOT NULL,
      notes       TEXT,
      status      TEXT NOT NULL DEFAULT 'confirmed',
      created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS booking_slots (
      barber_id   TEXT NOT NULL,
      date        TEXT NOT NULL,
      time        TEXT NOT NULL,
      booking_id  BIGINT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
      PRIMARY KEY (barber_id, date, time)
    );
    CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date, barber_id);
  `);

  return {
    async takenSlots(barberId, date) {
      const { rows } = await pool.query<{ time: string }>(
        "SELECT time FROM booking_slots WHERE barber_id = $1 AND date = $2",
        [barberId, date],
      );
      return new Set(rows.map((r) => r.time));
    },

    async createBooking(input, reference) {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const inserted = await client.query<{ id: string }>(
          `INSERT INTO bookings
             (reference, service_id, style_id, barber_id, date, start_time, duration, price, name, phone, email, notes)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
           RETURNING id`,
          [
            reference,
            input.serviceId,
            input.styleId,
            input.barberId,
            input.date,
            input.time,
            input.duration,
            input.price,
            input.name,
            input.phone,
            input.email,
            input.notes,
          ],
        );
        const bookingId = inserted.rows[0].id;
        for (const slot of slotsCovered(input.time, input.duration)) {
          await client.query(
            "INSERT INTO booking_slots (barber_id, date, time, booking_id) VALUES ($1, $2, $3, $4)",
            [input.barberId, input.date, slot, bookingId],
          );
        }
        await client.query("COMMIT");
        return { reference };
      } catch (error) {
        await client.query("ROLLBACK").catch(() => {});
        // 23505 = unique_violation. On booking_slots that means the slot was taken.
        const e = error as { code?: string; constraint?: string };
        if (e.code === "23505" && e.constraint?.startsWith("booking_slots")) throw new SlotTakenError();
        throw error;
      } finally {
        client.release();
      }
    },
  };
}

// ── SQLite (local development) ────────────────────────────────────────────

async function sqliteBackend(): Promise<Backend> {
  if (process.env.VERCEL) {
    // Serverless disks are read-only/temporary: refuse rather than lose bookings.
    throw new Error("No database configured. Set POSTGRES_URL (add a Postgres database in Vercel).");
  }

  const { DatabaseSync: Database } = await import("node:sqlite");
  const file = process.env.BOOKINGS_DB_PATH ?? path.join(process.cwd(), "data", "bookings.db");
  mkdirSync(path.dirname(file), { recursive: true });
  const db: DatabaseSync = new Database(file);
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    PRAGMA busy_timeout = 5000;

    CREATE TABLE IF NOT EXISTS bookings (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      reference   TEXT NOT NULL UNIQUE,
      service_id  TEXT NOT NULL,
      style_id    TEXT,
      barber_id   TEXT NOT NULL,
      date        TEXT NOT NULL,
      start_time  TEXT NOT NULL,
      duration    INTEGER NOT NULL,
      price       INTEGER NOT NULL,
      name        TEXT NOT NULL,
      phone       TEXT NOT NULL,
      email       TEXT NOT NULL,
      notes       TEXT,
      status      TEXT NOT NULL DEFAULT 'confirmed',
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS booking_slots (
      barber_id   TEXT NOT NULL,
      date        TEXT NOT NULL,
      time        TEXT NOT NULL,
      booking_id  INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
      PRIMARY KEY (barber_id, date, time)
    );
    CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date, barber_id);
  `);

  return {
    async takenSlots(barberId, date) {
      const rows = db
        .prepare("SELECT time FROM booking_slots WHERE barber_id = ? AND date = ?")
        .all(barberId, date) as { time: string }[];
      return new Set(rows.map((r) => r.time));
    },

    async createBooking(input, reference) {
      db.exec("BEGIN IMMEDIATE");
      try {
        const result = db
          .prepare(
            `INSERT INTO bookings
               (reference, service_id, style_id, barber_id, date, start_time, duration, price, name, phone, email, notes)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          )
          .run(
            reference,
            input.serviceId,
            input.styleId,
            input.barberId,
            input.date,
            input.time,
            input.duration,
            input.price,
            input.name,
            input.phone,
            input.email,
            input.notes,
          );
        const bookingId = Number(result.lastInsertRowid);
        const reserve = db.prepare(
          "INSERT INTO booking_slots (barber_id, date, time, booking_id) VALUES (?, ?, ?, ?)",
        );
        for (const slot of slotsCovered(input.time, input.duration)) {
          reserve.run(input.barberId, input.date, slot, bookingId);
        }
        db.exec("COMMIT");
        return { reference };
      } catch (error) {
        db.exec("ROLLBACK");
        const message = error instanceof Error ? error.message : "";
        if (message.includes("UNIQUE constraint failed: booking_slots")) throw new SlotTakenError();
        throw error;
      }
    },
  };
}
