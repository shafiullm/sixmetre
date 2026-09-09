# SIXMETRE — Desktop / Website View

## Context

The user designed a mobile app for the **20-20-20 eye-break rule** (every ~20 min, look ~20 ft / 6 m away for 20 s). They now want the **desktop website version of the same product** — not a marketing page, but the app itself reflowed into a wide web-app layout with a **left sidebar** (Today / Log / Learn / You) replacing the mobile bottom tab bar.

The repo is effectively a blank slate: `src/App.tsx` is an empty stub, `src/index.css` only imports Tailwind (no fonts, no tokens), and no router is installed. The seven mobile screens exist only as reference images, **except** the "Eyes Rested" screen, which is present as imported Figma code at `imports/index.tsx` (`Stage`, aka `stage_5_2`). We build the whole desktop app from scratch, reusing that one import for the break-complete step.

**Visual language is already locked by the user's designs and must be preserved** (design-imports rule): navy→sage vertical gradient, white rounded cards, near-black (`#101014`) pill buttons, `Montserrat` for display/UI + `Source Code Pro` for numeric/data, accents orange `#f4622e` and green `#4c7a46`/`#8fb27a`/`#dde8ce`. No `create_make_theme` sampling — that would fight the established look.

## Approach

A single-page desktop app shell with lightweight `useState` view switching (no react-router — nav is flat and shallow) plus a full-viewport **break-flow overlay**.

### App shell & navigation
- `src/App.tsx` — holds `activeView` state (`today | log | learn | you`) and `breakActive` state. Renders a CSS-grid shell: fixed **left sidebar** (~240px) + scrollable **main content** area carrying the app gradient background.
- `src/components/Sidebar.tsx` — SIXMETRE wordmark + eye mark (small inline SVG in brand style), nav items with icons (clock / bar-chart / book / person, matching the mobile tab icons — inline SVGs), active-state highlight, user avatar (Martin Karim) pinned at the bottom. Collapses to a top bar / icon rail under ~1000px.

### Views (`src/views/`)
- `Today.tsx` — desktop reflow of image-5. Hero band: "Twelve minutes at arm's length. Eight to go." headline + **live NEXT LOOK-AWAY countdown** (`mm:ss`, Source Code Pro) with progress bar + `BLOCK 12 OF 18` + primary **"Rest my eyes now"** button. Below, a card grid: TODAY look-away strip with `9 KEPT / 3 MISSED / 6 TO COME` pills, `SCREEN TODAY` card (`5 hr 12 min`), `RESTED` card (`3 min 40 s`, `11 look-aways`). Two-column on wide screens, single column narrow.
- `Log.tsx` — image-2 + image-4. Segmented `D / W / M / Y` control (working state), `LOOK-AWAYS TODAY` bar chart (`14`) with gridlines + hour axis, `TIME AT SCREEN` segmented bar (`5 hr 12 min`), `KEPT 14 / MISSED 3 / SKIPPED 1` pills, and **"Week in review"** which expands to the image-4 panel (`You kept 76% of your breaks`, M–S kept/missed columns, longest stretch, worst hour, vs last week, "Set next week's target"). On desktop, week-in-review shows inline as a side panel rather than a mobile bottom sheet.
- `You.tsx` — image-1 settings. Profile header (Martin Karim, "Desk worker, 8 hr shift"), `SCHEDULE` 09:00→18:00, `BREAK EVERY` (15/20/25/30, selectable), `FOR` (20 s/30 s/45 s, selectable), `NUDGE STYLE` radio group (Take the screen / Banner only / Buzz only), toggles (Pause during calls, Pause on full screen video, Weekends off — working switches), `YOUR EYES` info cards (Glasses/Contacts, Screen distance, Dryness, Hours a day). Reflowed into a two-column settings layout for desktop.
- `Learn.tsx` — **no reference image exists**; design fresh in the same language: an educational hub about the 20-20-20 rule (what it is, why it works, article/tip cards, a "science" explainer). Realistic copy, no lorem.

### Break flow (`src/components/break/`) — the core interaction
Full-viewport `fixed inset-0 z-50` overlay launched by "Rest my eyes now" (or automatically when the Today countdown hits 0):
- `BreakFlow.tsx` — orchestrates steps and owns the live timers.
- `LookAway.tsx` — image-3: green gradient, `LOOK AWAY`, **live 20→0 countdown** (Source Code Pro 128px), instruction copy, `6 M ——— 20 FT` scale, "Skip this one". At 0 → advance.
- Eyes-rested step — **reuse the existing import**: render `Stage` from `imports/index.tsx` via a thin `src/components/break/EyesRested.tsx` wrapper (do NOT edit `imports/`). Wire its "Back to work" (closes overlay, resets the ~20 min work timer) and "Add twenty more" (adds 20 s to the countdown) buttons in the wrapper/BreakFlow, not in the import.

This delivers the requested mechanic: click the button → the look-away timer runs → after the countdown the user is prompted to rest, then returns to work.

### Shared pieces
- `src/data.ts` — realistic mock data (stats, chart values, profile, log figures) matching the designs, shared across views.
- Small primitives as needed (`PillButton`, `StatCard`, `Pill`) — kept minimal, following the imported code's exact classes/spacing where a screen mirrors an image.

### Fonts & tokens — `src/index.css`
Faces required across the manifests: **Montserrat** (ExtraBold, Bold, SemiBold, Regular) and **Source Code Pro** (Bold, Regular). The imported `Stage` references them by composite family names (`font-['Montserrat:SemiBold']`, `font-['Source_Code_Pro:Regular']`, …), so those exact family names must be defined.
- Per the font-manifest instructions: write one combined `{"fonts":[...]}` file with every unique row and run a single `figma fonts resolve --input <file>.json --out-dir public/fonts`. For each resolved row, add one `@font-face` **named by its `cssFamily`** (e.g. `font-family: "Montserrat:SemiBold"`) using the CLI-returned location (URL as-is, or file path with the `public` prefix stripped to a root-relative `/fonts/...` URL), keeping any returned `font_weight`/`font_style`/`format`. If a row is blocked, skip its `@font-face` and fall back to that family via Google Fonts (`@import` at the very top of `index.css`) under the family's own name.
- Add the design tokens (gradient stops, ink, accents) as CSS variables for reuse across new components.
- Keep CSS `@import` (if any) first, then `@font-face`, then tokens — Tailwind v4 via `@import 'tailwindcss'`.

## Critical files
- `src/App.tsx` — shell, view state, break overlay (rewrite the empty stub).
- `src/components/Sidebar.tsx`
- `src/views/{Today,Log,Learn,You}.tsx`
- `src/components/break/{BreakFlow,LookAway,EyesRested}.tsx`
- `src/data.ts`
- `src/index.css` — fonts + `@font-face` (per manifest) + tokens.
- Reuse (never edit): `imports/index.tsx` (`Stage`) and its `svg-*.ts` assets.

## Verification
- Vite dev server is already running on `$PORT`; confirm no build/console errors after wiring.
- Manually exercise: sidebar switches all four views; "Rest my eyes now" opens the break overlay; the 20 s look-away counts down live; "Skip this one" and reaching 0 both advance to Eyes Rested; "Back to work" closes the overlay and "Add twenty more" extends the timer.
- Confirm Log's `D/W/M/Y` control and "Week in review" expansion work, and You's toggles/radios/segments respond.
- Check fonts render (Montserrat headings, Source Code Pro numerals) and resize below ~1000px to confirm the sidebar and card grids collapse cleanly.
