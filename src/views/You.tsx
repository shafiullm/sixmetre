import { useState } from "react";
import { profile, user } from "../data";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 font-bold-m text-[11px] uppercase tracking-[0.6px] text-white/70">
      {children}
    </p>
  );
}

function Choice({
  options,
  value,
  onChange,
  suffix,
}: {
  options: number[];
  value: number;
  onChange: (v: number) => void;
  suffix: string;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={`min-w-[92px] flex-1 rounded-2xl py-4 font-bold-m text-[13px] transition-colors ${
            value === o
              ? "bg-[#101014] text-white"
              : "bg-white text-[#101014] hover:bg-white/90"
          }`}
        >
          {o} {suffix}
        </button>
      ))}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white px-5 py-4">
      <span className="font-semi text-[15px] text-[#101014]">{label}</span>
      <button
        onClick={onChange}
        role="switch"
        aria-checked={checked}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
          checked ? "bg-[#101014]" : "bg-[rgba(16,16,20,0.2)]"
        }`}
      >
        <span
          className={`absolute top-1 size-5 rounded-full bg-white transition-all ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <p className="mb-2 font-bold-m text-[11px] uppercase tracking-[0.6px] text-white/70">
        {label}
      </p>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl bg-white/10 px-4 py-3 font-body text-[15px] text-white outline-none placeholder:text-white/30 focus:ring-2 focus:ring-white/20"
      />
    </div>
  );
}

const NUDGE = [
  { id: "screen", label: "Take the screen" },
  { id: "banner", label: "Banner only" },
  { id: "buzz", label: "Buzz only" },
];

export default function You() {
  const [breakEvery, setBreakEvery] = useState(profile.breakEvery);
  const [restFor, setRestFor] = useState(profile.restFor);
  const [nudge, setNudge] = useState(profile.nudgeStyle);
  const [toggles, setToggles] = useState(profile.toggles);

  // Editable profile fields
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [eyes, setEyes] = useState(profile.eyes);
  const [scheduleFrom, setScheduleFrom] = useState(profile.scheduleFrom);
  const [scheduleTo, setScheduleTo] = useState(profile.scheduleTo);

  // Edit sheet state
  const [editOpen, setEditOpen] = useState(false);
  const [draftName, setDraftName] = useState(name);
  const [draftRole, setDraftRole] = useState(role);
  const [draftEyes, setDraftEyes] = useState(eyes);
  const [draftFrom, setDraftFrom] = useState(scheduleFrom);
  const [draftTo, setDraftTo] = useState(scheduleTo);

  const openEdit = () => {
    setDraftName(name);
    setDraftRole(role);
    setDraftEyes(eyes);
    setDraftFrom(scheduleFrom);
    setDraftTo(scheduleTo);
    setEditOpen(true);
  };

  const saveEdit = () => {
    setName(draftName);
    setRole(draftRole);
    setEyes(draftEyes);
    setScheduleFrom(draftFrom);
    setScheduleTo(draftTo);
    setEditOpen(false);
  };

  const flip = (k: keyof typeof toggles) =>
    setToggles((t) => ({ ...t, [k]: !t[k] }));

  return (
    <div className="mx-auto max-w-[1120px] px-6 py-10 md:px-12 md:py-14">
      {/* Header */}
      <div className="flex items-center gap-4">
        <img
          src={user.avatar}
          alt={name}
          className="size-16 rounded-2xl bg-white/20 object-cover"
        />
        <div className="flex-1">
          <h1 className="font-bold-m text-[26px] text-white">{name}</h1>
          <p className="font-bold-m text-[11px] uppercase tracking-[0.6px] text-white/70">
            {role}
          </p>
        </div>
        <button
          onClick={openEdit}
          className="grid size-9 place-items-center rounded-xl bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
        >
          <svg viewBox="0 0 20 20" className="size-4" fill="none">
            <path d="M13.5 3.5L16.5 6.5L7 16H4V13L13.5 3.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M11.5 5.5L14.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-start">
        {/* Left column */}
        <div className="space-y-8">
          <section>
            <SectionLabel>Schedule</SectionLabel>
            <div className="flex items-center gap-4">
              <div className="flex-1 rounded-2xl bg-white py-4 text-center font-mono-b text-[24px] text-[#101014]">
                {scheduleFrom}
              </div>
              <span className="font-body text-white/70">to</span>
              <div className="flex-1 rounded-2xl bg-white py-4 text-center font-mono-b text-[24px] text-[#101014]">
                {scheduleTo}
              </div>
            </div>
          </section>

          <section>
            <SectionLabel>Break every</SectionLabel>
            <Choice
              options={profile.breakEveryOptions}
              value={breakEvery}
              onChange={setBreakEvery}
              suffix="min"
            />
          </section>

          <section>
            <SectionLabel>For</SectionLabel>
            <Choice
              options={profile.restForOptions}
              value={restFor}
              onChange={setRestFor}
              suffix="s"
            />
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-8">
          <section>
            <SectionLabel>Nudge style</SectionLabel>
            <div className="space-y-3">
              {NUDGE.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setNudge(n.id)}
                  className="flex w-full items-center justify-between rounded-2xl bg-white px-5 py-4"
                >
                  <span className="font-semi text-[15px] text-[#101014]">{n.label}</span>
                  <span
                    className={`grid size-5 place-items-center rounded-full border-2 ${
                      nudge === n.id ? "border-[#101014]" : "border-[rgba(16,16,20,0.25)]"
                    }`}
                  >
                    {nudge === n.id && <span className="size-2.5 rounded-full bg-[#101014]" />}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <Toggle
              label="Pause during calls"
              checked={toggles.pauseDuringCalls}
              onChange={() => flip("pauseDuringCalls")}
            />
            <Toggle
              label="Pause on full screen video"
              checked={toggles.pauseFullScreenVideo}
              onChange={() => flip("pauseFullScreenVideo")}
            />
            <Toggle
              label="Weekends off"
              checked={toggles.weekendsOff}
              onChange={() => flip("weekendsOff")}
            />
          </section>
        </div>
      </div>

      {/* Your eyes */}
      <section className="mt-10">
        <SectionLabel>Your eyes</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {eyes.map((e) => (
            <div key={e.label} className="rounded-2xl bg-white/15 p-4 backdrop-blur-sm">
              <p className="font-bold-m text-[11px] uppercase tracking-[0.6px] text-white/60">
                {e.label}
              </p>
              <p className="mt-1 font-semi text-[15px] text-white">{e.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Edit sheet */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-end">
          <button
            aria-label="Close"
            onClick={() => setEditOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <div className="relative w-full max-h-[90vh] overflow-y-auto rounded-t-[28px] bg-[#07325a] pb-[env(safe-area-inset-bottom)]">
            {/* Sheet header */}
            <div className="sticky top-0 z-10 flex items-center justify-between bg-[#07325a] px-6 pt-5 pb-4">
              <span className="font-bold-m text-[11px] uppercase tracking-[0.6px] text-white/70">
                Edit profile
              </span>
              <button
                onClick={() => setEditOpen(false)}
                className="grid size-8 place-items-center rounded-full bg-white/10 text-white"
              >
                <svg viewBox="0 0 14 14" className="size-3.5" fill="none">
                  <path d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="space-y-8 px-6 pb-6">
              {/* Profile */}
              <section>
                <SectionLabel>Profile</SectionLabel>
                <div className="space-y-3">
                  <InputField label="Name" value={draftName} onChange={setDraftName} placeholder="Your name" />
                  <InputField label="Role / motto" value={draftRole} onChange={setDraftRole} placeholder="e.g. Desk worker, 8 hr shift" />
                </div>
              </section>

              <div className="h-px bg-white/10" />

              {/* Your eyes */}
              <section>
                <SectionLabel>Your eyes</SectionLabel>
                <div className="space-y-3">
                  {draftEyes.map((e, i) => (
                    <InputField
                      key={e.label}
                      label={e.label}
                      value={e.value}
                      onChange={(v) =>
                        setDraftEyes((prev) =>
                          prev.map((item, idx) => (idx === i ? { ...item, value: v } : item))
                        )
                      }
                    />
                  ))}
                </div>
              </section>

              <div className="h-px bg-white/10" />

              {/* Schedule */}
              <section>
                <SectionLabel>Schedule</SectionLabel>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <InputField label="From" value={draftFrom} onChange={setDraftFrom} placeholder="09:00" />
                  </div>
                  <span className="mt-5 font-bold-m text-[11px] uppercase tracking-[0.6px] text-white/70">to</span>
                  <div className="flex-1">
                    <InputField label="To" value={draftTo} onChange={setDraftTo} placeholder="18:00" />
                  </div>
                </div>
              </section>

              <div className="h-px bg-white/10" />

              {/* Save */}
              <button
                onClick={saveEdit}
                className="h-14 w-full rounded-2xl bg-white font-semi text-[16px] text-[#07325a] transition-transform hover:scale-[1.01] active:scale-[0.99]"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
