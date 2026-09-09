// Full-viewport break experience: live look-away countdown → eyes rested.
//
// The countdown runs off the wall clock rather than counting ticks, so a
// throttled background tab can't quietly stretch twenty seconds into a minute.
import { useEffect, useMemo, useRef, useState } from "react";
import LookAway from "./LookAway";
import EyesRested from "./EyesRested";
import { useApp } from "../../state/AppState";
import { todayStats } from "../../lib/stats";
import type { Outcome } from "../../types";

export default function BreakFlow() {
  const { settings, events, screen, resolveBreak, now } = useApp();

  const [step, setStep] = useState<"lookaway" | "rested">("lookaway");
  const [endsAt, setEndsAt] = useState(() => Date.now() + settings.restFor * 1000);
  const [total, setTotal] = useState(settings.restFor);
  const [banked, setBanked] = useState(0);
  const outcome = useRef<Outcome>("kept");

  // `now` refreshes once a second, so it can be up to a second behind the
  // moment endsAt was set — clamp, or the first frame renders total + 1.
  const remaining = Math.min(total, Math.max(0, Math.ceil((endsAt - now) / 1000)));

  useEffect(() => {
    if (step !== "lookaway" || remaining > 0) return;
    setBanked((b) => b + total);
    setStep("rested");
  }, [step, remaining, total]);

  const stats = useMemo(
    () => todayStats(events, screen, settings, now),
    [events, screen, settings, now],
  );

  // Kept look-aways in an unbroken run, counting back from the most recent.
  const streak = useMemo(() => {
    let n = 0;
    for (let i = events.length - 1; i >= 0; i--) {
      if (events[i].outcome !== "kept") break;
      n++;
    }
    return n;
  }, [events]);

  if (step === "lookaway") {
    return (
      <div className="fixed inset-0 z-50">
        <LookAway
          remaining={remaining}
          total={total}
          onSkip={() => {
            outcome.current = "skipped";
            setBanked((b) => b + (total - remaining));
            setStep("rested");
          }}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50">
      <EyesRested
        banked={banked}
        // The break in progress isn't logged yet, so count it here.
        today={stats.kept + (outcome.current === "kept" ? 1 : 0)}
        streak={outcome.current === "kept" ? streak + 1 : 0}
        skipped={outcome.current === "skipped"}
        onBackToWork={() => resolveBreak(outcome.current, banked)}
        onAddMore={() => {
          // Twenty more seconds counts as keeping the break either way.
          outcome.current = "kept";
          setTotal(20);
          setEndsAt(Date.now() + 20_000);
          setStep("lookaway");
        }}
      />
    </div>
  );
}
