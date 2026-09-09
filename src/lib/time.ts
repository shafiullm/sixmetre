// Time helpers. Everything is local-time based — this is a desk-habit app, so
// "today" means the user's today, not UTC's.

/** Stable local-date key, e.g. "2026-08-19". */
export function dayKey(d: Date | number = new Date()): string {
  const date = typeof d === "number" ? new Date(d) : d;
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${m}-${day}`;
}

/** Midnight at the start of the given day. */
export function startOfDay(d: Date | number = new Date()): Date {
  const date = new Date(typeof d === "number" ? d : d.getTime());
  date.setHours(0, 0, 0, 0);
  return date;
}

/** `n` days before the given day, at midnight. */
export function daysAgo(n: number, from: Date | number = new Date()): Date {
  const d = startOfDay(from);
  d.setDate(d.getDate() - n);
  return d;
}

/** "HH:MM" -> minutes since local midnight. Returns null if unparseable. */
export function parseClock(hhmm: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

/** Minutes since local midnight for a moment in time. */
export function minutesOfDay(d: Date | number = new Date()): number {
  const date = typeof d === "number" ? new Date(d) : d;
  return date.getHours() * 60 + date.getMinutes();
}

/** Seconds -> "MM:SS", minutes uncapped (so 90 min reads "90:00"). */
export function clock(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

/** Seconds -> "5 hr 12 min" / "48 min" / "40 s", matching the design's voice. */
export function duration(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  const hr = Math.floor(s / 3600);
  const min = Math.floor((s % 3600) / 60);
  if (hr > 0) return min > 0 ? `${hr} hr ${min} min` : `${hr} hr`;
  if (min > 0) {
    const rest = s % 60;
    return rest > 0 && min < 10 ? `${min} min ${rest} s` : `${min} min`;
  }
  return `${s} s`;
}

const WORDS = [
  "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
  "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
  "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty",
];

/** Spells small numbers out, the way the designed headline does. */
export function spell(n: number): string {
  return WORDS[n] ?? String(n);
}

/** Saturday or Sunday in local time. */
export function isWeekend(d: Date | number = new Date()): boolean {
  const day = (typeof d === "number" ? new Date(d) : d).getDay();
  return day === 0 || day === 6;
}
