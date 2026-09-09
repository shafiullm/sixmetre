import { useState } from "react";
import Sidebar, { type View } from "./components/Sidebar";
import BreakFlow from "./components/break/BreakFlow";
import NudgeBanner from "./components/NudgeBanner";
import Today from "./views/Today";
import Log from "./views/Log";
import Learn from "./views/Learn";
import You from "./views/You";
import { AppProvider, useApp } from "./state/AppState";

function Shell() {
  const [view, setView] = useState<View>("today");
  const { breaking } = useApp();

  return (
    <div className="h-full md:grid md:grid-cols-[240px_1fr] md:overflow-hidden">
      <Sidebar active={view} onNavigate={setView} />

      <main className="app-bg h-full overflow-y-auto pt-[env(safe-area-inset-top)] pb-[calc(72px+env(safe-area-inset-bottom))] md:pt-0 md:pb-0">
        {view === "today" && <Today />}
        {view === "log" && <Log />}
        {view === "learn" && <Learn />}
        {view === "you" && <You />}
      </main>

      <NudgeBanner />
      {breaking && <BreakFlow />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
