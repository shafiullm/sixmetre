import { useState } from "react";
import Sidebar, { type View } from "./components/Sidebar";
import BreakFlow from "./components/break/BreakFlow";
import Today from "./views/Today";
import Log from "./views/Log";
import Learn from "./views/Learn";
import You from "./views/You";
import { profile } from "./data";

export default function App() {
  const [view, setView] = useState<View>("today");
  const [onBreak, setOnBreak] = useState(false);
  // Bumped when a break ends so Today remounts and its countdown restarts.
  const [sessionKey, setSessionKey] = useState(0);

  const endBreak = () => {
    setOnBreak(false);
    setSessionKey((k) => k + 1);
    setView("today");
  };

  return (
    <div className="h-full md:grid md:grid-cols-[240px_1fr] md:overflow-hidden">
      <Sidebar active={view} onNavigate={setView} />

      <main className="app-bg h-full overflow-y-auto pt-[env(safe-area-inset-top)] pb-[calc(72px+env(safe-area-inset-bottom))] md:pt-0 md:pb-0">
        {view === "today" && <Today key={sessionKey} onRest={() => setOnBreak(true)} />}
        {view === "log" && <Log />}
        {view === "learn" && <Learn />}
        {view === "you" && <You />}
      </main>

      {onBreak && (
        <BreakFlow restFor={profile.restFor} onClose={endBreak} />
      )}
    </div>
  );
}
