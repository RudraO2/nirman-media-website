---
title: 'Rajasthan Stamp Duty & Registration Calculator (Tool #3) — Nirman Tools Hub'
type: 'feature'
created: '2026-07-13'
status: 'done'
review_loop_iteration: 0
followup_review_recommended: false
final_revision: 'PENDING_COMMIT'
baseline_revision: '74a44ff2ec0010d5716ce117d5178e20892dfbdc'
context: [
  '{project-root}/_bmad-output/planning-artifacts/briefs/brief-nirman-media-tools-hub-2026-07-10/addendum.md',
  '{project-root}/_bmad-output/planning-artifacts/architecture/architecture-nirman-tools-hub-2026-07-10/ARCHITECTURE-SPINE.md',
  '{project-root}/_bmad-output/implementation-artifacts/spec-area-converter.md',
]
warnings: ['oversized']
---

<intent-contract>

## Intent

**Problem:** The tools hub has two live tools (EMI, Area Unit Converter). Tool #3, the Rajasthan Stamp Duty & Registration Calculator, is registered as a `phase: 2` "coming soon" stub (`src/lib/tools/registry.ts:57-76`) with title/oneLiner/seo already written, but has no compute, data, or UI module — visitors cannot estimate duty + labour cess + registration cost, or see how the buyer-category rate (male/joint vs sole female vs SC/ST/BPL female) changes the total.

**Approach:** Build one self-contained tool module riding the existing chassis exactly like EMI/area-converter: a pure `compute()` fed by a versioned data module (`{value, asOf, source}` per AD-6) holding the three duty rates + cess rate + registration rate. A client `Tool.tsx` lets the user enter transaction value (+ optional DLC value, progressively disclosed) and pick a buyer category via the existing `Select` primitive, and see duty/cess/registration/all-in-% live. Flip the registry stub to `phase: 1` and wire the component map.

## Boundaries & Constraints

**Always:**
- Mirror the EMI/area-converter module shape: `src/lib/tools/stamp-duty/{compute.ts,schema.ts,data.ts}` (pure) + `src/components/tools/stamp-duty/Tool.tsx` (`'use client'`).
- Every rate comes from `src/lib/tools/stamp-duty/data.ts` as `{value, asOf, source}` (AD-6) — `compute.ts` contains zero hardcoded percentages.
- Rates (from addendum, 2025–26, "verify vs official IGRS Rajasthan notification"): duty 6% male/joint, 5% sole female, 4% female SC/ST/BPL; labour cess = 20% of the **duty amount** (not of value); registration flat 1%. Worked example (male, ₹50L, no DLC override): duty ₹3,00,000 + cess ₹60,000 + reg ₹50,000 = ₹4,10,000, all-in = 8.2% of base. Female sole on the same base: ₹3,50,000, all-in = 7.0%. `compute.ts` must reproduce both exactly — use as the hand-verification case.
- Base = higher of transaction value or DLC rate. No live DLC database/API exists and none is fabricated. Model as: required "Transaction value" input (Slider, ₹) + an optional, progressively-disclosed "DLC valuation (if you know it)" numeric input (rupees, not a per-sq-ft rate — keeps it comparable to transaction value without inventing a fake area/locality rate table). If DLC value is blank/0/≤ transaction value, base = transaction value (state this plainly). If DLC value > transaction value, base = DLC value and the UI must visibly say the higher DLC figure was used instead of the entered price. Disclaimer copy near the result must say the user should confirm the official DLC/circle rate for their exact plot before relying on the number — never imply this tool knows the real DLC rate.
- The rate table's `asOf` date + source must be visibly shown near the result (AD-6), same provenance-line pattern as area-converter's active-bigha line.
- Reuse `useToolState` (URL-owned state, live recompute, no submit button), `format.ts` (`inr`/`inrCompact`, do not ad-hoc `toLocaleString`), `Slider`, `InputField`, `Select`, `ResultCard`, `ToolShell` as-is (AD-5, AD-8). Buyer-category picker MUST reuse `src/components/tools/_surface/Select.tsx` (do not invent a new selector).
- Zod schema (`stamp-duty/schema.ts`) validates `transactionValue` (finite, ≥0, sane upper bound), `dlcValue` (finite, ≥0, sane upper bound, default 0), `buyerCategory` (enum of the three category ids), with explicit defaults (`transactionValue: 5_000_000` to match the addendum's own worked example).
- Static export only — no server code, no new npm dependency.
- Flip `src/lib/tools/registry.ts`'s existing `stamp-duty-rj` entry `phase: 2 → 1` only (title/oneLiner/seo already written, do not rewrite). Add `"stamp-duty-rj": StampDutyTool` to `src/components/tools/registry.tsx`'s `toolComponents` map. Confirmed by investigation: `src/app/tools/[slug]/page.tsx`, `src/app/tools/page.tsx`, `src/app/sitemap.ts` all derive `isLive`/card styling/sitemap membership purely from registry `phase` membership — zero edits needed to any of the three.
- If, while integrating as `Select.tsx`'s second consumer, a real defect is found (not a style preference), fix it in place (small, surgical) and record the change here in Design Notes — do not work around it in `Tool.tsx`.

**Block If:** the addendum's given rates/cess base prove internally inconsistent in a way not resolvable by the explicit worked example (male ₹50L → 8.2% all-in; female sole → 7.0% all-in) — halt and report rather than inventing a resolution.

**Never:** fabricate a DLC-rate-by-locality table or claim to know the real DLC value; put any numeric rate directly in `compute.ts`; compute cess on transaction value instead of the duty amount; add a charting/tax npm package; use a bare `<select>` instead of `Select.tsx`; imply the estimate is exact/legally binding.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Default load | no query params | `transactionValue=5000000, dlcValue=0, buyerCategory=male-joint` → duty ₹3,00,000, cess ₹60,000, reg ₹50,000, govt charges ₹4,10,000, all-in 8.20% | No error |
| Happy path (male/joint) | transactionValue=5000000, buyerCategory=male-joint | duty=300000 (exact), cess=60000 (exact, 20% of duty), reg=50000 (exact), all-in=8.2% (exact) | No error |
| Sole female | same value, buyerCategory=female-sole | duty=250000, cess=50000, reg=50000, total=350000, all-in=7.0% (exact) | No error |
| SC/ST/BPL female | same value, buyerCategory=female-sc-st-bpl | duty=200000, cess=40000, reg=50000, total=290000, all-in=5.8% | No error |
| DLC override | transactionValue=3000000, dlcValue=5000000 | base becomes 5,000,000 (DLC higher); UI states the DLC figure was used instead of the entered price; duty/cess/reg computed on 5,000,000 | No error |
| DLC below transaction value | transactionValue=5000000, dlcValue=1000000 | DLC ignored (lower than transaction value); base = transaction value; UI does not claim DLC was used | No error |
| Zero/negative/cleared value | transactionValue=0 or cleared | duty/cess/reg/base all = 0, no NaN/Infinity, no divide-by-zero | Clamped to 0 via `InputField`/`Slider` min |
| Unrecognized buyerCategory | reachable only via a malformed URL param surviving `useToolState`'s known patch-path validation gap | falls back to the male/joint rate rather than throwing/NaN | Defensive `??` fallback, same pattern as area-converter's `sqFtPerUnit` |

</intent-contract>

## Code Map

- `src/lib/tools/stamp-duty/data.ts` -- NEW. `{value, asOf, source}` for the three duty rates, cess rate, registration rate (AD-6).
- `src/lib/tools/stamp-duty/compute.ts` -- NEW. Pure `compute(input): StampDutyResult`; resolves base (max of transaction/DLC), duty, cess (20% of duty), registration, govt charges total, all-in %, total outlay.
- `src/lib/tools/stamp-duty/schema.ts` -- NEW. Zod schema + defaults (`transactionValue:5_000_000, dlcValue:0, buyerCategory:"male-joint"`), mirrors `emi/schema.ts`/`area/schema.ts` shape + UI bounds.
- `src/components/tools/stamp-duty/Tool.tsx` -- NEW. `'use client'`; `useToolState(stampDutySchema, stampDutyDefaults)` + `useMemo(compute)`; `Slider` for transaction value; collapsible "Know the DLC/circle rate?" section (`InputField`) for optional DLC value, mirroring EMI's collapsible prepayment section; `Select` for buyer category; `ResultCard` with govt-charges hero, duty/cess/reg breakdown, all-in %, DLC-base note when triggered, provenance line (asOf/source), disclaimer copy, Share/PDF actions (reuse EMI/area-converter's `ResultActions` pattern).
- `src/lib/tools/registry.ts` -- EDIT. `stamp-duty-rj` entry: `phase: 2` → `phase: 1`. No other field changes.
- `src/components/tools/registry.tsx` -- EDIT. Add `import { StampDutyTool } from "./stamp-duty/Tool"` and `"stamp-duty-rj": StampDutyTool` to `toolComponents`.
- `src/components/tools/_surface/Select.tsx` -- REFERENCE, second consumer. Edit only if a real defect surfaces during integration (see Boundaries).
- `src/components/tools/emi/Tool.tsx`, `src/components/tools/area/Tool.tsx` -- REFERENCE ONLY. Pattern source for `useToolState`/`ResultCard`/collapsible-secondary-input/live-recompute composition; do not edit.

## Tasks & Acceptance

**Execution:**
- [x] `src/lib/tools/stamp-duty/data.ts` -- author duty/cess/registration rate table, each `{value, asOf:'2026-07-13', source}` citing the addendum's refs (homefirstindia.com, 1acre.in, godrejcapital.com) -- AD-6 compliance, single source of truth
- [x] `src/lib/tools/stamp-duty/schema.ts` -- zod schema + typed defaults + buyer-category enum + UI bounds -- mirrors existing tool schema convention
- [x] `src/lib/tools/stamp-duty/compute.ts` -- pure `compute()`: base resolution, duty, cess-on-duty, registration, totals, all-in % -- AD-4 compliance, unit-testable
- [x] `src/components/tools/stamp-duty/Tool.tsx` -- client UI per Boundaries -- number-first, no submit button, URL-shareable
- [x] `src/lib/tools/registry.ts` -- flip `stamp-duty-rj.phase` to `1`
- [x] `src/components/tools/registry.tsx` -- wire `"stamp-duty-rj": StampDutyTool`
- [x] Unit-verify the I/O matrix's happy-path numbers (male 8.2%, female-sole 7.0%, female-SC/ST/BPL 5.8%, DLC-override behavior) by hand or a throwaway Node script before considering `compute.ts` done

**Acceptance Criteria:**
- Given the default state (no query params), when `/tools/stamp-duty-rj/` loads, then it shows duty ₹3,00,000 + cess ₹60,000 + reg ₹50,000 for a ₹50L male/joint purchase, all-in 8.20%, with the rate table's `asOf`/source visibly labeled.
- Given buyer category is changed to sole female or SC/ST/BPL female, when the result recomputes, then duty/cess/all-in % update to the 7.0%/5.8% figures with no page reload (URL query params update via `useToolState`).
- Given a DLC value greater than the transaction value is entered, when the result recomputes, then the base used is the DLC value and the UI explicitly states this override; given a DLC value ≤ transaction value, then it is ignored and the UI does not claim it was used.
- Given `npm run build` runs, when it completes, then `out/tools/stamp-duty-rj/index.html` exists, `out/sitemap.xml` contains `tools/stamp-duty-rj/`, and the `/tools` hub shows the calculator as a live card (not "Coming soon").
- Given a transaction value of 0 or a cleared input, when the result renders, then every figure shows 0 with no NaN/Infinity/crash.

## Spec Change Log

_Empty — no bad_spec loopback yet._

## Review Triage Log

### 2026-07-13 — Review pass

- intent_gap: 0
- bad_spec: 0
- patch: 5 (high 0, medium 3, low 2)
- defer: 1 (medium 1)
- reject: 7 (low 7)
- addressed_findings:
  - `[medium]` `[patch]` The provenance line rendered `cessRate.asOf`/`registrationRate.source` instead of the selected buyer category's own `dutyRate.asOf`/`.source` — invisible today only because all three `DataPoint`s share an identical date/source, but would misrepresent the displayed figure the instant a future rate update touched only `buyerCategoryRates[*].dutyRate`. Added `dutyRateAsOf`/`dutyRateSource` to `StampDutyResult` (`compute.ts`) sourced from `category.dutyRate`, and switched `Tool.tsx`'s provenance line to read them instead of importing `cessRate`/`registrationRate` directly.
  - `[medium]` `[patch]` The DLC/circle-rate `<details>` section rendered collapsed by default even when a shared/bookmarked URL carried a non-zero `dlcValue` — the one control that explains/edits an active override started hidden on a state the user didn't reach by clicking. Added `dlcOpen` state seeded from `state.dlcValue > 0` on mount, wired to the `<details>`'s `open`/`onToggle`, so a shared link auto-opens the section while manual user toggling afterward is never fought by re-renders.
  - `[medium]` `[patch]` Schema `.max(500_000_000)` on `transactionValue`/`dlcValue` didn't match `stampDutyBounds.max` (100,000,000) used by the `Slider`'s `max` prop — a URL param landing between the two bounds would pass validation but desync the range input's `--pct` fill from its actual value (same defect class the area-converter review caught for its value field). Introduced a single `AMOUNT_MAX = 100_000_000` constant in `schema.ts` and pointed both the zod schema and `stampDutyBounds` at it, so the two can never drift apart again.
  - `[low]` `[patch]` The DLC-override banner interpolated raw `state.dlcValue`/`state.transactionValue` directly instead of the `safeAmount()`-sanitized figures the rest of the page reads from `result` — reachable via the already-documented malformed-URL-param validation gap (e.g. a hand-crafted negative `transactionValue`), which could surface a negative rupee figure in the banner. Wrapped both interpolations in `Math.max(0, …)`.
  - `[low]` `[patch]` `result.buyerCategoryLabel.toLowerCase()` mangled "SC/ST" into "sc/st" in the result subtitle for the SC/ST/BPL category — the only one of the three category labels containing an acronym. Removed the `.toLowerCase()` call; the labels already read naturally in sentence case.
  - Deferred (not this story's problem, logged to `deferred-work.md`): `ResultActions`/`Stat` are now duplicated a third time across `emi/Tool.tsx`, `area/Tool.tsx`, and `stamp-duty/Tool.tsx` — a real DRY gap, but extracting them to `_surface` would require editing the sibling `Tool.tsx` files this spec explicitly scopes as "REFERENCE ONLY — do not edit," so it's out of this story's boundary.
  - Rejected as noise: the unused `related` registry field (pre-existing pattern already present, unchanged, for `emi`/`area-converter`, not introduced by this diff); no ceiling modeled for the female-buyer concession rate, joint-ownership-with-a-female-co-owner pro-ration, SC/ST/BPL proof-of-eligibility disclosure, and a registration-fee cap (all real-world IGRS nuances the addendum's own three aggregator sources don't supply figures for — the tool's existing "estimate only, confirm with your Sub-Registrar / IGRS portal" disclaimer is the addendum's own intended mitigation, and none of these trip the spec's Block-If clause since the given rates aren't internally inconsistent); the absence of a unit test pinning the worked example (`compute.ts`'s own testing strategy is already explicitly listed under the architecture spine's own "Deferred" section as a build-phase decision, not a per-story invariant, and EMI/area-converter share the same gap without having been flagged); a copy nitpick that the DLC comparison's strict inequality (`dlcValue > transactionValue`) isn't spelled out for the exactly-equal case (already adequately covered by the existing "— add it if higher" and "we'll use your transaction value" copy).

## Design Notes

- **DLC value modeled as a rupee amount, not a per-sq-ft rate:** the addendum names DLC as a govt-notified per-area minimum, but supplies no rate table (unlike bigha, which the addendum did tabulate) and computing a real DLC valuation would need a locality-level rate × property area this tool has no data for. Asking the user for a total DLC valuation figure (if they already know it, e.g. from their Sub-Registrar/IGRS lookup) keeps the "higher of the two" rule honest without inventing data. This mirrors how public stamp-duty calculators (1acre.in referenced by the addendum) commonly handle it.
- **Cess is 20% of the duty amount, not of the transaction value** — the single easiest mistake to make in this domain; `compute.ts` must derive cess from the computed `duty` value, never from `base` directly, and the I/O matrix's exact figures (₹60,000 / ₹50,000 / ₹40,000 cess at the three rates) are the check.
- **DLC input is progressively disclosed** (collapsed by default, like EMI's prepayment section) rather than always visible, since most users won't know their area's DLC rate — keeps the primary flow (enter price, pick category, see cost) uncluttered.

## Verification

**Commands:**
- `npm run build` -- expected: succeeds under `output: "export"`, no TypeScript errors.
- grep `out/tools/stamp-duty-rj/index.html` for the H1 text and `FAQPage` JSON-LD -- expected: present.
- grep `out/sitemap.xml` for `tools/stamp-duty-rj/` -- expected: present now that `phase: 1`.

**Manual checks (if no CLI):**
- Load `/tools/stamp-duty-rj/` default state and confirm duty ₹3,00,000 / cess ₹60,000 / reg ₹50,000 / all-in 8.20% for the ₹50L male/joint default.
- Switch buyer category and confirm 7.0% (female sole) and 5.8% (female SC/ST/BPL) all-in figures.
- Confirm `/tools` hub page shows three live cards (EMI + Area Unit Converter + Stamp Duty) after the phase flip, with no `sitemap.ts`/`page.tsx` edits made.

## Dev Agent Record

**Status:** Resumed after an interrupted prior run (API session-limit, not a code defect) that had already written all module files and wired the registry. This pass: verified every file on disk against the spec's Code Map/Tasks/AC, ran the hand-verification script left behind by the interrupted run (all 26 assertions PASS), ran a full `npm run build` (green, TypeScript clean), then ran the adversarial review pair and patched their findings.

**Files verified as already correctly implemented (no changes needed):**
- `src/lib/tools/stamp-duty/data.ts` — `{value, asOf, source}` rate table for duty (6/5/4%), cess (20% of duty), registration (1%), AD-6 compliant.
- `src/components/tools/stamp-duty/Tool.tsx` — structure, `useToolState`/`ResultCard`/`Select`/`Slider` composition, disclaimer copy, provenance framing (values later corrected — see below).
- `src/lib/tools/registry.ts` — `stamp-duty-rj.phase: 2 → 1`, no other field touched.
- `src/components/tools/registry.tsx` — `"stamp-duty-rj": StampDutyTool` wired.

**Files patched this pass (review findings):**
- `src/lib/tools/stamp-duty/compute.ts` — added `dutyRateAsOf`/`dutyRateSource` to `StampDutyResult`, sourced from the selected buyer category's own `dutyRate` DataPoint.
- `src/lib/tools/stamp-duty/schema.ts` — introduced shared `AMOUNT_MAX = 100_000_000` constant; both the zod schema's `.max()` and `stampDutyBounds.max` now derive from it (previously 500M vs 100M mismatch).
- `src/components/tools/stamp-duty/Tool.tsx` — provenance line now reads `result.dutyRateAsOf`/`result.dutyRateSource` (no longer imports `cessRate`/`registrationRate` directly); DLC `<details>` auto-opens via new `dlcOpen` state seeded from `state.dlcValue > 0`; DLC-override banner wraps `state.dlcValue`/`state.transactionValue` in `Math.max(0, …)`; removed `.toLowerCase()` from the result subtitle's category label.

**Math verification:** ran `verify-stamp-duty.mjs` (scratchpad, not committed) — a standalone re-implementation of `compute.ts`'s exact logic against literal copies of `data.ts`'s constants. All 26 assertions PASS: male/joint 50L → duty 300000/cess 60000/reg 50000/govtCharges 410000/allIn 8.2%; female-sole → 250000/50000/50000/350000/7.0%; female-SC-ST-BPL → 200000/40000/50000/290000/5.8%; DLC override (30L tx, 50L DLC) → base 5000000, override active, totalOutlay 3410000; DLC below transaction value → ignored, base = transaction value; zero/negative/NaN input → all zero, no NaN/Infinity; unrecognized buyerCategory → falls back to male-joint rate. Re-ran after patching (patches only added new result fields / didn't touch the math) — still 26/26 PASS.

**Build verification:** `npm run build` (Next 16.2.6, Turbopack, `output: "export"`) run twice (pre- and post-patch), both green — TypeScript clean, SSG generated `/tools/emi`, `/tools/area-converter`, `/tools/stamp-duty-rj`, `/tools/vastu-score`. Post-build checks: `out/tools/stamp-duty-rj/index.html` exists; H1 "Rajasthan Stamp Duty & Registration Calculator" present; `FAQPage` JSON-LD present; `out/sitemap.xml` contains `tools/stamp-duty-rj/`; `out/tools/index.html` shows the Stamp Duty card as a live link (not the "Coming soon" text, which now only appears for the still-phase-2 `vastu-score`).

**Deviations / judgment calls:**
- No task or acceptance criterion was left incomplete; no `<intent-contract>` edit was needed or made.
- The interrupted prior run had already left a hand-verification script (`verify-stamp-duty.mjs`) in the scratchpad matching this session's exact scratchpad path — reused and re-ran it rather than rewriting an equivalent script.
- `related: ["emi", "area-converter"]` on the registry entry was left as originally written (matches Code Map's "no other field changes" instruction); the review's finding that `related` has no UI consumer anywhere in the codebase was rejected as a pre-existing, non-blocking pattern shared by every tool entry, not something introduced by this diff.
- Deferred one real cross-tool DRY finding (`ResultActions`/`Stat` triplication) to `deferred-work.md` rather than fixing in-story, because a proper fix requires editing `emi/Tool.tsx`/`area/Tool.tsx`, which this spec explicitly scopes as reference-only/do-not-edit.

## Auto Run Result

**Summary:** Resumed and completed tool #3 in the Nirman Tools Hub — the Rajasthan Stamp Duty & Registration Calculator (`/tools/stamp-duty-rj/`). Estimates stamp duty (6%/5%/4% by buyer category), labour cess (20% of duty), and flat 1% registration, computed on the higher of transaction value or an optional DLC valuation, all sourced from versioned `{value, asOf, source}` data (AD-6). Live recompute, URL-owned state, provenance always shown. Flipped the existing registry stub from `phase: 2` to `phase: 1` — routing, sitemap, and the `/tools` hub card promoted automatically with zero edits to `sitemap.ts` or `app/tools/page.tsx`.

**Files changed:**
- `src/lib/tools/stamp-duty/data.ts` (new, from interrupted run) — versioned duty/cess/registration rate table, the tool's sole source of numeric truth.
- `src/lib/tools/stamp-duty/schema.ts` (new, from interrupted run; patched this pass) — zod schema + defaults (₹50L, male/joint, no DLC), UI bounds now sharing one `AMOUNT_MAX` constant with the schema.
- `src/lib/tools/stamp-duty/compute.ts` (new, from interrupted run; patched this pass) — pure duty/cess/registration math, zero hardcoded numbers, now also returns the active duty rate's own provenance fields.
- `src/components/tools/stamp-duty/Tool.tsx` (new, from interrupted run; patched this pass) — client UI: transaction-value slider, buyer-category select, progressively-disclosed DLC input (now auto-opens for a URL-carried DLC value), result card with duty/cess/reg breakdown, DLC-override banner (now sanitized), accurate provenance line, disclaimer, Share/PDF actions.
- `src/lib/tools/registry.ts` (edit, from interrupted run) — `stamp-duty-rj.phase`: `2` → `1`; no copy changed.
- `src/components/tools/registry.tsx` (edit, from interrupted run) — wired `"stamp-duty-rj": StampDutyTool`.
- `_bmad-output/implementation-artifacts/deferred-work.md` (edit) — 1 new deferred finding appended (`ResultActions`/`Stat` triplication).

**Review findings breakdown:** 14 raw findings from 2 parallel adversarial reviewers (Blind Hunter + Edge Case Hunter), deduplicated to 13 (1 finding raised by both) and triaged — 0 intent_gap, 0 bad_spec, 5 patch (all auto-fixed this pass: accurate per-category rate provenance, DLC-section auto-open on shared links, aligned schema/UI amount bounds, sanitized DLC-banner display values, un-mangled SC/ST label casing), 1 defer (`ResultActions`/`Stat` triplication, logged to `deferred-work.md`, blocked from in-story fix by the spec's own "do not edit sibling Tool.tsx" boundary), 7 reject (noise/out-of-scope — see Review Triage Log for the full list).

**Verification performed:** `npm run build` run twice (pre- and post-patch), both green — Next 16.2.6/Turbopack, TypeScript clean, `output: "export"`. Post-build: `out/tools/stamp-duty-rj/index.html` present with H1/FAQPage JSON-LD; `out/sitemap.xml` contains `tools/stamp-duty-rj/`; `out/tools/index.html` shows a live card for Stamp Duty (not "Coming soon"). Math independently verified via a standalone 26-assertion Node script, both before and after the patch pass: male/joint 8.2% all-in, female-sole 7.0%, female-SC/ST/BPL 5.8%, DLC-override and DLC-ignored behavior, zero/negative/NaN guards, unrecognized-category fallback — all exact matches to the spec's I/O matrix. `<intent-contract>` was never modified.

**Residual risks:** `followup_review_recommended: false` — every patch this pass was scoped entirely to stamp-duty's own module files (`compute.ts`, `schema.ts`, `Tool.tsx`); none touched a shared chassis primitive (`Select`/`Slider`/`InputField`/`ResultCard`/`useToolState`/`format.ts`) that other tools depend on, unlike the area-converter pass which introduced a new shared formatter and a new shared primitive. One item added to `deferred-work.md` for a future dedicated pass: `ResultActions`/`Stat` duplication across all three live tools (worth extracting before vastu-score becomes a fourth copy).
