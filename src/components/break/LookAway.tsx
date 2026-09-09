// The 20-second "look away" countdown — desktop reflow of the mobile look-away screen.
export default function LookAway({
  remaining,
  total,
  onSkip,
}: {
  remaining: number;
  total: number;
  onSkip: () => void;
}) {
  const progress = ((total - remaining) / total) * 100;

  return (
    <div
      className="flex size-full flex-col items-center justify-center px-6"
      style={{ backgroundColor: "#1a3d2e" }}
    >
      <div className="flex flex-col items-center">
        <p className="font-bold-m text-[11px] uppercase tracking-[0.6px] text-white">
          Look away
        </p>
        <p className="font-mono-b text-white leading-none [font-size:clamp(120px,22vw,200px)] tracking-[-6px]">
          {remaining}
        </p>
        <p className="font-bold-m text-[11px] uppercase tracking-[0.6px] text-white">
          Seconds
        </p>
      </div>

      {/* progress rule */}
      <div className="mt-8 h-0.5 w-[min(393px,80vw)] bg-[rgba(16,16,20,0.15)]">
        <div className="h-full bg-white transition-[width] duration-1000 ease-linear" style={{ width: `${progress}%` }} />
      </div>

      <p className="mt-8 max-w-[460px] text-center font-semi text-[20px] leading-[28px] text-white">
        Find something at least six metres out. A window, a doorway, the far end
        of the room.
      </p>

      {/* distance scale */}
      <div className="mt-8 w-[min(345px,80vw)]">
        <div className="flex h-5 items-center">
          <span className="h-5 w-px bg-white" />
          <span className="h-px flex-1 bg-white" />
          <span className="h-5 w-px bg-white" />
        </div>
        <div className="mt-2 flex items-center justify-between font-bold-m text-[11px] uppercase tracking-[0.6px] text-white">
          <span>6 m</span>
          <span>20 ft</span>
        </div>
      </div>

      <button
        onClick={onSkip}
        className="mt-14 h-12 w-[min(345px,80vw)] rounded-full border border-white font-semi text-[16px] text-white transition-colors hover:bg-white/10"
      >
        Skip this one
      </button>
    </div>
  );
}
