// The quiet nudge, for when the break shouldn't take the whole screen.
// Ignoring it until the grace window lapses is what marks a break missed —
// that decision lives in the engine, this is only its face.
import { useApp } from "../state/AppState";

export default function NudgeBanner() {
  const { banner, startBreak, snooze, settings } = useApp();
  if (!banner) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-[calc(16px+env(safe-area-inset-top))]">
      <div className="pointer-events-auto flex w-full max-w-[520px] items-center gap-4 rounded-[20px] bg-white px-5 py-4 shadow-[0_18px_40px_rgba(6,55,95,0.35)]">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#dde8ce]">
          <svg viewBox="0 0 24 24" className="size-5" fill="none">
            <path
              d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"
              stroke="#4C7A46"
              strokeWidth="1.75"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="2.75" stroke="#4C7A46" strokeWidth="1.75" />
          </svg>
        </span>

        <div className="min-w-0 flex-1">
          <p className="font-semi text-[15px] leading-tight text-[#101014]">
            Time to look away
          </p>
          <p className="font-body text-[13px] leading-tight text-[rgba(16,16,20,0.6)]">
            {settings.restFor} seconds, six metres out.
          </p>
        </div>

        <button
          onClick={() => snooze(5)}
          className="shrink-0 rounded-full px-3 py-2 font-semi text-[13px] text-[rgba(16,16,20,0.55)] transition-colors hover:bg-[rgba(16,16,20,0.06)]"
        >
          Not now
        </button>
        <button
          onClick={startBreak}
          className="shrink-0 rounded-full bg-[#101014] px-4 py-2.5 font-semi text-[13px] text-white transition-transform hover:scale-[1.03]"
        >
          Take it
        </button>
      </div>
    </div>
  );
}
