// Derives everything the Today and Log screens show from the raw event log.
// Nothing here stores state — give it events and a moment in time.
import type { BreakEvent, Outcome, Settings } from "../types";
import { dayKey, duration, isWeekend, minutesOfDay, parseClock, startOfDay } from "./time";

export type Range = "D" | "W" | "M" | "Y";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function eventsOn(events: BreakEvent[], day: Date | number): BreakEvent[] {
  const key = dayKey(day);
  return events.filter((e) => dayKey(e.at) === key);
}

function count(events: BreakEvent[], outcome: Outcome): number {
  return events.filter((e) => e.outcome === outcome).length;
}

/** The schedule window, in minutes since midnight, with sane fallbacks. */
export function windowOf(settings: Settings) {
  const from = parseClock(settings.scheduleFrom) ?? 9 * 60;
  const to = parseClock(settings.scheduleTo) ?? 18 * 60;
  return { from, to, minutes: Math.max(0, to - from) };
}

/** How many look-aways a full day of the current schedule would contain. */
export function blocksPerDay(settings: Settings): number {
  const { minutes } = windowOf(settings);
  return Math.max(1, Math.floor(minutes / Math.max(1, settings.breakEvery)));
}

/** Is the clock inside working hours right now? */
export function withinSchedule(settings: Settings, now: number = Date.now()): boolean {
  if (settings.weekendsOff && isWeekend(now)) return false;
  const { from, to } = windowOf(settings);
  const m = minutesOfDay(now);
  return m >= from && m < to;
}

export type TodayStats = {
  kept: number;
  missed: number;
  skipped: number;
  /** Look-aways still to come before the day's schedule runs out. */
  toCome: number;
  /** Seconds actually spent looking away today. */
  restedSeconds: number;
  /** Seconds at the screen today. */
  screenSeconds: number;
  block: { current: number; total: number };
  /** One mark per planned look-away, in order, for the dashboard strip. */
  marks: (Outcome | "come")[];
};

export function todayStats(
  events: BreakEvent[],
  screen: Record<string, number>,
  settings: Settings,
  now: number = Date.now(),
): TodayStats {
  const todays = eventsOn(events, now);
  const total = blocksPerDay(settings);
  const done = todays.length;

  const marks: (Outcome | "come")[] = todays.map((e) => e.outcome);
  while (marks.length < total) marks.push("come");

  return {
    kept: count(todays, "kept"),
    missed: count(todays, "missed"),
    skipped: count(todays, "skipped"),
    toCome: Math.max(0, total - done),
    restedSeconds: todays.reduce((sum, e) => sum + e.rested, 0),
    screenSeconds: screen[dayKey(now)] ?? 0,
    block: { current: Math.min(done + 1, total), total },
    marks: marks.slice(0, total),
  };
}

/** Look-aways kept per hour today, as 24 buckets. */
export function hourlyToday(events: BreakEvent[], now: number = Date.now()): number[] {
  const buckets = new Array(24).fill(0);
  for (const e of eventsOn(events, now)) {
    if (e.outcome === "kept") buckets[new Date(e.at).getHours()]++;
  }
  return buckets;
}

export type Series = {
  /** Bar labels along the axis. */
  labels: string[];
  /** Kept look-aways per bucket. */
  kept: number[];
  /** Missed look-aways per bucket. */
  missed: number[];
  /** Axis ticks shown under the chart. */
  ticks: string[];
  /** Headline count for the range. */
  total: number;
  /** Human label for the range, e.g. "TUE 19 AUG". */
  caption: string;
};

/** Bars for the Log chart at the selected range. */
export function series(
  events: BreakEvent[],
  range: Range,
  settings: Settings,
  now: number = Date.now(),
): Series {
  const today = new Date(now);

  if (range === "D") {
    const { from, to } = windowOf(settings);
    const startHour = Math.max(0, Math.floor(from / 60));
    const endHour = Math.min(24, Math.ceil(to / 60));
    const todays = eventsOn(events, now);
    const kept: number[] = [];
    const missed: number[] = [];
    const labels: string[] = [];
    for (let h = startHour; h < endHour; h++) {
      const inHour = todays.filter((e) => new Date(e.at).getHours() === h);
      kept.push(count(inHour, "kept"));
      missed.push(count(inHour, "missed"));
      labels.push(String(h).padStart(2, "0"));
    }
    return {
      labels,
      kept,
      missed,
      ticks: tickSample(labels, 5),
      total: count(todays, "kept"),
      caption: `${DAY_NAMES[today.getDay()].toUpperCase()} ${today.getDate()} ${
        MONTH_NAMES[today.getMonth()].toUpperCase()
      }`,
    };
  }

  if (range === "Y") {
    const kept: number[] = [];
    const missed: number[] = [];
    const labels: string[] = [];
    for (let back = 11; back >= 0; back--) {
      const d = new Date(today.getFullYear(), today.getMonth() - back, 1);
      const inMonth = events.filter((e) => {
        const ed = new Date(e.at);
        return ed.getFullYear() === d.getFullYear() && ed.getMonth() === d.getMonth();
      });
      kept.push(count(inMonth, "kept"));
      missed.push(count(inMonth, "missed"));
      labels.push(MONTH_NAMES[d.getMonth()].toUpperCase());
    }
    return {
      labels,
      kept,
      missed,
      ticks: tickSample(labels, 6),
      total: kept.reduce((a, b) => a + b, 0),
      caption: String(today.getFullYear()),
    };
  }

  const span = range === "W" ? 7 : 30;
  const kept: number[] = [];
  const missed: number[] = [];
  const labels: string[] = [];
  for (let back = span - 1; back >= 0; back--) {
    const d = startOfDay(now);
    d.setDate(d.getDate() - back);
    const inDay = eventsOn(events, d);
    kept.push(count(inDay, "kept"));
    missed.push(count(inDay, "missed"));
    labels.push(
      range === "W" ? DAY_NAMES[d.getDay()][0].toUpperCase() : String(d.getDate()),
    );
  }
  const first = startOfDay(now);
  first.setDate(first.getDate() - (span - 1));
  return {
    labels,
    kept,
    missed,
    ticks: range === "W" ? labels : tickSample(labels, 5),
    total: kept.reduce((a, b) => a + b, 0),
    caption: `${first.getDate()} ${MONTH_NAMES[first.getMonth()].toUpperCase()} TO ${
      today.getDate()
    } ${MONTH_NAMES[today.getMonth()].toUpperCase()}`,
  };
}

/** Evenly spaced subset of labels, for a readable axis. */
function tickSample(labels: string[], wanted: number): string[] {
  if (labels.length <= wanted) return labels;
  const step = (labels.length - 1) / (wanted - 1);
  return Array.from({ length: wanted }, (_, i) => labels[Math.round(i * step)]);
}

export type WeekReview = {
  range: string;
  keptPercent: number;
  /** Percentage points better (or worse) than the week before. */
  vsLastWeek: number;
  longestStretch: string;
  worstHour: string;
  days: { label: string; kept: number; missed: number }[];
  /** True when there is nothing yet to review. */
  empty: boolean;
};

export function weekReview(
  events: BreakEvent[],
  settings: Settings,
  now: number = Date.now(),
): WeekReview {
  const thisWeek = lastNDays(events, 7, now);
  const prevWeek = lastNDays(events, 7, startOfDay(now).getTime() - 7 * 86_400_000);

  const days: WeekReview["days"] = [];
  for (let back = 6; back >= 0; back--) {
    const d = startOfDay(now);
    d.setDate(d.getDate() - back);
    const inDay = eventsOn(events, d);
    days.push({
      label: DAY_NAMES[d.getDay()][0].toUpperCase(),
      kept: count(inDay, "kept"),
      missed: count(inDay, "missed"),
    });
  }

  const from = startOfDay(now);
  from.setDate(from.getDate() - 6);
  const to = new Date(now);

  return {
    range: `${from.getDate()} ${MONTH_NAMES[from.getMonth()].toUpperCase()} TO ${
      to.getDate()
    } ${MONTH_NAMES[to.getMonth()].toUpperCase()}`,
    keptPercent: percentKept(thisWeek),
    vsLastWeek: percentKept(thisWeek) - percentKept(prevWeek),
    longestStretch: longestStretch(thisWeek, settings),
    worstHour: worstHour(thisWeek),
    days,
    empty: thisWeek.length === 0,
  };
}

function lastNDays(events: BreakEvent[], n: number, now: number): BreakEvent[] {
  const cutoff = startOfDay(now);
  cutoff.setDate(cutoff.getDate() - (n - 1));
  const end = startOfDay(now).getTime() + 86_400_000;
  return events.filter((e) => e.at >= cutoff.getTime() && e.at < end);
}

function percentKept(events: BreakEvent[]): number {
  if (events.length === 0) return 0;
  return Math.round((count(events, "kept") / events.length) * 100);
}

/** The longest run of screen time without a kept look-away. */
function longestStretch(events: BreakEvent[], settings: Settings): string {
  const kept = events.filter((e) => e.outcome === "kept").sort((a, b) => a.at - b.at);
  if (kept.length < 2) return "Not enough history yet to measure a stretch.";

  let best = 0;
  let bestAt = kept[0].at;
  for (let i = 1; i < kept.length; i++) {
    // Only compare within a single day — overnight isn't a stretch at the screen.
    if (dayKey(kept[i].at) !== dayKey(kept[i - 1].at)) continue;
    const gap = kept[i].at - kept[i - 1].at;
    if (gap > best) {
      best = gap;
      bestAt = kept[i].at;
    }
  }
  if (best <= settings.breakEvery * 60_000 * 1.5) {
    return "No long stretches this week — your breaks stayed close together.";
  }
  const day = DAY_NAMES[new Date(bestAt).getDay()];
  return `${dayName(day)}, ${duration(best / 1000)} without a look-away.`;
}

function dayName(short: string): string {
  const full: Record<string, string> = {
    Sun: "Sunday", Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday",
    Thu: "Thursday", Fri: "Friday", Sat: "Saturday",
  };
  return full[short] ?? short;
}

/** The hour of the day with the worst kept rate. */
function worstHour(events: BreakEvent[]): string {
  const byHour = new Map<number, { kept: number; total: number }>();
  for (const e of events) {
    const h = new Date(e.at).getHours();
    const cur = byHour.get(h) ?? { kept: 0, total: 0 };
    cur.total++;
    if (e.outcome === "kept") cur.kept++;
    byHour.set(h, cur);
  }

  let worst = -1;
  let worstRate = 1.1;
  for (const [hour, { kept, total }] of byHour) {
    // Ignore hours with barely any data — one miss shouldn't crown an hour.
    if (total < 2) continue;
    const rate = kept / total;
    if (rate < worstRate) {
      worstRate = rate;
      worst = hour;
    }
  }
  if (worst < 0) return "Nothing stands out yet. Give it a few more days.";
  return `${String(worst).padStart(2, "0")}:00. You miss more breaks then than at any other time.`;
}

/**
 * Screen time split into the stretches between look-aways, for the Log's
 * segmented bar. Each segment is one work block; the divider after it is
 * coloured by how that block's look-away went.
 */
export function screenSegments(
  events: BreakEvent[],
  now: number = Date.now(),
): { outcome: Outcome }[] {
  return eventsOn(events, now).map((e) => ({ outcome: e.outcome }));
}
