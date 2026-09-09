import { useEffect, useRef, useState } from "react";
import LookAway from "./LookAway";
import EyesRested from "./EyesRested";

// Full-viewport break experience: live look-away countdown → eyes-rested screen.
export default function BreakFlow({
  restFor,
  onClose,
}: {
  restFor: number; // seconds to rest
  onClose: () => void;
}) {
  const [step, setStep] = useState<"lookaway" | "rested">("lookaway");
  const [total, setTotal] = useState(restFor);
  const [remaining, setRemaining] = useState(restFor);
  const bankedRef = useRef(0);

  useEffect(() => {
    if (step !== "lookaway") return;
    if (remaining <= 0) {
      bankedRef.current = total;
      setStep("rested");
      return;
    }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [step, remaining, total]);

  return (
    <div className="fixed inset-0 z-50">
      {step === "lookaway" ? (
        <LookAway
          remaining={remaining}
          total={total}
          onSkip={() => {
            bankedRef.current = total - remaining;
            setStep("rested");
          }}
        />
      ) : (
        <EyesRested
          banked={bankedRef.current}
          onBackToWork={onClose}
          onAddMore={() => {
            setTotal((t) => t + 20);
            setRemaining(20);
            setStep("lookaway");
          }}
        />
      )}
    </div>
  );
}
