// Eyes-rested break-complete screen. Faithfully reproduces the imported Figma
// "Eyes Rested" design (green gradient, three stat pills, two buttons) but with
// real, functional buttons so "Back to work" and "Add twenty more" actually work.
import type { ReactNode } from "react";

function StatPill({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex w-full items-center justify-center gap-3 rounded-[20px] bg-[rgba(16,16,20,0.18)] px-5 py-3">
      <span className="size-5 shrink-0 text-white">{icon}</span>
      <span className="font-mono-r text-[18px] leading-[22px] text-white">{label}</span>
    </div>
  );
}

export default function EyesRested({
  banked,
  today,
  streak,
  onBackToWork,
  onAddMore,
}: {
  banked: number;
  today?: number;
  streak?: number;
  onBackToWork: () => void;
  onAddMore: () => void;
}) {
  return (
    <div
      className="flex size-full flex-col items-center justify-center px-6"
      style={{ backgroundColor: "#1a3d2e" }}
    >
      <div className="flex w-full max-w-[344px] flex-col items-center gap-6">
        <h1 className="font-mono-b text-[44px] leading-[48px] tracking-[1px] text-white">
          EYES RESTED
        </h1>

        <div className="flex w-[280px] max-w-full flex-col gap-3">
          <StatPill
            label={`${banked} s banked`}
            icon={
              <svg viewBox="0 0 20 20" fill="none" className="size-full">
                <circle cx="10" cy="10" r="8.5" stroke="white" strokeWidth="2" />
                <path d="M10 6.43V10L12.5 11.79" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
          />
          <StatPill
            label={`${today ?? 12} today`}
            icon={
              <svg viewBox="0 0 20 20" fill="none" className="size-full">
                <path d="M3 10.5L7.5 15L17 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
          <StatPill
            label={`${streak ?? 4} in a row`}
            icon={
              <svg viewBox="0 0 20 20" fill="none" className="size-full">
                <path d="M3.57 5.71H16.43" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M3.57 10H16.43" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M3.57 14.29H10.71" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
          />
        </div>
      </div>

      <div className="mt-12 flex w-full max-w-[345px] flex-col items-center gap-4">
        <button
          onClick={onBackToWork}
          className="h-14 w-full rounded-full bg-[#101014] font-semi text-[16px] leading-[18px] text-white transition-transform hover:scale-[1.01] active:scale-[0.99]"
        >
          Back to work
        </button>
        <button
          onClick={onAddMore}
          className="h-12 w-full rounded-full border border-white font-semi text-[16px] leading-[18px] text-white transition-transform hover:scale-[1.01] active:scale-[0.99]"
        >
          Add twenty more
        </button>
      </div>
    </div>
  );
}
