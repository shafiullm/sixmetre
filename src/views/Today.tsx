import { useEffect, useState, type ReactNode } from "react";
import { today, todayMarks } from "../data";

function fmt(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

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

export default function Today({ onRest }: { onRest: () => void }) {
  // Live countdown to the next look-away. Auto-triggers the break at zero.
  const [remaining, setRemaining] = useState(today.nextLookAwaySeconds);

  useEffect(() => {
    if (remaining <= 0) {
      onRest();
      return;
    }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining, onRest]);

  const progress = 1 - remaining / today.workBlockSeconds;

  return (
    <div className="mx-auto flex h-full max-w-[1120px] flex-col items-center justify-center px-4 py-0">
      {/* Hero */}
      <section className="flex w-full flex-col items-center justify-center gap-x-8 gap-y-6">
        <div className="w-full">
          <h1 className="font-display text-white tracking-[-1px] [font-size:clamp(34px,4vw,52px)] leading-[1.06]">
            {today.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          <div className="mt-7">
            <p className="font-bold-m text-[11px] uppercase tracking-[0.6px] text-white">
              Next look-away
            </p>
            <p className="font-mono-b text-white tracking-[-2px] [font-size:clamp(56px,7vw,88px)] leading-none">
              {fmt(remaining)}
            </p>
            <div className="mt-4 h-[3px] w-full max-w-[420px] bg-white/25">
              <div className="h-full bg-white" style={{ width: `${progress * 100}%` }} />
            </div>
            <p className="mt-2 font-mono-r text-[13px] text-white/75">
              BLOCK {today.block.current} OF {today.block.total}
            </p>
          </div>

          <button
            onClick={onRest}
            className="mt-7 h-14 w-full rounded-2xl bg-[#101014] pl-[110px] pr-[110px] pt-0 pb-0 font-semi text-[16px] text-white transition-transform hover:scale-[1.02] active:scale-[0.99]"
          >
            Rest my eyes now
          </button>
        </div>

        {/* Right column — today at a glance */}
        <div className="flex w-full flex-col gap-4">
          <div className="rounded-[20px] bg-white p-6">
            <p className="font-bold-m text-[11px] uppercase tracking-[0.6px] text-[rgba(16,16,20,0.45)]">
              Look-aways today
            </p>
            <div className="mt-4 flex h-16 items-end gap-1.5">
              {todayMarks.map((mark, i) => (
                <span
                  key={i}
                  className={`flex-1 rounded-sm ${
                    mark === "kept"
                      ? "bg-[#0b4f8f]"
                      : mark === "missed"
                        ? "bg-[#f4622e]"
                        : "bg-[rgba(16,16,20,0.12)]"
                  }`}
                  style={{ height: mark === "come" ? "40%" : `${55 + ((i * 13) % 45)}%` }}
                />
              ))}
            </div>
            <div className="mt-[25px] flex flex-wrap items-center justify-center gap-x-[7px] gap-y-0">
              <StatPill
                label={`${today.kept} kept`}
                tone="kept"
                icon={
                  <svg viewBox="0 0 14 14" className="size-3.5" fill="none">
                    <path d="M2.5 7.5L6 11L11.5 4" stroke="#4C7A46" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                }
              />
              <StatPill
                label={`${today.missed} missed`}
                tone="missed"
                icon={
                  <svg viewBox="0 0 14 14" className="size-3.5" fill="none">
                    <path d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                }
              />
              <StatPill
                label={`${today.toCome} to come`}
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
                {today.screenToday}
              </p>
            </div>
            <div className="rounded-[20px] bg-white/15 p-5 backdrop-blur-sm">
              <p className="font-bold-m text-[11px] uppercase tracking-[0.6px] text-white/70">
                Rested
              </p>
              <p className="mt-3 font-mono-b text-[26px] leading-tight text-white">
                {today.rested}
              </p>
              <p className="mt-1 font-mono-r text-[12px] text-white/60">
                {today.restedLookAways} look-aways
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
