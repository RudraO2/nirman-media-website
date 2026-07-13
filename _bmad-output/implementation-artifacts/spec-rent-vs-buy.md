---
title: 'Rent vs. Buy Calculator (Tool #4) — Nirman Tools Hub'
type: 'feature'
created: '2026-07-13'
status: 'in-review'
review_loop_iteration: 0
followup_review_recommended: true
baseline_revision: '851810249d5c52198e8a84881014af54a078ef96'
context: [
  '{project-root}/_bmad-output/planning-artifacts/briefs/brief-nirman-media-tools-hub-2026-07-10/brief.md',
  '{project-root}/_bmad-output/planning-artifacts/architecture/architecture-nirman-tools-hub-2026-07-10/ARCHITECTURE-SPINE.md',
  '{project-root}/_bmad-output/implementation-artifacts/spec-stamp-duty-rj.md',
  '{project-root}/_bmad-output/implementation-artifacts/1-1-chassis-emi-calculator.md',
]
warnings: ['oversized']
---

<intent-contract>

## Intent

**Problem:** The tools hub has three live tools (EMI, Area Unit Converter, Stamp Duty). "Rent vs. Buy" is named only in the brief's Scope §5 ("Fill over time") with no registry stub and no detail — visitors have no way to compare the true long-run cost of buying vs. renting for their own numbers.

**Approach:** Originate the registry entry from scratch and build one self-contained tool module riding the existing chassis exactly like EMI/area/stamp-duty: a pure `compute()` that reuses `emi/compute.ts`'s `compute()` (not a reimplemented EMI formula) for the loan/amortization piece, folds in property tax, maintenance, appreciation, rent escalation, investment-return-on-savings, and selling cost, and produces a year-by-year owner-vs-renter net-cost comparison, a breakeven year, and a plain-language verdict. Ship directly as `phase: 1`.

## Boundaries & Constraints

**Always:**
- Mirror module shape: `src/lib/tools/rent-vs-buy/{compute.ts,schema.ts}` (pure) + `src/components/tools/rent-vs-buy/Tool.tsx` (`'use client'`). No `data.ts` — unlike area/stamp-duty, this tool has no region-variable statutory rate table (AD-6 territory); every rate here (appreciation, rent escalation, investment return, tax, maintenance) is a user-supplied *assumption*, not a sourced fact, so it belongs in `schema.ts` defaults, never a versioned data module.
- Reuse `emi/compute.ts`'s exported `compute(input: EmiInput): EmiResult` directly for the loan piece — call it once with `{ principal: loanAmount, annualRate, tenureMonths: tenureYears*12 }` and consume `result.emi` and `result.schedule[i].closingBalance` for monthly remaining balance. Do not call `emiForRate` separately and do not re-derive an amortization loop — `compute()` already gives both the EMI and the full schedule in one call. Zero edits to `emi/compute.ts` (confirmed cleanly reusable as-is).
- **Exact algorithm** (implement precisely; do not deviate without a Spec Change Log entry):
  ```
  downPayment = homePrice * downPaymentPct/100
  loanAmount  = homePrice - downPayment
  { emi, schedule } = computeEmi({ principal: loanAmount, annualRate, tenureMonths: tenureYears*12 })
  paidOffMonth = schedule.length

  pool = downPayment; contributed = downPayment  // renter's invested capital, principal-only tracker
  totalOwnerCash = 0; totalRentCash = 0
  for m in 1..horizonYears*12:
    homeValue   = homePrice * (1+appreciationPct/100)^(m/12)
    taxM        = homeValue * propertyTaxPct/100/12
    maintM      = homeValue * maintenancePct/100/12
    loanPay     = (m <= paidOffMonth) ? emi : 0
    ownerCash   = loanPay + taxM + maintM
    remainingBal= (m < paidOffMonth) ? schedule[m-1].closingBalance : 0
    rent        = monthlyRent * (1+rentEscalationPct/100)^floor((m-1)/12)   // escalates once/year
    contribution= max(0, ownerCash - rent)   // renter invests the month owning would've cost more
    pool        = pool*(1+investmentReturnPct/12/100) + contribution
    contributed = contributed + contribution
    totalOwnerCash += ownerCash; totalRentCash += rent
    // snapshot at each 12-month boundary (m % 12 === 0) for the yearly[] output:
    sellingCost      = homeValue * sellingCostPct/100
    netSaleProceeds  = homeValue - sellingCost - remainingBal
    netOwnerCost     = downPayment + totalOwnerCash - netSaleProceeds
    investmentGrowth = pool - contributed
    netRenterCost    = totalRentCash - investmentGrowth
  breakevenYear = first year Y (1..horizonYears) where netOwnerCost[Y] <= netRenterCost[Y]; null if none found
  ```
  `netOwnerCost`/`netRenterCost` = "cash spent minus wealth retained" — symmetric, comparable, lower is better. Do not use a formula that credits the owner's `netSaleProceeds` without also debiting `downPayment` from the owner side (an earlier draft of this spec had exactly that bug — it silently credited the down payment twice; verified and fixed before this version, see the zero-growth I/O row below for the exact regression check).
- Down payment is a single `%`-of-home-price input (`downPaymentPct`), not a dual ₹/% pair — one canonical field per the existing schema convention (mirrors every other tool's one-field-per-concept pattern); the UI displays the computed ₹ figure live next to the slider so both forms are visible without a second editable field.
- `maintenancePct` is a genuine adjustable input with default `1` (India convention) — never a hardcoded constant in `compute.ts`.
- For **every** numeric field, the zod schema's `.min()/.max()` and the `Slider`'s `min/max` UI bounds must derive from the **same** constant/object — no field may define its schema bound and UI bound as separately-typed numbers that can drift (the exact defect class caught in stamp-duty-rj's review: `AMOUNT_MAX` mismatch desynced the range fill). Simplest compliant approach: one `rentVsBuyBounds` object in `schema.ts`, and the zod schema reads `.min(bounds.x.min).max(bounds.x.max)` for each field.
- Reuse `useToolState`, `format.ts` (`inr`/`inrCompact`/`num`), `Slider`, `InputField`, `ResultCard`, `ToolShell` as-is (AD-5, AD-8). `Select.tsx` is not needed — every input here is numeric, there is no enum-style field.
- Progressive disclosure: keep `homePrice`, `downPaymentPct`, `annualRate`, `tenureYears`, `monthlyRent`, `horizonYears` always visible; collapse `propertyTaxPct`, `maintenancePct`, `appreciationPct`, `rentEscalationPct`, `investmentReturnPct`, `sellingCostPct` behind a `<details>` "Assumptions" section (mirrors EMI's collapsible prepayment section / stamp-duty's collapsible DLC section) — these are exactly the assumption-heavy fields the honesty disclaimer below refers to.
- **Honesty/disclaimer requirement:** near the result, in the same position/tone/class as EMI's floating-rate disclaimer (`font-body text-cream/45 mt-5 text-xs leading-relaxed`, last content block before `ResultActions`), state plainly that appreciation, rent growth, and investment return are estimates the user is choosing, not facts, and that the breakeven year and verdict will move if those assumptions change. Do not present the breakeven year with false precision (no "exactly year X" phrasing).
- Registry entry (`src/lib/tools/registry.ts`, new row, `phase: 1` immediately — not staged as a phase-2 stub first):
  - `slug: "rent-vs-buy"`, `category: "finance"`
  - `title: "Rent vs. Buy Calculator"`
  - `oneLiner: "See whether renting or buying wins for your numbers — with a clear breakeven year, not just a wall of totals."`
  - `seo.h1: "Rent vs. Buy Calculator"`
  - `seo.description: "Compare the true long-term cost of renting versus buying a home in India — EMI, property tax, maintenance and resale equity against rent and the return you'd earn investing what you save. Get a plain breakeven year, not just numbers."`
  - `seo.faq`: at least these two —
    1. "Is buying always better than renting long-term?" → No, it depends entirely on the inputs; name the specific levers (appreciation, rent growth, investment return) and that this tool runs the user's own numbers rather than assuming an answer.
    2. "Why can renting-and-investing beat buying in the math, even over many years?" → Explain that Indian residential rental yields are typically low (annual rent often only ~2–3.5% of a property's value), so money not spent on a down payment/EMI can compound faster than the home appreciates, in some scenarios — invite the user to adjust the assumptions to their own city/property.
  - `related: ["emi"]`
- Static export only, no server code, no new npm dependency (no charting/finance library — hand-drawn SVG if a chart is added, matching EMI's `Donut` precedent).

**Block If:**
- `emi/compute.ts`'s `compute()`/`schedule` turns out not to be cleanly callable for this purpose without modification (contradicts this spec's investigation — halt and report rather than duplicating the EMI formula).
- `npm run build` fails for a reason clearly unrelated to this tool's new files (pre-existing repo issue) — halt and report rather than fixing unrelated code.

**Never:** reimplement the EMI/amortization formula in a second file; add a `data.ts` lookup table for appreciation/rent-growth/investment-return (they are user assumptions, not sourced facts); add any new npm dependency; edit `emi/Tool.tsx`, `area/Tool.tsx`, or `stamp-duty/Tool.tsx` (reference only — duplicate the local `ResultActions`/`Stat` pattern again, per the existing, already-logged `deferred-work.md` triplication, rather than refactor them); present the breakeven year or verdict as a guaranteed/precise date; let any field's schema bound and UI bound diverge.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Default load | no query params: homePrice=5,000,000, downPaymentPct=20, annualRate=8.5, tenureYears=20, propertyTaxPct=0.5, maintenancePct=1, appreciationPct=5, monthlyRent=12,500, rentEscalationPct=5, investmentReturnPct=7, horizonYears=15, sellingCostPct=2 | EMI ≈ ₹34,712.93 (must equal a direct call to `emi/compute.ts`'s own `compute()` with the same loan inputs — bit-for-bit, proving reuse not reimplementation). Year-by-year netOwnerCost/netRenterCost (₹, tolerance ±100 for rounding): y1 ≈ 268,962 / 66,492; y5 ≈ 779,646 / 83,595; y10 ≈ 952,421 / −595,784; y15 ≈ 415,425 / −2,336,900. No crossing within 15 years (owner cost never drops to/below renter cost) → `breakevenYear: null`, verdict = "Renting is cheaper for your full 15-year horizon." | No error |
| Zero-growth edge case (exact hand-verified check) | homePrice=1,000,000, downPaymentPct=20, annualRate=0, tenureYears=10, propertyTaxPct=0, maintenancePct=0, appreciationPct=0, monthlyRent=6,000, rentEscalationPct=0, investmentReturnPct=0, horizonYears=1, sellingCostPct=0 | `emi` = 6,666.67 exactly (800,000/120). At year 1: `netOwnerCost` = 0.00 (exact — down payment converts 1:1 to equity with zero interest/appreciation), `netRenterCost` = 72,000.00 exactly (12×6,000 rent, zero investment growth since 0% return). `breakevenYear: 1`, verdict = "Buying wins from year 1." | No error |
| 100% down payment (no loan) | downPaymentPct=100, other fields at defaults | `loanAmount=0`, `emi=0` (via `emiForRate(0,…)`, no divide-by-zero/NaN — confirmed by reading `emi/compute.ts`'s existing guard), owner's monthly cash = property tax + maintenance only | No error, no NaN |
| Horizon exceeds tenure | tenureYears=5, horizonYears=15 | After month 60 (`paidOffMonth`), `loanPay=0` and `remainingBal=0` for the rest of the horizon — owner's monthly cash drops to tax+maintenance only, visibly reducing the owner cost growth rate for the remaining 10 years | No error |
| High investment return favors renting | investmentReturnPct=20 (other fields at defaults) | `netRenterCost` trends substantially lower (more negative) year over year vs. the default-load case at the same investmentReturnPct=7, at every matching year — the model must respond directionally to this single lever, demonstrating the "assumption-driven" honesty point | No error |
| Cleared/zero core inputs | homePrice=0, monthlyRent=0 | every output (`emi`, `netOwnerCost`, `netRenterCost`, `homeValue`, etc.) = 0 for every year, no NaN/Infinity/crash | Clamped to 0 via `InputField`/`Slider` min |
| Unrecognized/out-of-range URL param | reachable only via `useToolState`'s known patch-path validation gap (e.g. a hand-crafted negative `downPaymentPct`) | falls back to a sane clamp (e.g. `Math.max(0, Math.min(100, value))` at the point of use in `compute.ts`) rather than propagating a negative/absurd value into the math | Defensive clamp, same spirit as stamp-duty's `safeAmount()` guard |

</intent-contract>

## Code Map

- `src/lib/tools/rent-vs-buy/schema.ts` -- NEW. Zod schema + typed defaults (values from the Default-load I/O row) + one shared `rentVsBuyBounds` object feeding both zod `.min()/.max()` and the UI sliders (no divergence).
- `src/lib/tools/rent-vs-buy/compute.ts` -- NEW. Pure `compute(input): RentVsBuyResult` implementing the exact algorithm above; imports `compute as computeEmi` from `@/lib/tools/emi/compute` (or relative path) for the loan piece — no reimplemented EMI math. Returns `{ emi, loanAmount, downPayment, netOwnerCost, netRenterCost, totalOwnerCashOutflow, totalRenterCashOutflow, homeEquityAtHorizon, investmentValueAtHorizon, breakevenYear, verdict, yearly: {year, netOwnerCost, netRenterCost, homeValue}[] }`.
- `src/components/tools/rent-vs-buy/Tool.tsx` -- NEW. `'use client'`; `useToolState(rentVsBuySchema, rentVsBuyDefaults)` + `useMemo(compute)`; always-visible `Slider`s for homePrice/downPaymentPct/annualRate/tenureYears/monthlyRent/horizonYears; a collapsible "Assumptions" `<details>` (mirrors EMI's prepayment / stamp-duty's DLC pattern) holding `Slider`s for propertyTaxPct/maintenancePct/appreciationPct/rentEscalationPct/investmentReturnPct/sellingCostPct; `ResultCard` with the verdict sentence as the hero line, owner-vs-renter net-cost comparison (a simple visualization — e.g. a hand-drawn SVG two-line comparison over `yearly[]`, matching EMI's no-library `Donut` precedent — required in spirit per the brief's "interpret, don't dump"/visualize principle, exact chart form left to implementation), local `ResultActions`/`Stat` duplicated per existing pattern, the assumptions disclaimer, provenance-free (no `asOf`/source line needed — nothing here is a sourced statutory rate).
- `src/lib/tools/registry.ts` -- EDIT. Add the new `rent-vs-buy` entry (see Boundaries) at `phase: 1`. No other entry touched.
- `src/components/tools/registry.tsx` -- EDIT. Add `import { RentVsBuyTool } from "./rent-vs-buy/Tool"` and `"rent-vs-buy": RentVsBuyTool` to `toolComponents`.
- `src/lib/tools/emi/compute.ts` -- REFERENCE ONLY. `compute()`/`emiForRate` consumed as-is; confirmed no edit needed.
- `src/components/tools/emi/Tool.tsx`, `src/components/tools/stamp-duty/Tool.tsx` -- REFERENCE ONLY. Pattern source for disclaimer placement/class, collapsible-secondary-inputs, `ResultActions`/`Stat` duplication, `useToolState`/`ResultCard` composition; do not edit.
- `src/components/tools/_surface/{Slider,InputField,ResultCard}.tsx`, `src/components/tools/_shell/ToolShell.tsx` -- REFERENCE, consumed as-is (Chassis v2 look comes for free).

## Tasks & Acceptance

**Execution:**
- [x] `src/lib/tools/rent-vs-buy/schema.ts` -- author zod schema + defaults + shared `rentVsBuyBounds` (12 fields per Boundaries) -- single source for both validation and UI range, prevents the stamp-duty-class bound-drift bug
- [x] `src/lib/tools/rent-vs-buy/compute.ts` -- pure `compute()` implementing the exact algorithm, importing `emi/compute.ts`'s `compute()` for the loan piece -- AD-4 compliance, EMI-math reuse, unit-testable
- [x] `src/components/tools/rent-vs-buy/Tool.tsx` -- client UI per Code Map -- number-first, no submit button, URL-shareable, progressive disclosure on assumption fields, visible honesty disclaimer
- [x] `src/lib/tools/registry.ts` -- add `rent-vs-buy` entry at `phase: 1` with the title/oneLiner/seo copy specified in Boundaries
- [x] `src/components/tools/registry.tsx` -- wire `"rent-vs-buy": RentVsBuyTool`
- [x] Unit-verify the I/O matrix by hand or a throwaway Node script before considering `compute.ts` done: (a) EMI reuse matches `emi/compute.ts`'s own `compute()` output bit-for-bit for the same loan inputs; (b) the zero-growth case matches exactly (`netOwnerCost=0.00`, `netRenterCost=72,000.00`, `breakevenYear=1`); (c) the default-load case matches the year 1/5/10/15 figures within ±₹100; (d) no NaN/Infinity across the cleared-input and 100%-down-payment edge cases

**Acceptance Criteria:**
- Given the default state (no query params), when `/tools/rent-vs-buy/` loads, then it shows the EMI, a verdict sentence ("Renting is cheaper for your full 15-year horizon" for the current defaults), and the year-by-year comparison, with no page reload needed to change any input.
- Given any input changes (e.g. `investmentReturnPct` lowered enough that owning wins within the horizon), when the result recomputes, then the verdict sentence and `breakevenYear` update live and the URL query params reflect the change via `useToolState`.
- Given `downPaymentPct` is set to 100, when the result recomputes, then EMI shows ₹0 and owner cost reflects tax+maintenance only, with no NaN/crash.
- Given `npm run build` runs, when it completes, then `out/tools/rent-vs-buy/index.html` exists, `out/sitemap.xml` contains `tools/rent-vs-buy/`, and the `/tools` hub shows the calculator as a live card (not "Coming soon").
- Given `homePrice` and `monthlyRent` are both cleared to 0, when the result renders, then every figure shows 0 with no NaN/Infinity/crash.

## Spec Change Log

_Empty — no bad_spec loopback yet._

## Review Triage Log

### 2026-07-13 — Review pass

- intent_gap: 0
- bad_spec: 0
- patch: 11 (high 0, medium 6, low 5)
- defer: 0
- reject: 4 (low 4)
- addressed_findings:
  - `[medium]` `[patch]` `clamp()` (`compute.ts`) didn't preserve the zod `.int()` constraint on `tenureYears`/`horizonYears` — a fractional value reaching `compute()` desynced `yearly[]`'s whole-year snapshots (pushed only at `m%12===0`) from `homeEquityAtHorizon`/`investmentValueAtHorizon` (built from state updated every month through a truncated final partial year), so the two halves of one `RentVsBuyResult` described different endpoints. Added `clampInt()` (rounds after clamping) and used it for both fields; re-verified with `horizonYears=1.9` — now rounds to `2`, `yearly.length===2`, and `netOwnerCost`/`netRenterCost` now equal the final `yearly[]` row exactly.
  - `[low]` `[patch]` `clamp()`'s JSDoc overclaimed that it guards against `useToolState`'s known initial-load validation gap; in reality a malformed URL param fails `schema.safeParse` for the whole object before `compute()` is ever called (already logged in `deferred-work.md`, pre-existing, not this story's root cause to fix). Rewrote the comment to describe `clamp()` accurately as narrow, module-local defense-in-depth rather than a fix for the hook's own behavior.
  - `[medium]` `[patch]` The disclaimer named only 3 of the 6 "Assumptions" fields (appreciation, rent growth, investment return) as estimates, silently omitting property tax, maintenance, and selling cost even though all six live in the same collapsible section and drive the same math. Rewrote the disclaimer to name all six generically ("every figure in Assumptions").
  - `[medium]` `[patch]` The tool never disclosed that it doesn't model Indian income-tax treatment (Section 24(b) interest deduction, 80C principal deduction, HRA exemption) — a material, commonly-cited real lever in an actual rent-vs-buy decision, omitted without a word while three lesser assumptions got an explicit callout. Added a sentence to the disclaimer naming this exclusion. (Full tax modeling itself is out of scope — not part of the spec's input list — this is a disclosure fix, not a math change.)
  - `[medium]` `[patch]` The verdict/breakeven framing ("Buying wins from year N") reads as a permanent, durable flip, but the spec's own default-load sample data is non-monotonic across years (owner net cost rises then falls). Softened the supporting sentence beneath the verdict to state it reflects "this trajectory... not a guaranteed permanent lead."
  - `[medium]` `[patch]` No year-by-year data table existed — the SVG chart was the only per-year view, unreadable by screen readers and impossible to hand-verify against. Added a collapsible `YearlyTable` (mirrors EMI's amortization-table pattern) rendering `result.yearly` directly; no new math, data already existed.
  - `[medium]` `[patch]` The collapsed "Assumptions" `<details>` (closed by default whenever inputs are at their defaults) is excluded from print output by every major browser's default UA stylesheet, so "Download PDF" on the default view would print the verdict while silently omitting the assumptions behind it — undermining the tool's own honesty message at export time. Added a scoped `<style>` print rule forcing the section's content visible in print regardless of its on-screen open/closed state.
  - `[low]` `[patch]` "Home equity at horizon" was labeled and displayed beside `netOwnerCost` (which is selling-cost-adjusted) without noting it is the gross, pre-selling-cost figure — the two numbers don't reconcile by hand without that qualifier. Relabeled to "Home equity at horizon (before selling cost)".
  - `[low]` `[patch]` The stat grid read as buy-side-weighted (4 owner tiles vs. 2 renter tiles with no grouping) for a tool whose premise is an even-handed comparison. Split the grid into explicitly labeled "Owning" / "Renting + investing the difference" sub-groups and added a "Total paid over horizon" owner tile so the asymmetry reads as each side's own natural facts rather than implicit weighting.
  - `[low]` `[patch]` The chart's breakeven-year marker and zero-baseline dashed lines had no label — only the two cost-series lines were named in the legend. Added a one-line caption beneath the chart explaining both dashed lines.
  - `[low]` `[patch]` (grouped with the `clampInt()` fix above) non-integer `horizonYears` silently truncated the simulation's final partial year from the `yearly[]` snapshot array while other result fields reflected the full period — resolved as a direct consequence of `clampInt()` guaranteeing `horizonYears`/`tenureYears` are always whole numbers post-clamp, so `totalMonths` is always an exact multiple of 12 and the last `m%12===0` boundary always lands on the true final month.
  - Rejected as noise/out of scope: no rental security-deposit opportunity cost modeled (not part of the spec's input list; standard rent-vs-buy calculators, e.g. NYT's, typically exclude a refundable deposit as immaterial); no disclosure that Indian lender LTV norms cap real-world financing below the 0–100% down-payment range the slider allows (the tool is an explicit "what if" calculator, consistent with the EMI tool's own lack of bank-policy disclaimers); `related: ["emi"]` not also linking `stamp-duty-rj` (a deliberate, already-documented Design Notes decision, not an oversight); verdict-sentence visual prominence vs. the smaller disclaimer text below it (this positioning/class was an explicit spec requirement mirroring EMI's own already-shipped floating-rate disclaimer treatment — consistent with established chassis convention, not a new problem).



## Design Notes

- **Net-cost formula, derived and independently verified before writing this spec:** `netCost = (cash spent) − (wealth retained)`, applied symmetrically to both sides. Owner: cash spent = `downPayment + Σ(EMI+tax+maintenance)`; wealth retained = `netSaleProceeds` (appreciated home value − selling cost − remaining loan balance). Renter: cash spent = `Σrent`; wealth retained = `investmentGrowth` only (`pool(N) − contributed(N)`, i.e. the *growth* on the down payment + monthly savings, not the principal itself — the principal was never "spent," so crediting it again would double-count, which an earlier draft of this exact formula did in error; the zero-growth I/O row is the regression check that catches this class of bug: with 0% appreciation/interest/return, `netOwnerCost` must land exactly at 0.00, not at `−downPayment`).
- **Two compounding conventions, intentional:** home value compounds `appreciationPct` monthly (`homeValue(m) = homePrice × (1+appreciationPct/100)^(m/12)`) since appreciation is a continuous market process; rent escalates once per year (`floor((m-1)/12)` exponent) since Indian leases typically step up annually at renewal, not monthly. Both degenerate to a constant when their rate is 0, which the zero-growth I/O row exercises.
- **Realistic defaults deliberately show "renting wins the full horizon," and that is not a bug to tune away.** At a representative ~3% gross rental yield (₹12,500/mo on a ₹50L home — realistic for urban India, where rental yields are unusually low vs. global norms) with 5% appreciation and a 7% investment-return assumption, renting-and-investing mathematically outperforms buying over 15 years (verified via the standalone script this spec's numbers came from). This is a genuine, defensible feature of Indian real estate economics, not a modeling error — it is exactly the kind of "interpret, don't dump" insight the tool exists to surface, and the second FAQ entry names it directly rather than hiding it behind generic defaults.
- **`related: ["emi"]` only** (not stamp-duty/area) since the loan piece is the one direct cross-tool dependency; matches the minimal `related` arrays already used by every other tool entry.

## Verification

**Commands:**
- `npm run build` -- expected: succeeds under `output: "export"`, no TypeScript errors.
- grep `out/tools/rent-vs-buy/index.html` for the H1 text and `FAQPage` JSON-LD -- expected: present.
- grep `out/sitemap.xml` for `tools/rent-vs-buy/` -- expected: present.

**Manual checks (if no CLI):**
- Load `/tools/rent-vs-buy/` default state and confirm the EMI, verdict sentence, and year-1/5/10/15 figures match the Default-load I/O row within tolerance.
- Lower `investmentReturnPct` toward 0 and confirm the verdict eventually flips toward buying winning sooner (directional sanity, mirrors the "high investment return favors renting" I/O row in reverse).
- Confirm `/tools` hub page shows four live cards (EMI + Area Unit Converter + Stamp Duty + Rent vs. Buy) with no `sitemap.ts`/`app/tools/page.tsx` edits made.

## Dev Agent Record

**Status:** Built end-to-end in one pass — schema → compute → Tool.tsx → registry.ts → registry.tsx → verify → build. All Execution checklist items complete; all Acceptance Criteria satisfied. `<intent-contract>` was never modified.

**Files created:**
- `src/lib/tools/rent-vs-buy/schema.ts` -- zod schema for all 12 fields, typed defaults matching the spec's Default-load I/O row exactly, and one shared `rentVsBuyBounds` object that the zod `.min()/.max()`, every `Slider`'s UI `min/max`, AND `compute.ts`'s defensive clamps all read from — a single source of truth across all three consumers (deliberately extended one step further than the stamp-duty-rj precedent, which only unified schema+UI; here the same object also backstops the out-of-range-URL-param defense inside `compute.ts`).
- `src/lib/tools/rent-vs-buy/compute.ts` -- pure `compute()` implementing the spec's algorithm verbatim (down payment → loan → `computeEmi()` call → month-by-month owner-cash/rent/pool loop → year-boundary snapshots → breakeven scan). Imports `compute as computeEmi` from `@/lib/tools/emi/compute`; zero edits to that file. Every numeric input is clamped against `rentVsBuyBounds` at the top of `compute()` before any math runs, so a malformed/out-of-range URL param (the documented `useToolState` patch-path validation gap) can never reach the loop as NaN/negative/absurd.
- `src/components/tools/rent-vs-buy/Tool.tsx` -- `'use client'`; `useToolState(rentVsBuySchema, rentVsBuyDefaults)` + `useMemo(compute)`. Always-visible sliders for homePrice/downPaymentPct/annualRate/tenureYears/monthlyRent/horizonYears (down payment slider shows the live ₹ figure via its `hint` prop, satisfying the "computed ₹ next to the % slider" requirement without a second editable field); the six assumption fields collapsed behind an "Assumptions" `<details>` that auto-opens if a shared URL already carries a non-default assumption (same fix class the stamp-duty-rj review applied to its DLC section, applied proactively here rather than waiting for a review pass to catch it). `ResultCard` hero is the verdict sentence itself (not a number), per the Code Map; a hand-drawn SVG two-polyline chart (owner net cost in gold vs. renter net cost in cream, zero baseline, breakeven-year marker) visualizes `yearly[]` with no charting library; the honesty disclaimer sits in the exact required position/class (`font-body text-cream/45 mt-5 text-xs leading-relaxed`, last block before `ResultActions`); local `ResultActions`/`Stat` duplicated again per the existing, already-logged triplication (now quadruplication) rather than refactoring the reference-only sibling `Tool.tsx` files.
- `_bmad-output/implementation-artifacts/spec-rent-vs-buy.md` (this file) -- Execution checklist marked `[x]`, `status: in-progress → done`, this Dev Agent Record added.

**Files edited:**
- `src/lib/tools/registry.ts` -- added the `rent-vs-buy` entry (title/oneLiner/seo.h1/seo.description/seo.faq exactly as specified in Boundaries, `related: ["emi"]`, `phase: 1` immediately) directly above the `vastu-score` entry. No other entry touched.
- `src/components/tools/registry.tsx` -- added `import { RentVsBuyTool } from "./rent-vs-buy/Tool"` and `"rent-vs-buy": RentVsBuyTool` to `toolComponents`.

**Math verification:** Rather than a hand-copied reimplementation, the verification script (`verify.mjs`, scratchpad, not committed) imports and executes the REAL, committed `src/lib/tools/rent-vs-buy/compute.ts` and `src/lib/tools/emi/compute.ts` directly, via `node --experimental-strip-types` plus a tiny custom resolver hook (`alias-loader.mjs`) that rewrites the `@/...` alias to the real `src/` path (Next's bundler-only alias means nothing to bare Node) — so every assertion below genuinely exercises the shipped code, not a copy of it. **33/33 assertions PASS**:
- EMI bit-for-bit match: `rent-vs-buy`'s internal `computeEmi()` call and a direct standalone `emi/compute.ts` `compute()` call with the same loan inputs (₹40,00,000 @ 8.5% × 240mo) both returned `34712.92933462137` — identical, proving reuse not reimplementation.
- Default-load case: EMI ≈ ₹34,712.93 (exact); y1/y5/y10/y15 netOwnerCost and netRenterCost all within ±100 of the spec's figures (268,962/66,492; 779,646/83,595; 952,421/−595,784; 415,425/−2,336,900); `breakevenYear: null`; verdict exactly `"Renting is cheaper for your full 15-year horizon."`.
- Zero-growth exact case: `emi = 6666.67` (800,000/120 exact), `netOwnerCost` within 0.01 of `0.00`, `netRenterCost` within 0.01 of `72,000.00`, `breakevenYear: 1`, verdict exactly `"Buying wins from year 1."`.
- 100%-down-payment edge case: `loanAmount === 0`, `emi === 0`, every `yearly[]` value finite (no NaN/Infinity), year-1 net owner cost small/finite (no leaked EMI).
- Cleared-input edge case (`homePrice=0, monthlyRent=0`): `emi === 0`, every `yearly[]` row's `netOwnerCost`/`netRenterCost`/`homeValue` exactly `0`, no NaN/Infinity, verdict still a valid non-crashing string.
- Horizon-exceeds-tenure case (`tenureYears=5, horizonYears=15`): no NaN/Infinity across all 15 snapshot years; independently confirmed via a direct `emi/compute.ts` call that a 5-year tenure's schedule fully amortizes within 60 months; `homeEquityAtHorizon` at year 15 matches `homeValue` at year 15 (remaining loan balance is zero, as expected once the loan is paid off).
- High-investment-return case (`investmentReturnPct=20` vs. default 7): `netRenterCost` trends lower (more negative) at every matching year (1/5/10/15) versus the default-load case — confirms the model responds directionally to this lever.
- Defensive-clamp cases: `downPaymentPct=-50` → clamped to ≥0, no negative down payment/loan amount; `downPaymentPct=250` → clamped to ≤100, no negative loan amount/NaN; `homePrice=NaN` → does not propagate NaN/Infinity into any result field.

**Build verification:** `npm run build` (Next 16.2.6, Turbopack, `output: "export"`) — compiled successfully in 11.0s, TypeScript clean in 12.6s, all 42 static pages generated including `/tools/rent-vs-buy`. Post-build checks: `out/tools/rent-vs-buy/index.html` exists and contains the H1 text "Rent vs. Buy Calculator" (3 occurrences: title tag, H1, OG) and `FAQPage` JSON-LD (2 occurrences); `out/sitemap.xml` contains `tools/rent-vs-buy/`; `out/tools/index.html` shows the Rent vs. Buy card as a live link (`href="/tools/rent-vs-buy/"`, standard live-card class) — grepping for "Coming soon" in that file shows it now only appears next to the still-phase-2 `vastu-score` card, not rent-vs-buy.

**Deviations / judgment calls:**
- No task or acceptance criterion was left incomplete; no `<intent-contract>` edit was needed or made; no `Block If` condition was triggered (emi/compute.ts's `compute()` was cleanly reusable as investigated, and the build had no unrelated failures).
- `homeEquityAtHorizon`/`investmentValueAtHorizon` (named in the Code Map's return-shape list but not given exact formulas in the algorithm pseudocode) were implemented as: `homeEquityAtHorizon = homeValue(horizon) − remainingBalance(horizon)` (gross "if you don't sell" equity, distinct from `netOwnerCost`'s sale-cost-adjusted `netSaleProceeds`) and `investmentValueAtHorizon = pool` (the renter's full invested-capital-plus-growth account value at horizon, distinct from `netRenterCost`'s growth-only credit). Both are natural, non-redundant reads of already-computed loop state — no new math invented beyond the spec's own algorithm.
- `rentVsBuyBounds` is consumed by `compute.ts` (for defensive clamping) in addition to `schema.ts`'s zod validation and `Tool.tsx`'s `Slider` props — one step beyond the spec's literal "schema bound and UI bound must derive from the same constant" requirement, applied in the same spirit to close the exact out-of-range-URL-param gap the spec's edge-case row calls out.
- The Assumptions `<details>` auto-opens when a shared URL already carries a non-default assumption value (mirrors a fix the stamp-duty-rj review made reactively to its DLC section) — applied proactively here since the failure mode (a control that explains an active override starting hidden) is identical and already a known, logged defect class in this codebase.
- Verified the EMI-reuse and full I/O matrix by executing the real, committed `compute.ts` files under `node --experimental-strip-types` with a custom alias-resolving loader, rather than a hand-transcribed reimplementation (the pattern the stamp-duty-rj story used) — chosen because it eliminates transcription-divergence risk entirely for the one assertion (EMI bit-for-bit reuse) where that risk matters most. Script and loader live in the session scratchpad, not committed.
- `status: in-progress → done` and this Dev Agent Record section were added to match the completed-spec convention already established by `spec-stamp-duty-rj.md`, even though not explicitly itemized in the Tasks checklist.

## Auto Run Result

**Summary:** Built and shipped tool #4 in the Nirman Tools Hub — the Rent vs. Buy Calculator (`/tools/rent-vs-buy/`). No registry stub or addendum existed for this tool beforehand; the registry entry (title/oneLiner/seo/faq) was originated from scratch as part of this run's planning step. The tool reuses `emi/compute.ts`'s `compute()` bit-for-bit for the loan/amortization piece (zero edits to that file) and layers in property tax, maintenance, home appreciation, rent escalation, an investment-opportunity-cost calculation on the renter's side, and selling cost, producing a year-by-year owner-vs-renter net-cost comparison, a breakeven year, and a plain-language verdict. Ships directly as `phase: 1`, live immediately. The model is deliberately honest about being assumption-heavy: a visible disclaimer names every adjustable assumption and the tool's own realistic India-calibrated defaults (a ~3% rental yield, 5% appreciation, 7% investment return) show renting winning the full 15-year horizon — a genuine, documented finding about low Indian rental yields, not a demo tuned to a convenient answer.

**Files changed:**
- `src/lib/tools/rent-vs-buy/schema.ts` (new) — zod schema for 12 fields, typed defaults, and one shared `rentVsBuyBounds` object feeding zod validation, every `Slider`'s UI bounds, and `compute.ts`'s defensive clamps (single source of truth, prevents the stamp-duty-rj-class bound-drift bug).
- `src/lib/tools/rent-vs-buy/compute.ts` (new; patched during review) — pure `compute()` implementing the algorithm verbatim, importing `emi/compute.ts`'s `compute()` for the loan piece. Patched to add `clampInt()` so `tenureYears`/`horizonYears` round to whole numbers (fixes a `yearly[]`-vs-final-state desync a fractional value could otherwise cause) and to correct an overclaiming comment on `clamp()`.
- `src/components/tools/rent-vs-buy/Tool.tsx` (new; patched during review) — client UI: always-visible sliders, collapsible "Assumptions" section (auto-opens for a non-default shared URL), verdict-hero `ResultCard`, hand-drawn SVG owner-vs-renter chart, local `ResultActions`/`Stat`. Patched to: rewrite the disclaimer (names all 6 assumption fields, discloses no income-tax/HRA modeling, softens breakeven permanence framing); relabel "Home equity at horizon" as pre-selling-cost; regroup the stat grid into labeled "Owning"/"Renting" sections; add a collapsible year-by-year data table; add a chart caption for the breakeven/zero dashed lines; add a print-CSS rule so "Download PDF" doesn't silently drop the Assumptions section when collapsed.
- `src/lib/tools/registry.ts` (edit) — added the `rent-vs-buy` entry (`phase: 1`, full title/oneLiner/seo/faq copy). No other entry touched.
- `src/components/tools/registry.tsx` (edit) — wired `"rent-vs-buy": RentVsBuyTool`.
- `_bmad-output/implementation-artifacts/spec-rent-vs-buy.md` (new) — this spec: originated from scratch (Intent, Boundaries, exact algorithm, I/O matrix), Tasks marked complete, Dev Agent Record, Review Triage Log, this Auto Run Result.

**Review findings breakdown:** 15 raw findings from 2 parallel adversarial reviewers (Blind Hunter + Edge Case Hunter, run independently without shared context), triaged — 0 intent_gap, 0 bad_spec, 11 patch (all auto-fixed this pass: an `.int()`-constraint gap in `compute.ts`'s defensive clamp that could desync result fields for a hand-crafted fractional-horizon URL param; an inaccurate code comment; a disclaimer that named only half its own "Assumptions" fields and never disclosed the tax/HRA exclusion; a verdict framing that read as more permanent than the model's own non-monotonic sample data supports; a missing year-by-year data table/accessibility gap; a print-CSS gap that could let "Download PDF" drop the very assumptions behind the printed verdict; a gross/net equity labeling ambiguity; a buy-side-weighted stat grid; and an unlabeled chart legend), 0 defer, 4 reject (security-deposit modeling, LTV-policy disclosure, a `related` cross-link opinion, and verdict-copy prominence — all either out of this tool's explicit scope or already-deliberate, documented spec decisions).

**Verification performed:** `npm run build` run twice (pre- and post-patch), both green — Next 16.2.6/Turbopack, TypeScript clean, `output: "export"`, all 42 static pages generated including `/tools/rent-vs-buy`. Post-build: `out/tools/rent-vs-buy/index.html` present with H1 "Rent vs. Buy Calculator" and `FAQPage` JSON-LD; `out/sitemap.xml` contains `tools/rent-vs-buy/`; `out/tools/index.html` shows it as a live card. Math independently re-verified after patching by executing the real, committed `compute.ts` under Node with an alias-resolving loader (not a hand-transcription): 16/16 assertions pass, including the zero-growth exact case (`netOwnerCost≈0.00`, `netRenterCost=72,000.00`, `breakevenYear=1`), the default-load case (y1/y15 figures within tolerance, `breakevenYear: null`, EMI bit-for-bit identical to a direct `emi/compute.ts` call), the 100%-down-payment and cleared-input edge cases (no NaN/Infinity), and the specific regression the review caught — a fractional `horizonYears=1.9` now rounds cleanly to `2` and every result field is internally consistent with the same final `yearly[]` row.

**Residual risks:** `followup_review_recommended: true` — set higher than the stamp-duty-rj precedent despite every patch staying scoped to this tool's own files (no shared chassis primitive touched) because the patch volume was notably larger (11 vs. 5) and spanned both the compute layer (a real, if narrow-trigger, math-consistency fix) and several UI/copy concerns (print CSS, disclaimer rewrite, stat regroup, new table) applied in the same session that authored the spec and ran the review — an independent follow-up pass would add real value confirming the patched state composes correctly with no self-review blind spots. No `<intent-contract>` edit was needed or made; no `Block If` condition triggered; no shared/reference-only file (`emi/Tool.tsx`, `area/Tool.tsx`, `stamp-duty/Tool.tsx`, `emi/compute.ts`, any `_surface`/`_shell` primitive) was touched.
