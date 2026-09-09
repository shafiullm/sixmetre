// Local-first persistence. SIXMETRE has no accounts and no server — your break
// history is yours and stays in this browser.
import type { Persisted, Settings } from "../types";

const KEY = "sixmetre:v1";
const VERSION = 1;
/** Keep the log bounded; ~a year of heavy use. */
const MAX_EVENTS = 8000;

export const defaultSettings: Settings = {
  name: "Martin Karim",
  role: "Desk worker, 8 hr shift",
  /** Empty renders an initials monogram; set a URL to use a photo. */
  avatar: "",
  scheduleFrom: "09:00",
  scheduleTo: "18:00",
  breakEvery: 20,
  restFor: 20,
  nudgeStyle: "screen",
  pauseDuringCalls: true,
  pauseFullScreenVideo: true,
  weekendsOff: false,
  weeklyTarget: 80,
  eyes: [
    { label: "Glasses/Contacts", value: "Contacts, daily" },
    { label: "Screen distance", value: "55 cm" },
    { label: "Dryness", value: "Mild, afternoons" },
    { label: "Hours a day", value: "8 to 9" },
  ],
};

export const emptyState: Persisted = {
  version: VERSION,
  settings: defaultSettings,
  events: [],
  screen: {},
  nextBreakAt: null,
  seeded: false,
};

/**
 * Reads persisted state, tolerating anything the browser hands back —
 * a missing key, a truncated write, a schema from a future build.
 */
export function load(): Persisted {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    // Private mode, or storage disabled. Run in memory for this session.
    return { ...emptyState };
  }
  if (!raw) return { ...emptyState };

  try {
    const parsed = JSON.parse(raw) as Partial<Persisted>;
    if (parsed?.version !== VERSION) return { ...emptyState };
    return {
      version: VERSION,
      // Merge over defaults so a settings field added in a later build
      // doesn't come back undefined for existing users.
      settings: { ...defaultSettings, ...(parsed.settings ?? {}) },
      events: Array.isArray(parsed.events) ? parsed.events : [],
      screen: parsed.screen && typeof parsed.screen === "object" ? parsed.screen : {},
      nextBreakAt: typeof parsed.nextBreakAt === "number" ? parsed.nextBreakAt : null,
      seeded: parsed.seeded === true,
    };
  } catch {
    return { ...emptyState };
  }
}

export function save(state: Persisted): void {
  const trimmed: Persisted = {
    ...state,
    events:
      state.events.length > MAX_EVENTS
        ? state.events.slice(state.events.length - MAX_EVENTS)
        : state.events,
  };
  try {
    localStorage.setItem(KEY, JSON.stringify(trimmed));
  } catch {
    // Quota or private mode — losing history is not worth breaking the app over.
  }
}

export function clear(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Nothing to do.
  }
}
