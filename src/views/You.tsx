import { useState } from "react";
import { useApp } from "../state/AppState";
import Avatar from "../components/Avatar";
import { parseClock } from "../lib/time";
import type { EyeFact, NudgeStyle } from "../types";

const BREAK_EVERY_OPTIONS = [15, 20, 25, 30];
const REST_FOR_OPTIONS = [20, 30, 45];

const NUDGE: { id: NudgeStyle; label: string; hint: string }[] = [
  { id: "screen", label: "Take the screen", hint: "The break covers everything." },
  { id: "banner", label: "Banner only", hint: "A card at the top you can take or defer." },
  { id: "buzz", label: "Buzz only", hint: "Banner plus a vibration where supported." },
];

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
          aria-pressed={value === o}
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
  hint,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  hint?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-white px-5 py-4">
      <span className="min-w-0">
        <span className="block font-semi text-[15px] text-[#101014]">{label}</span>
        {hint && (
          <span className="mt-0.5 block font-body text-[12px] leading-snug text-[rgba(16,16,20,0.55)]">
            {hint}
          </span>
        )}
      </span>
      <button
        onClick={onChange}
        role="switch"
        aria-checked={checked}
        aria-label={label}
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
  invalid,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  invalid?: boolean;
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
        aria-invalid={invalid || undefined}
        className={`w-full rounded-2xl bg-white/10 px-4 py-3 font-body text-[15px] text-white outline-none placeholder:text-white/30 focus:ring-2 ${
          invalid ? "ring-2 ring-[#f4622e]" : "focus:ring-white/20"
        }`}
      />
    </div>
  );
}

export default function You() {
  const { settings, updateSettings, clearHistory, events } = useApp();
  const [editOpen, setEditOpen] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  // Draft state for the edit sheet — committed only on Save.
  const [draftName, setDraftName] = useState(settings.name);
  const [draftRole, setDraftRole] = useState(settings.role);
  const [draftEyes, setDraftEyes] = useState<EyeFact[]>(settings.eyes);
  const [draftFrom, setDraftFrom] = useState(settings.scheduleFrom);
  const [draftTo, setDraftTo] = useState(settings.scheduleTo);

  const fromValid = parseClock(draftFrom) !== null;
  const toValid = parseClock(draftTo) !== null;
  const orderValid =
    fromValid && toValid && (parseClock(draftFrom) ?? 0) < (parseClock(draftTo) ?? 0);
  const canSave = draftName.trim().length > 0 && orderValid;

  const openEdit = () => {
    setDraftName(settings.name);
    setDraftRole(settings.role);
    setDraftEyes(settings.eyes);
    setDraftFrom(settings.scheduleFrom);
    setDraftTo(settings.scheduleTo);
    setEditOpen(true);
  };

  const saveEdit = () => {
    if (!canSave) return;
    updateSettings({
      name: draftName.trim(),
      role: draftRole.trim(),
      eyes: draftEyes,
      scheduleFrom: draftFrom.trim(),
      scheduleTo: draftTo.trim(),
    });
    setEditOpen(false);
  };

  return (
    <div className="mx-auto max-w-[1120px] px-6 py-10 md:px-12 md:py-14">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Avatar
          src={settings.avatar}
          name={settings.name}
          className="size-16 rounded-2xl text-[22px]"
        />
        <div className="min-w-0 flex-1">
          <h1 className="font-bold-m text-[26px] text-white">{settings.name}</h1>
          <p className="font-bold-m text-[11px] uppercase tracking-[0.6px] text-white/70">
            {settings.role}
          </p>
        </div>
        <button
          onClick={openEdit}
          aria-label="Edit profile"
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
                {settings.scheduleFrom}
              </div>
              <span className="font-body text-white/70">to</span>
              <div className="flex-1 rounded-2xl bg-white py-4 text-center font-mono-b text-[24px] text-[#101014]">
                {settings.scheduleTo}
              </div>
            </div>
          </section>

          <section>
            <SectionLabel>Break every</SectionLabel>
            <Choice
              options={BREAK_EVERY_OPTIONS}
              value={settings.breakEvery}
              onChange={(breakEvery) => updateSettings({ breakEvery })}
              suffix="min"
            />
          </section>

          <section>
            <SectionLabel>For</SectionLabel>
            <Choice
              options={REST_FOR_OPTIONS}
              value={settings.restFor}
              onChange={(restFor) => updateSettings({ restFor })}
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
                  onClick={() => updateSettings({ nudgeStyle: n.id })}
                  aria-pressed={settings.nudgeStyle === n.id}
                  className="flex w-full items-center justify-between gap-4 rounded-2xl bg-white px-5 py-4 text-left"
                >
                  <span className="min-w-0">
                    <span className="block font-semi text-[15px] text-[#101014]">
                      {n.label}
                    </span>
                    <span className="mt-0.5 block font-body text-[12px] leading-snug text-[rgba(16,16,20,0.55)]">
                      {n.hint}
                    </span>
                  </span>
                  <span
                    className={`grid size-5 shrink-0 place-items-center rounded-full border-2 ${
                      settings.nudgeStyle === n.id
                        ? "border-[#101014]"
                        : "border-[rgba(16,16,20,0.25)]"
                    }`}
                  >
                    {settings.nudgeStyle === n.id && (
                      <span className="size-2.5 rounded-full bg-[#101014]" />
                    )}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <Toggle
              label="Pause during calls"
              hint="Adds a hold button to Today — a web page can't see your calls on its own."
              checked={settings.pauseDuringCalls}
              onChange={() =>
                updateSettings({ pauseDuringCalls: !settings.pauseDuringCalls })
              }
            />
            <Toggle
              label="Pause on full screen video"
              hint="Holds the timer whenever this browser is in full screen."
              checked={settings.pauseFullScreenVideo}
              onChange={() =>
                updateSettings({ pauseFullScreenVideo: !settings.pauseFullScreenVideo })
              }
            />
            <Toggle
              label="Weekends off"
              hint="No nudges on Saturday or Sunday."
              checked={settings.weekendsOff}
              onChange={() => updateSettings({ weekendsOff: !settings.weekendsOff })}
            />
          </section>
        </div>
      </div>

      {/* Your eyes */}
      <section className="mt-10">
        <SectionLabel>Your eyes</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {settings.eyes.map((e) => (
            <div key={e.label} className="rounded-2xl bg-white/15 p-4 backdrop-blur-sm">
              <p className="font-bold-m text-[11px] uppercase tracking-[0.6px] text-white/60">
                {e.label}
              </p>
              <p className="mt-1 font-semi text-[15px] text-white">
                {e.value || "—"}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Data */}
      <section className="mt-10">
        <SectionLabel>Your data</SectionLabel>
        <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
          <p className="max-w-[62ch] font-body text-[14px] leading-[22px] text-white/80">
            SIXMETRE keeps everything in this browser — no account, no server. Your
            log holds {events.length} look-away{events.length === 1 ? "" : "s"},
            including the sample fortnight a fresh install starts with.
          </p>
          {confirmClear ? (
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  clearHistory();
                  setConfirmClear(false);
                }}
                className="rounded-full bg-[#f4622e] px-5 py-2.5 font-semi text-[13px] text-white"
              >
                Erase it all
              </button>
              <button
                onClick={() => setConfirmClear(false)}
                className="rounded-full border border-white/40 px-5 py-2.5 font-semi text-[13px] text-white transition-colors hover:bg-white/10"
              >
                Keep it
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmClear(true)}
              className="mt-4 rounded-full border border-white/40 px-5 py-2.5 font-semi text-[13px] text-white transition-colors hover:bg-white/10"
            >
              Clear history
            </button>
          )}
        </div>
      </section>

      {/* Edit sheet */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-end" role="dialog" aria-modal="true">
          <button
            aria-label="Close"
            onClick={() => setEditOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <div className="relative max-h-[90vh] w-full overflow-y-auto rounded-t-[28px] bg-[#07325a] pb-[env(safe-area-inset-bottom)] md:mx-auto md:max-w-[560px] md:rounded-[28px]">
            <div className="sticky top-0 z-10 flex items-center justify-between bg-[#07325a] px-6 pt-5 pb-4">
              <span className="font-bold-m text-[11px] uppercase tracking-[0.6px] text-white/70">
                Edit profile
              </span>
              <button
                onClick={() => setEditOpen(false)}
                aria-label="Close"
                className="grid size-8 place-items-center rounded-full bg-white/10 text-white"
              >
                <svg viewBox="0 0 14 14" className="size-3.5" fill="none">
                  <path d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="space-y-8 px-6 pb-6">
              <section>
                <SectionLabel>Profile</SectionLabel>
                <div className="space-y-3">
                  <InputField
                    label="Name"
                    value={draftName}
                    onChange={setDraftName}
                    placeholder="Your name"
                    invalid={draftName.trim().length === 0}
                  />
                  <InputField
                    label="Role / motto"
                    value={draftRole}
                    onChange={setDraftRole}
                    placeholder="e.g. Desk worker, 8 hr shift"
                  />
                </div>
              </section>

              <div className="h-px bg-white/10" />

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
                          prev.map((item, idx) => (idx === i ? { ...item, value: v } : item)),
                        )
                      }
                    />
                  ))}
                </div>
              </section>

              <div className="h-px bg-white/10" />

              <section>
                <SectionLabel>Schedule</SectionLabel>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <InputField
                      label="From"
                      value={draftFrom}
                      onChange={setDraftFrom}
                      placeholder="09:00"
                      invalid={!fromValid}
                    />
                  </div>
                  <span className="mt-9 font-bold-m text-[11px] uppercase tracking-[0.6px] text-white/70">
                    to
                  </span>
                  <div className="flex-1">
                    <InputField
                      label="To"
                      value={draftTo}
                      onChange={setDraftTo}
                      placeholder="18:00"
                      invalid={!toValid}
                    />
                  </div>
                </div>
                {!orderValid && (
                  <p className="mt-2 font-body text-[13px] text-[#f4622e]">
                    Use 24-hour times, and start before you finish.
                  </p>
                )}
              </section>

              <div className="h-px bg-white/10" />

              <button
                onClick={saveEdit}
                disabled={!canSave}
                className="h-14 w-full rounded-2xl bg-white font-semi text-[16px] text-[#07325a] transition-transform enabled:hover:scale-[1.01] enabled:active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
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
