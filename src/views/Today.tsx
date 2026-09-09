import { useMemo, type ReactNode } from "react";
import { useApp } from "../state/AppState";
import { todayStats } from "../lib/stats";
import { clock, duration, spell } from "../lib/time";

function StatPill({
  label,
  tone,
  icon,
}: {
  label: string;
  tone: "kept" | "missed" | "come";
  icon: ReactNode;
}) {
  const styles = {
    kept: "bg-[#dde8ce] text-[#4c7a46]",
    missed: "bg-[#f4622e] text-white",
    come: "bg-[rgba(16,16,20,0.06)] text-[rgba(16,16,20,0.55)]",
  }[tone];
  return (
    <span className={`flex items-center gap-2 self-stretch rounded-full px-2.5 py-1.5 ${styles}`}>
      {icon}
      <span className="font-bold-m text-[11px] uppercase tracking-[0.6px]">{label}</span>
    </span>
  );
}

/** The designed headline, told from the live block instead of fixed copy. */
function headline(secondsToNext: number | null, breakEvery: number): string[] {
  if (secondsToNext === null) return ["The timer is", "resting too."];
  const remaining = Math.max(1, Math.ceil(secondsToNext / 60));
  const elapsed = Math.max(0, breakEvery - remaining);
  const been =
    elapsed === 0
      ? "Fresh block."
      : `${spell(elapsed)} minute${elapsed === 1 ? "" : "s"} at`;
  return elapsed === 0
    ? [been, `${spell(remaining)} to go.`]
    : [been, "arm's length.", `${spell(remaining)} to go.`];
}

const PAUSED_COPY: Record<string, { title: string; body: string }> = {
  "off-hours": {
    title: "Outside your hours",
    body: "The timer picks up again when your schedule starts. Change it in You.",
  },
  weekend: {
    title: "Weekends off",
    body: "No nudges today. Turn weekends back on in You if you're at the desk.",
  },
  fullscreen: {
    title: "Full screen — holding",
    body: "You asked not to be interrupted during full-screen video. Leave full screen to resume.",
  },
  snoozed: {
    title: "Snoozed",
    body: "You pushed this one back. The countdown resumes when the snooze lapses.",
  },
};

export default function Today() {
  const {
    settings,
    events,
    screen,
    now,
    status,
    secondsToNext,
    startBreak,
    snooze,
    snoozeUntil,
    cancelSnooze,
  } = useApp();

  const stats = useMemo(
    () => todayStats(events, screen, settings, now),
    [events, screen, settings, now],
  );

  const lines = headline(secondsToNext, settings.breakEvery);
  const progress =
    secondsToNext === null
      ? 0
      : 1 - secondsToNext / Math.max(1, settings.breakEvery * 60);
  const paused = PAUSED_COPY[status];

  return (
    <div className="mx-auto flex min-h-full max-w-[1120px] flex-col justify-center px-6 py-10 md:px-12">
      <section className="grid w-full items-center gap-x-12 gap-y-10 lg:grid-cols-2">
        {/* Hero */}
        <div className="w-full">
          <h1 className="font-display text-white tracking-[-1px] [font-size:clamp(34px,4vw,52px)] leading-[1.06]">
            {lines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h1>

          {paused ? (
            <div className="mt-7 rounded-[20px] bg-white/15 p-6 backdrop-blur-sm">
              <p className="font-bold-m text-[11px] uppercase tracking-[0.6px] text-white/70">
                {paused.title}
              </p>
              <p className="mt-2 max-w-[42ch] font-body text-[15px] leading-[23px] text-white/85">
                {paused.body}
              </p>
              {status === "snoozed" && snoozeUntil !== null && (
                <button
                  onClick={cancelSnooze}
                  className="mt-4 rounded-full border border-white/50 px-4 py-2 font-semi text-[13px] text-white transition-colors hover:bg-white/10"
                >
                  Resume now — {clock((snoozeUntil - now) / 1000)} left
                </button>
              )}
            </div>
          ) : (
            <div className="mt-7">
              <p className="font-bold-m text-[11px] uppercase tracking-[0.6px] text-white">
                Next look-away
              </p>
              <p className="font-mono-b text-white tracking-[-2px] [font-size:clamp(56px,7vw,88px)] leading-none">
                {clock(secondsToNext ?? 0)}
              </p>
              <div className="mt-4 h-[3px] w-full max-w-[420px] bg-white/25">
                <div
                  className="h-full bg-white transition-[width] duration-1000 ease-linear"
                  style={{ width: `${Math.min(100, progress * 100)}%` }}
                />
              </div>
              <p className="mt-2 font-mono-r text-[13px] text-white/75">
                BLOCK {stats.block.current} OF {stats.block.total}
              </p>
            </div>
          )}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={startBreak}
              className="h-14 flex-1 rounded-2xl bg-[#101014] px-8 font-semi text-[16px] text-white transition-transform hover:scale-[1.02] active:scale-[0.99]"
            >
              Rest my eyes now
            </button>
            {settings.pauseDuringCalls && status === "running" && (
              <button
                onClick={() => snooze(30)}
                className="h-14 rounded-2xl border border-white/40 px-6 font-semi text-[15px] text-white transition-colors hover:bg-white/10"
              >
                On a call — hold 30 min
              </button>
            )}
          </div>
        </div>

        {/* Today at a glance */}
        <div className="flex w-full flex-col gap-4">
          <div className="rounded-[20px] bg-white p-6">
            <p className="font-bold-m text-[11px] uppercase tracking-[0.6px] text-[rgba(16,16,20,0.45)]">
              Look-aways today
            </p>
            {/* A short schedule gives a handful of wide marks; a long one gives
                many thin ones, so the gap has to give way before the bars do. */}
            <div
              className={`mt-4 flex h-16 items-end ${
                stats.marks.length > 40 ? "gap-px" : stats.marks.length > 24 ? "gap-1" : "gap-1.5"
              }`}
            >
              {stats.marks.map((mark, i) => (
                <span
                  key={i}
                  className={`flex-1 rounded-sm ${
                    mark === "kept"
                      ? "bg-[#0b4f8f]"
                      : mark === "missed"
                        ? "bg-[#f4622e]"
                        : mark === "skipped"
                          ? "bg-[#8fb27a]"
                          : "bg-[rgba(16,16,20,0.12)]"
                  }`}
                  style={{ height: mark === "come" ? "40%" : "100%" }}
                />
              ))}
            </div>
            <div className="mt-[25px] flex flex-wrap items-center justify-center gap-[7px]">
              <StatPill
                label={`${stats.kept} kept`}
                tone="kept"
                icon={
                  <svg viewBox="0 0 14 14" className="size-3.5" fill="none">
                    <path d="M2.5 7.5L6 11L11.5 4" stroke="#4C7A46" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                }
              />
              <StatPill
                label={`${stats.missed} missed`}
                tone="missed"
                icon={
                  <svg viewBox="0 0 14 14" className="size-3.5" fill="none">
                    <path d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                }
              />
              <StatPill
                label={`${stats.toCome} to come`}
                tone="come"
                icon={
                  <svg viewBox="0 0 14 14" className="size-3.5" fill="none">
                    <path d="M2.5 7H10M7.5 4.5L10.5 7L7.5 9.5" stroke="rgba(16,16,20,0.35)" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-[20px] bg-white/15 p-5 backdrop-blur-sm">
              <p className="font-bold-m text-[11px] uppercase tracking-[0.6px] text-white/70">
                Screen today
              </p>
              <p className="mt-3 font-mono-b text-[26px] leading-tight text-white">
                {duration(stats.screenSeconds)}
              </p>
            </div>
            <div className="rounded-[20px] bg-white/15 p-5 backdrop-blur-sm">
              <p className="font-bold-m text-[11px] uppercase tracking-[0.6px] text-white/70">
                Rested
              </p>
              <p className="mt-3 font-mono-b text-[26px] leading-tight text-white">
                {duration(stats.restedSeconds)}
              </p>
              <p className="mt-1 font-mono-r text-[12px] text-white/60">
                {stats.kept} look-away{stats.kept === 1 ? "" : "s"}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
