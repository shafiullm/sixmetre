// Domain types for SIXMETRE.

/** How a scheduled look-away ended. */
export type Outcome = "kept" | "skipped" | "missed";

/** How the app asks for a break. */
export type NudgeStyle = "screen" | "banner" | "buzz";

/** One resolved look-away. */
export type BreakEvent = {
  /** Epoch ms at which the break resolved. */
  at: number;
  outcome: Outcome;
  /** Seconds actually spent looking away (0 for skipped/missed). */
  rested: number;
};

export type EyeFact = { label: string; value: string };

export type Settings = {
  name: string;
  role: string;
  avatar: string;
  /** "HH:MM", local time. */
  scheduleFrom: string;
  scheduleTo: string;
  /** Minutes of work between look-aways. */
  breakEvery: number;
  /** Seconds to look away for. */
  restFor: number;
  nudgeStyle: NudgeStyle;
  /** Enables the manual "on a call" snooze control. */
  pauseDuringCalls: boolean;
  /** Holds the timer while the browser is in fullscreen. */
  pauseFullScreenVideo: boolean;
  weekendsOff: boolean;
  /** Share of scheduled look-aways you're aiming to keep, as a percentage. */
  weeklyTarget: number;
  eyes: EyeFact[];
};

/** Everything we persist, under one schema version. */
export type Persisted = {
  version: number;
  settings: Settings;
  events: BreakEvent[];
  /** dayKey -> seconds spent at the screen that day. */
  screen: Record<string, number>;
  /** Epoch ms of the next scheduled look-away. */
  nextBreakAt: number | null;
  /** True once demo history has been seeded (so we only do it once). */
  seeded: boolean;
};
