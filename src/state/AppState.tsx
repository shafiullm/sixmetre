// The single source of truth for the running app: settings, the break log, and
// the timer that drives everything.
//
// The timer is wall-clock based (it compares Date.now() against a stored
// nextBreakAt) rather than counting ticks, so it stays honest across tab
// throttling, sleep and reloads — a 20-minute block is 20 real minutes.
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { BreakEvent, Outcome, Settings } from "../types";
import { clear as clearStore, load, save } from "../lib/store";
import { seedHistory } from "../lib/seed";
import { withinSchedule } from "../lib/stats";
import { dayKey, isWeekend } from "../lib/time";

/** How long a banner nudge waits before the break counts as missed. */
const BANNER_GRACE_MS = 60_000;
/** How often screen time is folded into persisted state. */
const FLUSH_MS = 15_000;

export type Status =
  | "running"
  | "breaking"
  | "off-hours"
  | "weekend"
  | "fullscreen"
  | "snoozed";

type Ctx = {
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
  events: BreakEvent[];
  screen: Record<string, number>;
  /** Refreshed every second, so consumers re-render with the clock. */
  now: number;
  status: Status;
  /** Seconds until the next look-away, or null while the timer is held. */
  secondsToNext: number | null;
  /** Set while the break overlay should be showing. */
  breaking: boolean;
  /** Set while a banner nudge is waiting to be taken. */
  banner: boolean;
  startBreak: () => void;
  resolveBreak: (outcome: Outcome, rested: number) => void;
  snooze: (minutes: number) => void;
  snoozeUntil: number | null;
  cancelSnooze: () => void;
  clearHistory: () => void;
};

const AppContext = createContext<Ctx | null>(null);

export function useApp(): Ctx {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(() => {
    const loaded = load();
    // First run: invent a fortnight of history so the Log has something to show.
    if (!loaded.seeded && loaded.events.length === 0) {
      const { events, screen } = seedHistory(loaded.settings);
      return { ...loaded, events, screen, seeded: true };
    }
    return loaded;
  });

  const [now, setNow] = useState(() => Date.now());
  const [breaking, setBreaking] = useState(false);
  const [bannerFiredAt, setBannerFiredAt] = useState<number | null>(null);
  const [snoozeUntil, setSnoozeUntil] = useState<number | null>(null);
  const [fullscreen, setFullscreen] = useState(false);

  // Screen seconds accrue in a ref and are folded into state periodically —
  // persisting once a second would hammer localStorage for no benefit.
  const pendingScreen = useRef(0);
  const lastFlush = useRef(Date.now());

  const { settings } = state;

  // --- persistence -------------------------------------------------------
  useEffect(() => {
    save(state);
  }, [state]);

  // --- fullscreen detection ---------------------------------------------
  useEffect(() => {
    const sync = () => setFullscreen(document.fullscreenElement !== null);
    sync();
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  // --- what is the timer doing right now? -------------------------------
  const status: Status = useMemo(() => {
    if (breaking) return "breaking";
    if (settings.weekendsOff && isWeekend(now)) return "weekend";
    if (!withinSchedule(settings, now)) return "off-hours";
    if (settings.pauseFullScreenVideo && fullscreen) return "fullscreen";
    if (snoozeUntil !== null && now < snoozeUntil) return "snoozed";
    return "running";
  }, [breaking, settings, now, fullscreen, snoozeUntil]);

  const held = status !== "running";

  // --- scheduling --------------------------------------------------------
  const scheduleNext = useCallback((from: number, everyMinutes: number) => {
    setState((s) => ({ ...s, nextBreakAt: from + everyMinutes * 60_000 }));
  }, []);

  // Make sure there is always a next break pencilled in.
  useEffect(() => {
    if (state.nextBreakAt === null) {
      scheduleNext(Date.now(), settings.breakEvery);
    }
  }, [state.nextBreakAt, settings.breakEvery, scheduleNext]);

  const recordEvent = useCallback((outcome: Outcome, rested: number) => {
    setState((s) => ({
      ...s,
      events: [...s.events, { at: Date.now(), outcome, rested }],
      nextBreakAt: Date.now() + s.settings.breakEvery * 60_000,
    }));
  }, []);

  const startBreak = useCallback(() => {
    setBannerFiredAt(null);
    setBreaking(true);
  }, []);

  const resolveBreak = useCallback(
    (outcome: Outcome, rested: number) => {
      setBreaking(false);
      recordEvent(outcome, rested);
    },
    [recordEvent],
  );

  const snooze = useCallback((minutes: number) => {
    setBannerFiredAt(null);
    const until = Date.now() + minutes * 60_000;
    setSnoozeUntil(until);
    // Push the next break out past the snooze so it doesn't fire the moment
    // the snooze lapses.
    setState((s) => ({
      ...s,
      nextBreakAt: Math.max(s.nextBreakAt ?? 0, until),
    }));
  }, []);

  const cancelSnooze = useCallback(() => setSnoozeUntil(null), []);

  // --- the tick ----------------------------------------------------------
  useEffect(() => {
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);

      // Count screen time only while the tab is actually being looked at,
      // inside working hours, and not mid-break.
      if (!document.hidden && status === "running") {
        pendingScreen.current += 1;
      }

      if (t - lastFlush.current >= FLUSH_MS && pendingScreen.current > 0) {
        const add = pendingScreen.current;
        pendingScreen.current = 0;
        lastFlush.current = t;
        const key = dayKey(t);
        setState((s) => ({
          ...s,
          screen: { ...s.screen, [key]: (s.screen[key] ?? 0) + add },
        }));
      }

      // A held timer doesn't burn the block — push the target along with it.
      if (held && status !== "breaking") {
        setState((s) =>
          s.nextBreakAt === null ? s : { ...s, nextBreakAt: s.nextBreakAt + 1000 },
        );
        return;
      }

      if (status !== "running") return;

      // A banner that goes unanswered becomes a missed break.
      if (bannerFiredAt !== null) {
        if (t - bannerFiredAt >= BANNER_GRACE_MS) {
          setBannerFiredAt(null);
          recordEvent("missed", 0);
        }
        return;
      }

      if (state.nextBreakAt !== null && t >= state.nextBreakAt) {
        if (settings.nudgeStyle === "screen") {
          setBreaking(true);
        } else {
          setBannerFiredAt(t);
          if (settings.nudgeStyle === "buzz" && "vibrate" in navigator) {
            navigator.vibrate?.([120, 80, 120]);
          }
        }
      }
    }, 1000);
    return () => clearInterval(id);
  }, [status, held, bannerFiredAt, state.nextBreakAt, settings.nudgeStyle, recordEvent]);

  // Flush any unsaved screen time when the tab goes away.
  useEffect(() => {
    const flush = () => {
      if (pendingScreen.current === 0) return;
      const add = pendingScreen.current;
      pendingScreen.current = 0;
      const key = dayKey();
      setState((s) => ({
        ...s,
        screen: { ...s.screen, [key]: (s.screen[key] ?? 0) + add },
      }));
    };
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", flush);
    };
  }, []);

  // --- settings ----------------------------------------------------------
  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setState((s) => {
      const settings = { ...s.settings, ...patch };
      // Changing the interval should take effect from now, not from whenever
      // the last break happened.
      const nextBreakAt =
        patch.breakEvery !== undefined && patch.breakEvery !== s.settings.breakEvery
          ? Date.now() + patch.breakEvery * 60_000
          : s.nextBreakAt;
      return { ...s, settings, nextBreakAt };
    });
  }, []);

  const clearHistory = useCallback(() => {
    clearStore();
    setState((s) => ({
      ...s,
      events: [],
      screen: {},
      nextBreakAt: Date.now() + s.settings.breakEvery * 60_000,
      seeded: true,
    }));
  }, []);

  const secondsToNext =
    held || state.nextBreakAt === null
      ? null
      : Math.max(0, Math.round((state.nextBreakAt - now) / 1000));

  const value: Ctx = {
    settings,
    updateSettings,
    events: state.events,
    screen: state.screen,
    now,
    status,
    secondsToNext,
    breaking,
    banner: bannerFiredAt !== null,
    startBreak,
    resolveBreak,
    snooze,
    snoozeUntil,
    cancelSnooze,
    clearHistory,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
