import { useState, type ReactNode } from "react";
import { logDay, weekReview } from "../data";

const RANGES = ["D", "W", "M", "Y"] as const;

function Segmented({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-1 rounded-[14px] bg-white/[0.16] p-1.5">
      {RANGES.map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
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

function WeekReview() {
  const max = Math.max(...weekReview.days.map((d) => d.kept + d.missed));
  return (
    <div className="rounded-[20px] bg-white p-6">
      <p className="font-bold-m text-[11px] uppercase tracking-[0.6px] text-[rgba(16,16,20,0.45)]">
        {weekReview.range}
      </p>
      <h3 className="mt-2 font-display text-[28px] leading-[32px] tracking-[-0.5px] text-[#101014]">
        You kept <span className="text-[#4c7a46]">{weekReview.keptPercent}%</span> of
        your breaks
      </h3>

      <div className="mt-6 flex items-end justify-between gap-3">
        {weekReview.days.map((d, i) => {
          const total = d.kept + d.missed;
          return (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-28 w-full max-w-8 flex-col justify-end gap-0.5" style={{ height: 112 }}>
                {Array.from({ length: Math.round((total / max) * 14) }).map((_, k, arr) => (
                  <span
                    key={k}
                    className={`h-1 w-full rounded-full ${
                      k < arr.length * (d.kept / total) ? "bg-[#8fb27a]" : "bg-[#f4622e]"
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
          <p className="mt-1 font-body text-[15px] text-[#101014]">
            {weekReview.longestStretch}
          </p>
        </div>
        <div>
          <p className="font-bold-m text-[11px] uppercase tracking-[0.6px] text-[rgba(16,16,20,0.45)]">
            Worst hour
          </p>
          <p className="mt-1 font-body text-[15px] text-[#101014]">
            {weekReview.worstHour}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-bold-m text-[11px] uppercase tracking-[0.6px] text-[rgba(16,16,20,0.45)]">
            vs last week
          </span>
          <span className="h-2 flex-1 overflow-hidden rounded-full bg-[rgba(16,16,20,0.1)]">
            <span className="block h-full bg-[#8fb27a]" style={{ width: `${50 + weekReview.vsLastWeek}%` }} />
          </span>
          <span className="font-mono-b text-[16px] text-[#4c7a46]">+{weekReview.vsLastWeek}%</span>
        </div>
      </div>

      <button className="mt-6 h-14 w-full rounded-full bg-[#101014] font-semi text-[15px] text-white transition-transform hover:scale-[1.01]">
        Set next week's target
      </button>
    </div>
  );
}

export default function Log() {
  const [range, setRange] = useState("D");
  const [reviewOpen, setReviewOpen] = useState(false);

  return (
    <div className="mx-auto flex h-full max-w-[1120px] flex-col px-6 py-6 md:px-12 lg:h-auto lg:block lg:py-14">
      <div className="mb-4 flex items-center justify-between lg:mb-6">
        <h1 className="font-bold-m text-[22px] text-white">Log</h1>
        <span className="font-bold-m text-[11px] uppercase tracking-[0.6px] text-white/75">
          {logDay.date}
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
              Look-aways today
            </p>
            <p className="mt-2 font-mono-b text-[44px] leading-none tracking-[-2px] text-[#101014] lg:text-[56px]">
              {logDay.lookAwaysToday}
            </p>
            <div className="relative mt-4 h-[120px] lg:mt-6">
              {[0, 60, 119].map((t) => (
                <span
                  key={t}
                  className="absolute left-0 w-full border-t border-dashed border-[rgba(16,16,20,0.12)]"
                  style={{ top: t }}
                />
              ))}
              <div className="flex h-full items-end justify-between px-8">
                {logDay.bars.map((h, i) => (
                  <span key={i} className="w-2.5 rounded-sm bg-[#0b4f8f]" style={{ height: h }} />
                ))}
              </div>
            </div>
            <div className="mt-3 flex justify-between font-bold-m text-[11px] uppercase tracking-[0.6px] text-[rgba(16,16,20,0.4)]">
              {["00", "06", "12", "18", "24"].map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>

          {/* Time at screen */}
          <div className="rounded-[20px] bg-white px-6 py-5 lg:p-6">
            <p className="font-bold-m text-[11px] uppercase tracking-[0.6px] text-[rgba(16,16,20,0.45)]">
              Time at screen
            </p>
            <p className="mt-2 font-mono-b text-[28px] leading-tight text-[#101014]">
              {logDay.screenTime}
            </p>
            <div className="mt-4 flex h-7 overflow-hidden rounded">
              {logDay.screenSegments.map((w, i) => (
                <span key={i} className="flex">
                  <span className="h-7 bg-[#0b4f8f]" style={{ width: w }} />
                  {i < logDay.screenSegments.length - 1 && (
                    <span className={`h-7 w-[3px] ${i % 3 === 1 ? "bg-[#f4622e]" : "bg-[#8fb27a]"}`} />
                  )}
                </span>
              ))}
            </div>
            <div className="mt-3 flex justify-between font-bold-m text-[11px] uppercase tracking-[0.6px] text-[rgba(16,16,20,0.4)]">
              {["08:00", "12:00", "16:00", "20:00"].map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>

          {/* Chips */}
          <div className="grid w-full grid-cols-3 gap-3">
            <StatChip
              tone="kept"
              label={`Kept ${logDay.kept}`}
              icon={
                <svg viewBox="0 0 20 20" className="size-full" fill="none">
                  <path d="M10 2.5L11.545 7.545H16.82L12.637 10.61L14.18 15.655L10 12.59L5.82 15.655L7.363 10.61L3.18 7.545H8.455Z" fill="#4C7A46"/>
                </svg>
              }
            />
            <StatChip
              tone="missed"
              label={`Missed ${logDay.missed}`}
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
              label={`Skipped ${logDay.skipped}`}
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
          <WeekReview />
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
              <WeekReview />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
