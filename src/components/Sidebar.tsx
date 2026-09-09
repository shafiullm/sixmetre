import type { ReactNode } from "react";
import Logo from "../imports/Logo";
import { user } from "../data";

export type View = "today" | "log" | "learn" | "you";

const icons: Record<View, ReactNode> = {
  today: (
    <svg viewBox="0 0 24 24" fill="none" className="size-full">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
      <path d="M12 7.5V12.5L15 14.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  ),
  log: (
    <svg viewBox="0 0 24 24" fill="none" className="size-full">
      <path d="M4 19V9M9.5 19V5M15 19V11M20.5 19V14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  ),
  learn: (
    <svg viewBox="0 0 24 24" fill="none" className="size-full">
      <path d="M4 5.5C4 5.5 7 4 12 5.5V19C7 17.5 4 19 4 19V5.5Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M20 5.5C20 5.5 17 4 12 5.5V19C17 17.5 20 19 20 19V5.5Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    </svg>
  ),
  you: (
    <svg viewBox="0 0 24 24" fill="none" className="size-full">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.75" />
      <path d="M5 20C5 16.5 8 14.5 12 14.5C16 14.5 19 16.5 19 20" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  ),
};

const navItems: { id: View; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "log", label: "Log" },
  { id: "learn", label: "Learn" },
  { id: "you", label: "You" },
];

export default function Sidebar({
  active,
  onNavigate,
}: {
  active: View;
  onNavigate: (v: View) => void;
}) {
  return (
    <>
      {/* Desktop — left sidebar */}
      <nav className="hidden h-full flex-col justify-between border-r border-white/10 bg-[#06375f]/90 px-5 py-6 backdrop-blur-sm md:flex">
        <div>
          {/* Brand — user's SIXMETRE logo */}
          <div className="mb-10">
            <div className="mx-auto h-[54px] w-[184px]">
              <Logo />
            </div>
          </div>

          {/* Nav */}
          <ul className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className={`group flex w-full items-center justify-start gap-3 rounded-2xl px-3 py-3 transition-colors ${
                      isActive
                        ? "bg-white text-[#101014]"
                        : "text-white/60 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="size-5 shrink-0">{icons[item.id]}</span>
                    <span className="font-semi text-[13px] tracking-[0.4px]">
                      {item.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* User */}
        <button
          onClick={() => onNavigate("you")}
          className="flex items-center justify-start gap-3 rounded-2xl px-2 py-2 text-left transition-colors hover:bg-white/10"
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="size-9 shrink-0 rounded-full bg-white/20 object-cover"
          />
          <div className="min-w-0">
            <div className="font-semi truncate text-[13px] text-white">{user.name}</div>
            <div className="font-body truncate text-[11px] text-white/50">
              {user.role}
            </div>
          </div>
        </button>
      </nav>

      {/* Phone — fixed bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-white/10 bg-[#06375f]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
        {navItems.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-1 flex-col items-center gap-1 py-2.5 transition-colors ${
                isActive ? "text-white" : "text-white/50"
              }`}
            >
              <span className="size-6 shrink-0">{icons[item.id]}</span>
              <span className="font-semi text-[10px] tracking-[0.4px]">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
