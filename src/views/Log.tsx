import { useMemo, useState, type ReactNode } from "react";
import { useApp } from "../state/AppState";
import {
  eventsOn,
  screenSegments,
  series,
  todayStats,
  weekReview as buildWeekReview,
  type Range,
  type WeekReview as WeekReviewData,
} from "../lib/stats";
import { duration } from "../lib/time";

const RANGES: Range[] = ["D", "W", "M", "Y"];

const CHART_TITLE: Record<Range, string> = {
  D: "Look-aways today",
  W: "Look-aways this week",
  M: "Look-aways this month",
  Y: "Look-aways this year",
};

function Segmented({
  value,
  onChange,
}: {
  value: Range;
  onChange: (v: Range) => void;
}) {
  return (
    <div className="flex gap-1 rounded-[14px] bg-white/[0.16] p-1.5">
      {RANGES.map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          aria-pressed={value === r}
          className={`flex-1 rounded-[10px] py-3 font-bold-m text-[11px] uppercase tracking-[0.6px] transition-colors ${
            value === r ? "bg-white text-[#101014]" : "text-white/60 hover:text-white"
          }`}
        >
          {r}
        </button>
      ))}
    </div>
  );
}

function StatChip({
  tone,
  label,
  icon,
}: {
  tone: "kept" | "missed" | "skipped";
  label: string;
  icon: ReactNode;
}) {
  const styles = {
    kept: "bg-[#dde8ce] text-[#4c7a46]",
    missed: "bg-[#f4622e] text-white",
    skipped: "bg-white/[0.16] text-white/75",
  }[tone];
  return (
    <span className={`flex flex-col items-center justify-center gap-2 rounded-[16px] py-4 ${styles}`}>
      <span className="size-5 shrink-0">{icon}</span>
      <span className="font-bold-m text-[12px] uppercase tracking-[0.6px]">{label}</span>
    </span>
  );
}

function WeekReview({
  data,
  target,
  onTarget,
}: {
  data: WeekReviewData;
  target: number;
  onTarget: (v: number) => void;
}) {
  const max = Math.max(1, ...data.days.map((d) => d.kept + d.missed));
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(target);
  const met = !data.empty && data.keptPercent >= target;

  return (
    <div className="rounded-[20px] bg-white p-6">
      <p className="font-bold-m text-[11px] uppercase tracking-[0.6px] text-[rgba(16,16,20,0.45)]">
        {data.range}
      </p>
      <h3 className="mt-2 font-display text-[28px] leading-[32px] tracking-[-0.5px] text-[#101014]">
        {data.empty ? (
          "No look-aways logged this week yet."
        ) : (
          <>
            You kept <span className="text-[#4c7a46]">{data.keptPercent}%</span> of your
            breaks
          </>
        )}
      </h3>

      <div className="mt-6 flex items-end justify-between gap-3">
        {data.days.map((d, i) => {
          const total = d.kept + d.missed;
          const segments = total === 0 ? 0 : Math.max(1, Math.round((total / max) * 14));
          const keptSegments = total === 0 ? 0 : Math.round(segments * (d.kept / total));
          return (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex w-full max-w-8 flex-col justify-end gap-0.5" style={{ height: 112 }}>
                {Array.from({ length: segments }).map((_, k) => (
                  <span
                    key={k}
                    className={`h-1 w-full rounded-full ${
                      k >= segments - keptSegments ? "bg-[#8fb27a]" : "bg-[#f4622e]"
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold-m text-[11px] uppercase tracking-[0.6px] text-[rgba(16,16,20,0.4)]">
                {d.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 space-y-4 border-t border-[rgba(16,16,20,0.1)] pt-4">
        <div>
          <p className="font-bold-m text-[11px] uppercase tracking-[0.6px] text-[rgba(16,16,20,0.45)]">
            Longest stretch
          </p>
          <p className="mt-1 font-body text-[15px] text-[#101014]">{data.longestStretch}</p>
        </div>
        <div>
          <p className="font-bold-m text-[11px] uppercase tracking-[0.6px] text-[rgba(16,16,20,0.45)]">
            Worst hour
          </p>
          <p className="mt-1 font-body text-[15px] text-[#101014]">{data.worstHour}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-bold-m text-[11px] uppercase tracking-[0.6px] text-[rgba(16,16,20,0.45)]">
            vs last week
          </span>
          <span className="h-2 flex-1 overflow-hidden rounded-full bg-[rgba(16,16,20,0.1)]">
            <span
              className={`block h-full ${data.vsLastWeek < 0 ? "bg-[#f4622e]" : "bg-[#8fb27a]"}`}
              style={{ width: `${Math.min(100, Math.max(4, 50 + data.vsLastWeek))}%` }}
            />
          </span>
          <span
            className={`font-mono-b text-[16px] ${
              data.vsLastWeek < 0 ? "text-[#f4622e]" : "text-[#4c7a46]"
            }`}
          >
            {data.vsLastWeek > 0 ? "+" : ""}
            {data.vsLastWeek}%
          </span>
        </div>

        <div>
          <p className="font-bold-m text-[11px] uppercase tracking-[0.6px] text-[rgba(16,16,20,0.45)]">
            Target
          </p>
          <p className="mt-1 font-body text-[15px] text-[#101014]">
            {data.empty
              ? `Aiming to keep ${target}% of your breaks.`
              : met
                ? `Clear of your ${target}% target, by ${data.keptPercent - target} points.`
                : `${target - data.keptPercent} points short of your ${target}% target.`}
          </p>
          <span className="mt-2 block h-2 overflow-hidden rounded-full bg-[rgba(16,16,20,0.1)]">
            <span
              className={`block h-full ${met ? "bg-[#8fb27a]" : "bg-[#0b4f8f]"}`}
              style={{ width: `${Math.min(100, (data.keptPercent / Math.max(1, target)) * 100)}%` }}
            />
          </span>
        </div>
      </div>

      {editing ? (
        <div className="mt-6 rounded-[16px] bg-[rgba(16,16,20,0.05)] p-4">
          <p className="font-bold-m text-[11px] uppercase tracking-[0.6px] text-[rgba(16,16,20,0.45)]">
            Next week's target
          </p>
          <div className="mt-3 flex items-center gap-4">
            <button
              onClick={() => setDraft((v) => Math.max(50, v - 5))}
              aria-label="Lower target"
              className="grid size-10 shrink-0 place-items-center rounded-full bg-white font-bold-m text-[18px] text-[#101014]"
            >
              −
            </button>
            <span className="flex-1 text-center font-mono-b text-[32px] text-[#101014]">
              {draft}%
            </span>
            <button
              onClick={() => setDraft((v) => Math.min(100, v + 5))}
              aria-label="Raise target"
              className="grid size-10 shrink-0 place-items-center rounded-full bg-white font-bold-m text-[18px] text-[#101014]"
            >
              +
            </button>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => {
                onTarget(draft);
                setEditing(false);
              }}
              className="h-12 flex-1 rounded-full bg-[#101014] font-semi text-[15px] text-white"
            >
              Set {draft}%
            </button>
            <button
              onClick={() => {
                setDraft(target);
                setEditing(false);
              }}
              className="h-12 rounded-full border border-[rgba(16,16,20,0.2)] px-5 font-semi text-[15px] text-[#101014]"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => {
            setDraft(target);
            setEditing(true);
          }}
          className="mt-6 h-14 w-full rounded-full bg-[#101014] font-semi text-[15px] text-white transition-transform hover:scale-[1.01]"
        >
          Set next week's target
        </button>
      )}
    </div>
  );
}

export default function Log() {
  const { events, screen, settings, now, updateSettings } = useApp();
  const [range, setRange] = useState<Range>("D");
  const [reviewOpen, setReviewOpen] = useState(false);

  const chart = useMemo(
    () => series(events, range, settings, now),
    [events, range, settings, now],
  );
  const stats = useMemo(
    () => todayStats(events, screen, settings, now),
    [events, screen, settings, now],
  );
  const review = useMemo(
    () => buildWeekReview(events, settings, now),
    [events, settings, now],
  );
  const segments = useMemo(() => screenSegments(events, now), [events, now]);

  // Chips summarise whatever range is selected, not always today.
  const chipCounts = useMemo(() => {
    if (range === "D") {
      const todays = eventsOn(events, now);
      return {
        kept: todays.filter((e) => e.outcome === "kept").length,
        missed: todays.filter((e) => e.outcome === "missed").length,
        skipped: todays.filter((e) => e.outcome === "skipped").length,
      };
    }
    const keptTotal = chart.kept.reduce((a, b) => a + b, 0);
    const missedTotal = chart.missed.reduce((a, b) => a + b, 0);
    return { kept: keptTotal, missed: missedTotal, skipped: 0 };
  }, [range, events, now, chart]);

  const maxBar = Math.max(1, ...chart.kept.map((k, i) => k + chart.missed[i]));

  return (
    <div className="mx-auto flex max-w-[1120px] flex-col px-6 py-6 md:px-12 lg:py-14">
      <div className="mb-4 flex items-center justify-between lg:mb-6">
        <h1 className="font-bold-m text-[22px] text-white">Log</h1>
        <span className="font-bold-m text-[11px] uppercase tracking-[0.6px] text-white/75">
          {chart.caption}
        </span>
      </div>

      <div className="max-w-[420px] lg:max-w-full">
        <Segmented value={range} onChange={setRange} />
      </div>

      <div className="mt-4 grid gap-4 lg:mt-6 lg:grid-cols-2 lg:items-start lg:gap-6">
        <div className="flex flex-col gap-4 lg:gap-6">
          {/* Look-aways chart */}
          <div className="rounded-[20px] bg-white px-6 py-5 lg:py-7">
            <p className="font-bold-m text-[11px] uppercase tracking-[0.6px] text-[rgba(16,16,20,0.45)]">
              {CHART_TITLE[range]}
            </p>
            <p className="mt-2 font-mono-b text-[44px] leading-none tracking-[-2px] text-[#101014] lg:text-[56px]">
              {chart.total}
            </p>
            <div className="relative mt-4 h-[120px] lg:mt-6">
              {[0, 60, 119].map((t) => (
                <span
                  key={t}
                  className="absolute left-0 w-full border-t border-dashed border-[rgba(16,16,20,0.12)]"
                  style={{ top: t }}
                />
              ))}
              <div className="flex h-full items-end justify-between gap-[3px]">
                {chart.kept.map((k, i) => {
                  const missed = chart.missed[i];
                  return (
                    <span
                      key={i}
                      title={`${chart.labels[i]} — ${k} kept, ${missed} missed`}
                      className="flex flex-1 flex-col justify-end"
                      style={{ height: "100%" }}
                    >
                      {missed > 0 && (
                        <span
                          className="block w-full rounded-t-sm bg-[#f4622e]"
                          style={{ height: `${(missed / maxBar) * 100}%` }}
                        />
                      )}
                      <span
                        className={`block w-full bg-[#0b4f8f] ${missed > 0 ? "" : "rounded-t-sm"}`}
                        style={{ height: `${(k / maxBar) * 100}%` }}
                      />
                    </span>
                  );
                })}
              </div>
            </div>
            <div className="mt-3 flex justify-between font-bold-m text-[11px] uppercase tracking-[0.6px] text-[rgba(16,16,20,0.4)]">
              {chart.ticks.map((t, i) => (
                <span key={i}>{t}</span>
              ))}
            </div>
          </div>

          {/* Time at screen */}
          <div className="rounded-[20px] bg-white px-6 py-5 lg:p-6">
            <p className="font-bold-m text-[11px] uppercase tracking-[0.6px] text-[rgba(16,16,20,0.45)]">
              Time at screen today
            </p>
            <p className="mt-2 font-mono-b text-[28px] leading-tight text-[#101014]">
              {duration(stats.screenSeconds)}
            </p>
            {segments.length > 0 ? (
              <div className="mt-4 flex h-7 gap-[3px] overflow-hidden rounded">
                {segments.map((s, i) => (
                  <span key={i} className="flex min-w-0 flex-1">
                    <span className="h-7 flex-1 bg-[#0b4f8f]" />
                    <span
                      className={`h-7 w-[3px] shrink-0 ${
                        s.outcome === "kept"
                          ? "bg-[#8fb27a]"
                          : s.outcome === "missed"
                            ? "bg-[#f4622e]"
                            : "bg-[rgba(16,16,20,0.25)]"
                      }`}
                    />
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-4 font-body text-[14px] text-[rgba(16,16,20,0.5)]">
                No work blocks logged today yet.
              </p>
            )}
            <div className="mt-3 flex justify-between font-bold-m text-[11px] uppercase tracking-[0.6px] text-[rgba(16,16,20,0.4)]">
              <span>{settings.scheduleFrom}</span>
              <span>{settings.scheduleTo}</span>
            </div>
          </div>

          {/* Chips */}
          <div className="grid w-full grid-cols-3 gap-3">
            <StatChip
              tone="kept"
              label={`Kept ${chipCounts.kept}`}
              icon={
                <svg viewBox="0 0 20 20" className="size-full" fill="none">
                  <path d="M10 2.5L11.545 7.545H16.82L12.637 10.61L14.18 15.655L10 12.59L5.82 15.655L7.363 10.61L3.18 7.545H8.455Z" fill="#4C7A46"/>
                </svg>
              }
            />
            <StatChip
              tone="missed"
              label={`Missed ${chipCounts.missed}`}
              icon={
                <svg viewBox="0 0 20 20" className="size-full" fill="none">
                  <path d="M10 3C10 3 14.5 3.5 16.5 7.5" stroke="white" strokeWidth="1.75" strokeLinecap="round"/>
                  <path d="M16.5 7.5C16.5 7.5 17.5 12 14 15" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeDasharray="2 1.5"/>
                  <path d="M14 15C14 15 10.5 17.5 7 16" stroke="white" strokeWidth="1.75" strokeLinecap="round"/>
                  <path d="M7 16C7 16 3.5 13.5 3.5 10C3.5 6.5 6 4 10 3" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeDasharray="2 1.5"/>
                  <path d="M8 8L12 12M12 8L8 12" stroke="white" strokeWidth="1.75" strokeLinecap="round"/>
                </svg>
              }
            />
            <StatChip
              tone="skipped"
              label={`Skipped ${chipCounts.skipped}`}
              icon={
                <svg viewBox="0 0 20 20" className="size-full" fill="none">
                  <path d="M5 5.5L11.5 10L5 14.5V5.5Z" fill="currentColor"/>
                  <path d="M13 5.5V14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              }
            />
          </div>

          {/* Week in review — button below the chips (phone only) */}
          <button
            onClick={() => setReviewOpen(true)}
            className="flex h-16 w-full items-center justify-between rounded-[14px] bg-white px-5 font-semi text-[16px] text-[#101014] transition-transform hover:scale-[1.01] lg:hidden"
          >
            Week in review
            <svg viewBox="0 0 24 24" className="size-6" fill="none">
              <path d="M9.5 5.5L16.5 12L9.5 18.5" stroke="#101014" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Week in review — inline side panel on desktop */}
        <div className="hidden lg:block">
          <WeekReview
            data={review}
            target={settings.weeklyTarget}
            onTarget={(weeklyTarget) => updateSettings({ weeklyTarget })}
          />
        </div>
      </div>

      {/* Week in review — modal on phone */}
      {reviewOpen && (
        <div className="fixed inset-0 z-50 flex items-end lg:hidden">
          <button
            aria-label="Close"
            onClick={() => setReviewOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <div className="relative max-h-[90vh] w-full overflow-y-auto rounded-t-[28px] bg-white pb-[env(safe-area-inset-bottom)]">
            <div className="sticky top-0 flex items-center justify-between bg-white px-6 pt-5">
              <span className="font-bold-m text-[11px] uppercase tracking-[0.6px] text-[rgba(16,16,20,0.45)]">
                Week in review
              </span>
              <button
                onClick={() => setReviewOpen(false)}
                className="grid size-8 place-items-center rounded-full bg-[rgba(16,16,20,0.06)] text-[#101014]"
              >
                <svg viewBox="0 0 14 14" className="size-3.5" fill="none">
                  <path d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="[&>div]:rounded-none [&>div]:pt-3">
              <WeekReview
            data={review}
            target={settings.weeklyTarget}
            onTarget={(weeklyTarget) => updateSettings({ weeklyTarget })}
          />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
