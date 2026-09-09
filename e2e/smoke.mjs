// End-to-end smoke test for SIXMETRE.
//
//   pnpm dev            # in one shell
//   pnpm e2e            # in another
//
// It drives the real app: the countdown, a full break, the log that break
// writes, persistence across reloads, the banner nudge, and the phone layout.
import { chromium } from "playwright";

const URL = process.env.BASE_URL ?? "http://localhost:5173/";
const SHOTS = process.env.SHOTS ?? "e2e/screenshots";
const pass = [], fail = [];
const check = (name, ok, extra = "") =>
  (ok ? pass : fail).push(`${ok ? "PASS" : "FAIL"} ${name}${extra ? " — " + extra : ""}`);

// CHROMIUM_PATH lets a sandboxed CI image point at a preinstalled browser;
// otherwise Playwright resolves the one it manages.
const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto(URL, { waitUntil: "networkidle" });

// --- 0. Out-of-hours state (this container's clock is outside 09:00-18:00) ---
const offHours = await page.locator("text=Outside your hours").isVisible().catch(() => false);
check("holds the timer outside working hours", offHours);
await page.screenshot({ path: `${SHOTS}/00-off-hours.png` });

// Widen the schedule so the rest of the run exercises a running timer.
await page.evaluate(() => {
  const s = JSON.parse(localStorage.getItem("sixmetre:v1"));
  s.settings.scheduleFrom = "00:00";
  s.settings.scheduleTo = "23:59";
  localStorage.setItem("sixmetre:v1", JSON.stringify(s));
});
await page.reload({ waitUntil: "networkidle" });

// --- 1. Today renders with a live countdown -----------------------------
const clockSel = "p.font-mono-b";
await page.waitForSelector("text=Next look-away");
const t1 = await page.locator(clockSel).first().innerText();
await page.waitForTimeout(2200);
const t2 = await page.locator(clockSel).first().innerText();
check("countdown is live", t1 !== t2, `${t1} -> ${t2}`);
check("countdown format mm:ss", /^\d{2}:\d{2}$/.test(t2), t2);

const block = await page.locator("text=/BLOCK \\d+ OF \\d+/").innerText();
check("block counter present", /BLOCK \d+ OF \d+/.test(block), block);

await page.screenshot({ path: `${SHOTS}/01-today.png` });

// --- 2. Navigation ------------------------------------------------------
for (const [label, marker] of [["Log", "Time at screen today"], ["Learn", "Read the guide"], ["You", "Nudge style"]]) {
  await page.getByRole("button", { name: label, exact: true }).first().click();
  const ok = await page.locator(`text=${marker}`).first().isVisible().catch(() => false);
  check(`nav to ${label}`, ok);
  await page.screenshot({ path: `${SHOTS}/0${label === "Log" ? 2 : label === "Learn" ? 3 : 4}-${label.toLowerCase()}.png` });
}

// --- 3. Settings persist and drive the engine ---------------------------
await page.getByRole("button", { name: "25 min" }).click();
await page.getByRole("button", { name: "45 s" }).click();
await page.getByRole("switch", { name: "Weekends off" }).click();
await page.reload({ waitUntil: "networkidle" });
await page.getByRole("button", { name: "You", exact: true }).first().click();
const every25 = await page.getByRole("button", { name: "25 min" }).getAttribute("aria-pressed");
const rest45 = await page.getByRole("button", { name: "45 s" }).getAttribute("aria-pressed");
const weekends = await page.getByRole("switch", { name: "Weekends off" }).getAttribute("aria-checked");
check("breakEvery persisted", every25 === "true", `aria-pressed=${every25}`);
check("restFor persisted", rest45 === "true", `aria-pressed=${rest45}`);
check("toggle persisted", weekends === "true", `aria-checked=${weekends}`);

// --- 4. Edit profile sheet ---------------------------------------------
await page.getByRole("button", { name: "Edit profile" }).click();
await page.getByRole("dialog").waitFor();
const nameInput = page.locator('input').first();
await nameInput.fill("Ada Lovelace");
await page.getByRole("button", { name: "Save changes" }).click();
await page.waitForTimeout(200);
const heading = await page.locator("h1").first().innerText();
check("edit profile saves", heading === "Ada Lovelace", heading);

// invalid schedule blocks save
await page.getByRole("button", { name: "Edit profile" }).click();
const inputs = page.locator("input");
await inputs.nth(6).fill("nonsense");
const disabled = await page.getByRole("button", { name: "Save changes" }).isDisabled();
check("invalid schedule blocks save", disabled);
await page.getByRole("dialog").getByLabel("Close").last().click();

// --- 5. Break flow, end to end -----------------------------------------
// Speed the look-away up so the full countdown can be watched, and prove the
// restFor setting really drives the break length.
await page.evaluate(() => {
  const s = JSON.parse(localStorage.getItem("sixmetre:v1"));
  s.settings.restFor = 3;
  s.events = [];
  localStorage.setItem("sixmetre:v1", JSON.stringify(s));
});
await page.reload({ waitUntil: "networkidle" });
await page.getByRole("button", { name: "Rest my eyes now" }).click();
await page.waitForSelector("text=Look away");
const first = await page.locator("text=/^[0-9]+$/").first().innerText();
check("break uses restFor setting", first === "3", `showed ${first}`);
await page.screenshot({ path: `${SHOTS}/05-lookaway.png` });
await page.waitForSelector("text=EYES RESTED", { timeout: 8000 });
check("countdown completes to Eyes Rested", true);
const banked = await page.locator("text=/\\d+ s banked/").innerText();
check("banked seconds reported", banked.startsWith("3 s"), banked);
await page.screenshot({ path: `${SHOTS}/06-rested.png` });
await page.getByRole("button", { name: "Back to work" }).click();
await page.waitForSelector("text=Next look-away");

// The kept break should now be in the log, and survive a reload.
await page.getByRole("button", { name: "Log", exact: true }).first().click();
const keptChip = await page.locator("text=/^Kept \\d+$/").innerText();
check("kept break recorded", keptChip.toLowerCase() === "kept 1", keptChip);
await page.reload({ waitUntil: "networkidle" });
await page.getByRole("button", { name: "Log", exact: true }).first().click();
const keptAfter = await page.locator("text=/^Kept \\d+$/").innerText();
check("log persists across reload", keptAfter.toLowerCase() === "kept 1", keptAfter);

// --- 6. Skipping is recorded differently --------------------------------
await page.getByRole("button", { name: "Today", exact: true }).first().click();
await page.getByRole("button", { name: "Rest my eyes now" }).click();
await page.getByRole("button", { name: "Skip this one" }).click();
await page.waitForSelector("text=BREAK CUT SHORT");
check("skip shows cut-short state", true);
await page.getByRole("button", { name: "Back to work" }).click();
await page.getByRole("button", { name: "Log", exact: true }).first().click();
const skipped = await page.locator("text=/^Skipped \\d+$/").innerText();
check("skip recorded as skipped", skipped.toLowerCase() === "skipped 1", skipped);

// --- 7. Log ranges switch the dataset -----------------------------------
const captions = {};
for (const r of ["D", "W", "M", "Y"]) {
  await page.getByRole("button", { name: r, exact: true }).click();
  await page.waitForTimeout(120);
  captions[r] = await page.locator("h1").first().locator("xpath=following-sibling::span").innerText().catch(() => "");
  const title = await page.locator("p.font-bold-m").first().innerText();
  captions[r + "_title"] = title;
}
check("range D/W/M/Y change the chart",
  new Set([captions.D_title, captions.W_title, captions.M_title, captions.Y_title]).size === 4,
  JSON.stringify([captions.D_title, captions.W_title, captions.M_title, captions.Y_title]));

// --- 7b. Weekly target persists ----------------------------------------
await page.getByRole("button", { name: "D", exact: true }).click();
await page.getByRole("button", { name: "Set next week's target" }).click();
await page.getByRole("button", { name: "Raise target" }).click();
await page.getByRole("button", { name: "Set 85%" }).click();
await page.screenshot({ path: `${SHOTS}/10-log-target.png` });
await page.reload({ waitUntil: "networkidle" });
await page.getByRole("button", { name: "Log", exact: true }).first().click();
const targetText = await page.locator("text=/85% target|Aiming to keep 85%/").first().isVisible().catch(() => false);
check("weekly target persists", targetText);

// --- 8. Banner nudge ----------------------------------------------------
await page.evaluate(() => {
  const s = JSON.parse(localStorage.getItem("sixmetre:v1"));
  s.settings.nudgeStyle = "banner";
  s.nextBreakAt = Date.now() - 1000;
  localStorage.setItem("sixmetre:v1", JSON.stringify(s));
});
await page.reload({ waitUntil: "networkidle" });
const bannerShown = await page.waitForSelector("text=Time to look away", { timeout: 6000 }).then(() => true).catch(() => false);
check("banner nudge fires", bannerShown);
if (bannerShown) {
  await page.screenshot({ path: `${SHOTS}/07-banner.png` });
  await page.getByRole("button", { name: "Take it" }).click();
  const opened = await page.waitForSelector("text=Look away", { timeout: 4000 }).then(() => true).catch(() => false);
  check("banner 'Take it' opens the break", opened);
  await page.getByRole("button", { name: "Skip this one" }).click();
  await page.getByRole("button", { name: "Back to work" }).click();
}

// --- 9. Learn reader ----------------------------------------------------
await page.getByRole("button", { name: "Learn", exact: true }).first().click();
await page.getByRole("button", { name: "Read the guide" }).click();
const readerOpen = await page.getByRole("dialog").isVisible();
check("Learn article opens", readerOpen);
await page.screenshot({ path: `${SHOTS}/08-reader.png` });
await page.keyboard.press("Escape");
const readerClosed = await page.getByRole("dialog").isVisible().catch(() => false);
check("Escape closes the reader", !readerClosed);

// --- 10. Mobile layout --------------------------------------------------
const mobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
const mp = await mobile.newPage();
await mp.goto(URL, { waitUntil: "networkidle" });
await mp.screenshot({ path: `${SHOTS}/09-mobile-today.png` });
const overflow = await mp.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
check("no horizontal overflow at 390px", overflow <= 1, `overflow ${overflow}px`);
const tabbar = await mp.locator("nav").last().isVisible();
check("mobile tab bar visible", tabbar);

check("no console errors", errors.length === 0, errors.slice(0, 3).join(" | "));

await browser.close();
console.log([...pass, ...fail].join("\n"));
console.log(`\n${pass.length} passed, ${fail.length} failed`);
process.exit(fail.length ? 1 : 0);
