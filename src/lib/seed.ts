// First-run demo history.
//
// An empty Log on day one looks like a broken app rather than a new one, so a
// fresh install gets two weeks of plausible history. It is generated from a
// fixed seed (so it is stable across reloads) and can be wiped from
// You → Clear history, after which the Log shows only what you actually did.
import type { BreakEvent, Settings } from "../types";
import { dayKey, isWeekend, parseClock, startOfDay } from "./time";

/** Small deterministic PRNG — mulberry32. */
function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** How many days of history to invent. */
const DAYS = 14;

export function seedHistory(
  settings: Settings,
  now: number = Date.now(),
): { events: BreakEvent[]; screen: Record<string, number> } {
  const random = rng(20202020);
  const from = parseClock(settings.scheduleFrom) ?? 9 * 60;
  const to = parseClock(settings.scheduleTo) ?? 18 * 60;
  const windowMinutes = Math.max(0, to - from);

  const events: BreakEvent[] = [];
  const screen: Record<string, number> = {};

  for (let back = DAYS - 1; back >= 0; back--) {
    const day = startOfDay(now);
    day.setDate(day.getDate() - back);
    const weekend = isWeekend(day);

    // Weekends are quiet: a short stretch, and only if weekends aren't off.
    if (weekend && settings.weekendsOff) continue;
    const slots = Math.floor(windowMinutes / settings.breakEvery);
    const active = weekend ? Math.round(slots * 0.25) : slots;

    let screenSeconds = 0;
    for (let i = 0; i < active; i++) {
      const at = day.getTime() + (from + (i + 1) * settings.breakEvery) * 60_000;
      // Only invent breaks that have already happened.
      if (at > now) break;

      // Roughly three in four kept, worse in the mid-afternoon slump.
      const hour = new Date(at).getHours();
      const slump = hour >= 14 && hour < 17 ? 0.16 : 0;
      const roll = random();
      const outcome: BreakEvent["outcome"] =
        roll < 0.76 - slump ? "kept" : roll < 0.93 - slump ? "missed" : "skipped";

      events.push({
        at,
        outcome,
        rested: outcome === "kept" ? settings.restFor : 0,
      });
      screenSeconds += settings.breakEvery * 60;
    }

    if (screenSeconds > 0) screen[dayKey(day)] = screenSeconds;
  }

  return { events, screen };
}
