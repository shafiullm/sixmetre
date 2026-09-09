# SIXMETRE

A 20-20-20 companion for people who work at a screen. Every twenty minutes,
look at something roughly six metres (twenty feet) away for twenty seconds.

The interface is the desktop reflow of the mobile designs — navy ground, white
cards, Montserrat for display and Source Code Pro for anything numeric — with a
left sidebar in place of the phone's bottom tab bar.

## Running it

```bash
pnpm install
pnpm dev        # http://localhost:5173
```

Other scripts:

| Script | What it does |
| --- | --- |
| `pnpm build` | Typechecks, then builds to `dist/` |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm preview` | Serves the production build |
| `pnpm e2e` | End-to-end smoke test (needs `pnpm dev` running) |

The e2e run needs a Chromium. Either `pnpm exec playwright install chromium`
once, or point at an existing one with `CHROMIUM_PATH=/path/to/chrome pnpm e2e`.

## How it works

There is no server and no account. Everything lives in `localStorage` under
`sixmetre:v1`, so your break history stays in the browser you keep it in, and
"Clear history" in **You** really does erase it.

### The timer

`src/state/AppState.tsx` owns the running app: settings, the break log, and the
timer that drives both.

It stores `nextBreakAt` as a wall-clock timestamp and compares it against
`Date.now()` rather than counting ticks. A background tab that gets throttled,
a laptop that sleeps, a reload mid-block — none of them stretch or reset a
twenty-minute block. The same applies inside a break: the look-away counts down
against a fixed end time.

The timer is **held**, rather than run down, whenever a break would not make
sense — outside your scheduled hours, at the weekend if weekends are off, in
fullscreen if you asked for that, or while snoozed. Today shows which of those
is holding it.

### What counts as what

| Outcome | How you get it |
| --- | --- |
| `kept` | You saw the look-away through to zero |
| `skipped` | You hit "Skip this one" |
| `missed` | A banner nudge went unanswered for a minute |

Every resolved break is appended to the log, and the Log screen's numbers —
the D/W/M/Y chart, the chips, kept percentage, longest stretch, worst hour,
progress against your weekly target — are all derived from that log in
`src/lib/stats.ts`. Nothing on that screen is hardcoded.

### Screen time

Counted a second at a time, only while the tab is actually visible, inside your
hours, and not mid-break. It is folded into storage every fifteen seconds
rather than every tick.

### The first run

A brand-new install has nothing to show, which makes a working app look like a
broken one. So the first run seeds a fortnight of plausible history from a
fixed seed (`src/lib/seed.ts`). **You → Clear history** removes it, after which
the Log shows only what you actually did.

### Honest limits

- **Pause during calls** cannot detect a call — a web page has no way to see
  one. The toggle adds a manual "on a call, hold 30 min" button to Today.
- **Pause on full screen video** is real: it watches `fullscreenchange`, so it
  triggers on anything fullscreen in this browser, not only video.
- **Buzz only** falls back to the banner where `navigator.vibrate` is
  unsupported, which is most desktop browsers.

## Layout

```
src/
  state/AppState.tsx     settings, break log, and the timer
  lib/
    store.ts             localStorage, schema-versioned
    stats.ts             every derived number the UI shows
    seed.ts              first-run demo history
    time.ts              local-time helpers and formatting
  views/                 Today, Log, Learn, You
  components/
    break/               the full-viewport look-away flow
    Sidebar, NudgeBanner, Avatar
  content/articles.ts    Learn copy
  imports/               Figma exports — Logo is used; the Stage* screens are
                         kept as design reference and are not imported
e2e/smoke.mjs            end-to-end smoke test
docs/                    the original design notes from the Figma export
```
