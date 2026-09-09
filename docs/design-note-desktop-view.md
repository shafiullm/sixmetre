# Plan: Full Edit Profile Modal

## Context
The You page has a pencil/edit icon button in the profile header that is currently a stub with no behavior. The user wants it to open a full-page edit sheet covering name, role, the four "Your eyes" entries, schedule times, break/rest intervals, nudge style, and all toggles — everything on the You page in one place.

## Approach

### 1. Add local state for currently read-only fields in `You.tsx`
`user.name`, `user.role`, and `profile.eyes` render as static text with no state. Add:

```ts
const [name, setName] = useState(user.name);
const [role, setRole] = useState(user.role);
const [eyes, setEyes] = useState(profile.eyes);  // [{ label, value }, ...]
const [editOpen, setEditOpen] = useState(false);
```

`breakEvery`, `restFor`, `nudge`, and `toggles` already have useState — they feed directly into the edit sheet.

Replace static renders of `user.name`, `user.role`, and `profile.eyes` with the new state variables.

### 2. Wire the edit button
Add `onClick={() => setEditOpen(true)}` to the existing pencil button (~line 102).

### 3. Build the edit sheet
Slide-up sheet, same overlay pattern as the "Week in review" modal in `Log.tsx`:

- **Backdrop** — `fixed inset-0 z-50 flex items-end`, `bg-black/50 backdrop-blur-sm`, click closes without saving
- **Sheet** — `rounded-t-[28px] bg-[#07325a] w-full max-h-[90vh] overflow-y-auto pb-[env(safe-area-inset-bottom)]`
- **Sticky header** — "Edit profile" label + ✕ close button, `sticky top-0 bg-[#07325a] px-6 pt-5 pb-4`

**Sections inside the sheet:**

| Section | Fields |
|---|---|
| Profile | Name (text input), Role / motto (text input) |
| Your eyes | 4 text inputs, one per eye entry; label fixed, value editable |
| Schedule | From / To time inputs (reuse existing schedule display style) |
| Break every | Reuse `<Choice>` component with `breakEvery` / `setBreakEvery` |
| Rest for | Reuse `<Choice>` component with `restFor` / `setRestFor` |
| Nudge style | Reuse the existing radio button rows with `nudge` / `setNudge` |
| Preferences | Reuse `<Toggle>` components for the 3 toggles |

- **Save button** — full-width `h-14 rounded-2xl bg-white text-[#101014]` at the bottom; on click, commits all draft state and closes sheet. Changes to `breakEvery`, `restFor`, `nudge`, `toggles` already mutate their state directly (they're shared), so Save only needs to commit `name`, `role`, `eyes`, and `schedule`.

### 4. Input styling
`w-full rounded-2xl bg-white/10 px-4 py-3 text-white font-semi text-[15px] outline-none focus:ring-2 focus:ring-white/20 placeholder:text-white/30`

Section labels inside the sheet reuse the existing `<SectionLabel>` component.

### 5. Draft vs committed state
For `name`, `role`, `eyes`, use draft state inside the sheet initialized on open, committed only on Save. The already-stateful fields (`breakEvery`, etc.) update live (matching current You page behavior).

## Files to modify
- `src/views/You.tsx` — all changes contained here; reuses `Choice`, `Toggle`, `SectionLabel` already defined in the file

## Verification
- Pencil button opens the sheet
- All 6 sections render with current values pre-filled
- Editing name/role/eyes and hitting Save updates the profile header and "Your eyes" cards
- ✕ / backdrop dismisses without saving draft changes
- Break/rest/nudge/toggle changes persist as before (live state)
- Sheet scrolls on short screens; no content clipped
