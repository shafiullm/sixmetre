// Shared mock data for the SIXMETRE desktop app — values mirror the mobile designs.

export const user = {
  name: "Martin Karim",
  role: "Desk worker, 8 hr shift",
  avatar:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&auto=format",
};

export const today = {
  headline: ["Twelve minutes at", "arm's length.", "Eight to go."],
  nextLookAwaySeconds: 7 * 60 + 41, // 07:41 until the next scheduled break
  workBlockSeconds: 20 * 60, // a full 20-minute work block
  block: { current: 12, total: 18 },
  kept: 9,
  missed: 3,
  toCome: 6,
  screenToday: "5 hr 12 min",
  rested: "3 min 40 s",
  restedLookAways: 11,
};

// Today's look-away marks for the strip on the dashboard.
export const todayMarks: ("kept" | "missed" | "come")[] = [
  "kept", "missed", "kept", "kept", "kept", "missed", "kept", "kept",
  "missed", "kept", "kept", "kept", "come", "come", "come", "come", "come", "come",
];

export const logDay = {
  date: "TUE 19 AUG",
  lookAwaysToday: 14,
  // hourly bar heights (px) — matches the imported Log chart
  bars: [14, 38, 62, 88, 70, 44, 96, 52, 30, 58, 84, 110, 66, 28, 12],
  screenTime: "5 hr 12 min",
  // width (px) of each screen-session segment across the day
  screenSegments: [38, 34, 36, 32, 40, 34, 36, 34],
  kept: 14,
  missed: 3,
  skipped: 1,
};

export const weekReview = {
  range: "11 TO 17 AUG",
  keptPercent: 76,
  vsLastWeek: 9,
  longestStretch: "Thursday, 2 hr 40 min without a look-away.",
  worstHour: "15:00. You miss more breaks then than at any other time.",
  // per-day kept/missed counts (M T W T F S S)
  days: [
    { label: "M", kept: 22, missed: 4 },
    { label: "T", kept: 20, missed: 6 },
    { label: "W", kept: 24, missed: 3 },
    { label: "T", kept: 18, missed: 8 },
    { label: "F", kept: 23, missed: 4 },
    { label: "S", kept: 6, missed: 0 },
    { label: "S", kept: 5, missed: 0 },
  ],
};

export const profile = {
  scheduleFrom: "09:00",
  scheduleTo: "18:00",
  breakEvery: 20, // minutes
  breakEveryOptions: [15, 20, 25, 30],
  restFor: 20, // seconds
  restForOptions: [20, 30, 45],
  nudgeStyle: "screen", // screen | banner | buzz
  toggles: {
    pauseDuringCalls: true,
    pauseFullScreenVideo: true,
    weekendsOff: false,
  },
  eyes: [
    { label: "Glasses/Contacts", value: "Contacts, daily" },
    { label: "Screen distance", value: "55 cm" },
    { label: "Dryness", value: "Mild, afternoons" },
    { label: "Hours a day", value: "8 to 9" },
  ],
};
