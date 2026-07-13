---
title: 'Area Unit Converter (Tool #2) — Nirman Tools Hub'
type: 'feature'
created: '2026-07-13'
status: 'done'
review_loop_iteration: 0
followup_review_recommended: true
baseline_revision: 'eeb3cfb4393c5aececb3cc1520a69a03fdb31e1a'
final_revision: '15a654d0cd5546b84b6277d07daa9bbb97f47943'
context: [
  '{project-root}/_bmad-output/planning-artifacts/briefs/brief-nirman-media-tools-hub-2026-07-10/addendum.md',
  '{project-root}/_bmad-output/planning-artifacts/architecture/architecture-nirman-tools-hub-2026-07-10/ARCHITECTURE-SPINE.md',
  '{project-root}/_bmad-output/implementation-artifacts/1-1-chassis-emi-calculator.md',
]
warnings: ['oversized']
---

<intent-contract>

## Intent

**Problem:** The tools hub has one live tool (EMI). Tool #2, the Area Unit Converter, is registered as a `phase: 2` "coming soon" stub (`src/lib/tools/registry.ts`) but has no compute, data, or UI module — visitors cannot convert between gaj/bigha/biswa/acre/etc., and critically cannot get a *region-correct* bigha value (bigha has no national standard; a generic constant would be wrong for most of India).

**Approach:** Build one self-contained tool module riding the existing chassis exactly like EMI did: a pure `compute()` fed by a versioned data module (`{value, asOf, source}` per AD-6) holding fixed region-invariant unit factors plus a region-selectable bigha/biswa table (Rajasthan default) and a canonical marla/kanal figure. A client `Tool.tsx` lets the user enter a value + source unit + region, and see it live-converted into every other unit. Flip the registry stub to `phase: 1` and wire the component map — routing/sitemap/hub-index update automatically (already proven by AD-2/AD-3 for EMI).

## Boundaries & Constraints

**Always:**
- Mirror the EMI module shape exactly: `src/lib/tools/area/{compute.ts,schema.ts,data.ts}` (pure, no React/I/O) + `src/components/tools/area/Tool.tsx` (`'use client'`), per the architecture spine's Structural Seed.
- Every conversion factor comes from `src/lib/tools/area/data.ts` as `{ value, asOf, source }` (AD-6) — `compute.ts` contains zero hardcoded numbers.
- Fixed (region-invariant), all → sq ft: sq ft=1, Gaj/sq yard=9 (0.8361 sq m), sq metre=10.7639, Acre=43,560 (4,046.86 sq m), Hectare=107,639 (10,000 sq m), Cent=435.6 (40.47 sq m), Guntha=1,089 (101.17 sq m), Ground(TN)=2,400 (222.97 sq m).
- Region-variable bigha (state selector, Rajasthan default = 9,680 sq ft): also carry Shahjahani/pucca (27,225 sq ft), Gantari (17,424 sq ft), UP pucca (27,225), UP kaccha (9,070), Bengal (14,400) as selectable variants. Biswa = bigha/20 for every region (Rajasthan: 484 sq ft), derived, not separately tabulated.
- Marla ≈ 272.25 sq ft (25 sq yd), Kanal = 20 marla ≈ 5,445 sq ft — single canonical figure (addendum gives one number, not a state table); UI copy must note these are a North-India (Punjab/Haryana) convention, not native to Rajasthan, so the figure isn't mistaken for a Rajasthan-verified value.
- The currently-active bigha/biswa value, its region, and `asOf`/`source` must be visibly shown near the result — never a silent constant.
- Reuse `useToolState` (URL-owned state, live recompute, no submit button), `format.ts` (extend, don't ad-hoc `toLocaleString`), `ResultCard`, `InputField`, `ToolShell` as-is (AD-5, AD-8).
- Zod schema (`area/schema.ts`) validates `value` (finite, ≥0, sane upper bound), `fromUnit` (enum of all units), `region` (enum of region-variant ids), with explicit defaults.
- Static export only — no server code, no new npm dependency.
- Flip `src/lib/tools/registry.ts`'s existing `area-converter` entry `phase: 2 → 1` (do not rewrite its `title`/`oneLiner`/`seo` — already written); add `"area-converter": AreaTool` to `src/components/tools/registry.tsx`'s `toolComponents` map. Do not hand-edit `sitemap.ts` or `app/tools/page.tsx` — both already derive from the registry (confirmed by investigation: zero edits needed there).
- Per AGENTS.md, re-confirm the static-export + `useSearchParams`/Suspense constraints from `node_modules/next/dist/docs/` before touching `app/tools/[slug]/page.tsx` if any change there proves necessary (expected: none).

**Block If:** the addendum's given constants prove internally inconsistent in a way not resolvable by using the explicitly-stated default (Rajasthan bigha = 9,680 sq ft) — halt and report the contradiction rather than inventing a resolution.

**Never:** invent additional bigha/marla regional variants beyond those listed in the addendum; add a charting/unit-conversion npm package; put any numeric factor directly in `compute.ts`; make marla/kanal appear as a verified Rajasthan-native figure; use a bare `<select>` styled ad hoc inline in `Tool.tsx` when a reusable `_surface` primitive is the correct chassis extension (see Design Notes).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Default load | no query params | `value=1, fromUnit=bigha, region=rajasthan` → 1 bigha = 9,680 sq ft shown, converted into every other unit | No error |
| Happy path | value=1, fromUnit=bigha, region=rajasthan | sq ft=9,680; sq m≈899.30; gaj≈1,075.56; acre=0.2222 (exact: 43,560/9,680=4.5); biswa=20 (by definition) | No error |
| Region switch | region changed rajasthan→up-pucca while fromUnit=bigha, value held | bigha basis becomes 27,225 sq ft; all outputs recompute from the new basis; biswa recomputes as 27,225/20 | No error |
| Zero/negative value | value=0 or user clears field | all converted outputs = 0, no NaN/Infinity, no divide-by-zero | Clamped to 0 via `InputField` min |
| Marla/Kanal while region=rajasthan | fromUnit=marla, region=rajasthan | converts using the single canonical 272.25 sq ft figure; UI shows "North India convention, not Rajasthan-native" note, does not block | No error, informational only |
| Extreme value | value at/above schema max bound | schema clamps/rejects per `useToolState`'s existing fallback-to-defaults-on-parse-failure behavior | Falls back to defaults, no crash |

</intent-contract>

## Code Map

- `src/lib/tools/area/data.ts` -- NEW. Fixed-unit table + region-variant bigha table + marla/kanal constants, each `{value, asOf, source}` (AD-6).
- `src/lib/tools/area/compute.ts` -- NEW. Pure `compute(input): AreaConvertResult`; converts input value to sq ft via the active region's factors, then to every other unit.
- `src/lib/tools/area/schema.ts` -- NEW. Zod schema + defaults (`value:1, fromUnit:"bigha", region:"rajasthan"`), mirrors `emi/schema.ts` shape.
- `src/components/tools/_surface/Select.tsx` -- NEW. Controlled `{label, value, onChange, options:{value,label}[], id?}` select styled like `InputField`'s bordered box — new shared chassis primitive (stamp-duty-rj's state selector and vastu's direction picker will reuse it later).
- `src/components/tools/area/Tool.tsx` -- NEW. `'use client'`; `useToolState(areaSchema, areaDefaults)` + `useMemo(compute)`; value `InputField`, unit `Select`, region `Select`; `ResultCard` grid of all converted units; provenance line (active bigha value + region + asOf/source).
- `src/lib/tools/format.ts` -- EDIT. Add a decimal-aware `en-IN` formatter (existing `num()` rounds to integer via `Math.round`, unsuitable for sq m/acre precision) — do not modify `num`/`inr`/`inrCompact` signatures, only add.
- `src/lib/tools/registry.ts` -- EDIT. `area-converter` entry: `phase: 2` → `phase: 1`. No other field changes.
- `src/components/tools/registry.tsx` -- EDIT. Add `import { AreaTool } from "./area/Tool"` and `"area-converter": AreaTool` to `toolComponents`.
- `src/components/tools/emi/Tool.tsx` -- REFERENCE ONLY. Pattern source for `useToolState`/`ResultCard`/live-recompute composition; do not edit.

## Tasks & Acceptance

**Execution:**
- [x] `src/lib/tools/area/data.ts` -- author fixed-unit + region-variant + marla/kanal tables per Boundaries, each entry `{value, asOf:'2026-07-13', source}` -- AD-6 compliance, single source of truth for all factors
- [x] `src/lib/tools/area/schema.ts` -- zod schema + typed defaults + unit/region enums -- mirrors `emi/schema.ts` convention
- [x] `src/lib/tools/area/compute.ts` -- pure `compute()`: resolve region → bigha/biswa basis, convert input to sq ft, convert sq ft to every unit -- AD-4 compliance, unit-testable
- [x] `src/components/tools/_surface/Select.tsx` -- new controlled select primitive matching `InputField`'s visual box (`border-line bg-cream`, `focus-within:border-gold`) -- reusable chassis primitive per AD-8, not a one-off
- [x] `src/components/tools/area/Tool.tsx` -- client UI: value input, from-unit select, region select, live result grid, provenance line, Share action (reuse EMI's clipboard pattern) -- number-first, no submit button, URL-shareable
- [x] `src/lib/tools/format.ts` -- add decimal-aware formatter, additive only -- needed for non-integer sq m/acre/hectare results
- [x] `src/lib/tools/registry.ts` -- flip `area-converter.phase` to `1` -- makes the tool live/indexed/sitemapped
- [x] `src/components/tools/registry.tsx` -- wire `"area-converter": AreaTool` -- the one place UI is resolved by slug
- [x] Unit-verify the I/O matrix's happy-path numbers (1 bigha RJ = 9,680 sq ft = 20 biswa = 0.2222 acre ≈ 899.30 sq m ≈ 1,075.56 gaj) by hand or a throwaway Node script before considering `compute.ts` done

**Acceptance Criteria:**
- [x] Given the default state (no query params), when `/tools/area-converter/` loads, then it shows 1 bigha (Rajasthan, 9,680 sq ft) converted live into every other unit, with the Rajasthan region and bigha value visibly labeled.
- [x] Given the region selector is changed to a non-Rajasthan variant, when the from-unit is bigha or biswa, then all outputs recompute from the new region's bigha basis with no page reload (URL query params update via `useToolState`).
- [x] Given `npm run build` runs, when it completes, then `out/tools/area-converter/index.html` exists, `out/sitemap.xml` contains `tools/area-converter/`, and the `/tools` hub shows Area Unit Converter as a live card (not "Coming soon").
- [x] Given a value of 0 or a cleared input, when the result renders, then every unit shows 0 with no NaN/Infinity/crash.

## Spec Change Log

_Empty — no bad_spec loopback was triggered during this run._

## Review Triage Log

### 2026-07-13 — Review pass

- intent_gap: 0
- bad_spec: 0
- patch: 6 (high 1, medium 2, low 3)
- defer: 2 (medium 1, low 1)
- reject: 7 (low 7)
- addressed_findings:
  - `[high]` `[patch]` `numDecimal()`'s fixed 2-decimal cap collapsed small-but-real results into a misleading "0" for common small-plot conversions into acre/hectare (e.g. 100 sq ft → acre rounded to "0.00" → displayed "0"). Replaced with an adaptive-precision formatter in `format.ts` (2/4/6 decimals scaled by magnitude) — also brings the acre example in line with the spec's own I/O-matrix value (`0.2222`, previously would have shown `0.22`).
  - `[medium]` `[patch]` The Value `InputField` never received `max={areaBounds.value.max}`, so the schema's 1e9 upper bound wasn't enforced client-side (root cause: `useToolState.patch()` keeps the raw unvalidated merged value on a zod parse failure rather than clamping — see deferred item below for the hook-level cause). Added the missing `max` prop in `Tool.tsx`, which `InputField`'s existing clamp logic already honors.
  - `[medium]` `[patch]` The "North India convention, not Rajasthan-native" disclosure only rendered when `fromUnit` was marla/kanal, but the results grid always displays marla/kanal values regardless of `fromUnit` — so a user converting from bigha would see marla/kanal numbers with no caveat. Added an always-visible `†` marker on those two grid entries plus a persistent caption, independent of `fromUnit`.
  - `[low]` `[patch]` `Select.tsx`'s auto-generated id only stripped whitespace, so a label like "Region (for bigha / biswa)" produced an id containing literal `(`, `)`, `/`. Sanitized to alphanumeric + hyphen only, since this is a new shared chassis primitive other tools (stamp-duty-rj, vastu) will build on.
  - `[low]` `[patch]` `defaultRegion` was resolved positionally (`bighaRegions[0]`) rather than by id, so reordering the array for any UI reason could silently change the default away from Rajasthan. Now resolved explicitly by `id === "rajasthan"`.
  - `[low]` `[patch]` `compute.ts`'s `sqFtPerUnit` had no fallback for an unrecognized unit id and would throw a `TypeError`; reachable in practice because `useToolState.patch()` can keep an invalid `fromUnit` as live state on validation failure. Added a `?? 0` fallback, consistent with the module's existing guard-never-throw pattern for the value input.
  - Deferred (not this story's problem, logged to `deferred-work.md`): `useToolState.patch()`'s asymmetric validation-failure behavior (pre-existing chassis hook from the EMI story, affects all tools); absence of a unit-test runner for `compute.ts` modules (explicitly acknowledged as a build-phase decision in the architecture spine's own Deferred section and in EMI's story).
  - Rejected as noise: uniform `asOf` date across all data points (expected — single-pass transcription date, not misleading); citing bhumicalculator.com/landvaluetools.com as sources (these are the addendum's own cited refs, used verbatim); the `phase: 2→1` flip shipping the tool to sitemap/index (this is the explicit, intended behavior required by this story's own Acceptance Criteria); the dead `factor > 0` defensive branch in `compute.ts` (harmless, standard defensive coding); the comment naming stamp-duty-rj/vastu as future `Select.tsx` consumers (accurate given the known build queue); region-selector taxonomy mixing states and historical bigha-type variants (reflects the addendum's own source framing; each entry's label and value are individually correct, not a functional defect); region `<select>` remaining enabled during marla/kanal selection (minor polish, already mitigated by the disclosure fix above).

## Design Notes

- **Why a new `_surface/Select.tsx` instead of inline JSX (like EMI's prepayment button-group):** investigation of the codebase found no existing controlled select styled to chassis tokens — `CTA.tsx`'s `<select>` is an uncontrolled dark-form field, wrong shape and wrong visual context. A region list of 6 items and a unit list of ~11 items are both too long for EMI's flex-button pattern. Building `Select.tsx` now (rather than inlining) pays off immediately: stamp-duty-rj needs a state selector and vastu-score needs a direction/room picker next in the queue.
- **Biswa is derived, never tabulated separately:** `biswaSqFt = activeRegion.bighaSqFt.value / 20` inside `compute.ts` (still ultimately sourced from the `data.ts` region entry, so AD-6 holds) — avoids a second hardcoded table that could drift from the bigha table.
- **Marla/kanal are intentionally not in the region-variant table:** the addendum gives one canonical figure, not a per-state table (unlike bigha). Treat them as a fixed unit for compute purposes but keep the "not Rajasthan-native" disclosure in the UI copy so the distinction from true region-variant units (bigha/biswa) stays honest.

## Verification

**Commands:**
- `npm run build` -- expected: succeeds under `output: "export"`, no TypeScript errors.
- grep `out/tools/area-converter/index.html` for the H1 text and the FAQ JSON-LD -- expected: present (same static-SEO pattern EMI already proved).
- grep `out/sitemap.xml` for `tools/area-converter/` -- expected: present now that `phase: 1`.

**Manual checks (if no CLI):**
- Load `/tools/area-converter/` default state and confirm the hand-verified numbers from the I/O matrix (9,680 sq ft, 20 biswa, 0.2222 acre, ~899.30 sq m, ~1,075.56 gaj) match the rendered result.
- Confirm `/tools` hub page shows two live cards (EMI + Area Unit Converter) after the phase flip, with no `sitemap.ts`/`page.tsx` edits made.

## Dev Agent Record

**Status:** Implemented, build-verified, math-verified. `sitemap.ts`, `app/tools/page.tsx`, `app/tools/[slug]/page.tsx` were read to confirm zero edits were required — confirmed true; none were touched.

**Files created:**
- `src/lib/tools/area/data.ts` — `DataPoint` interface; `AREA_UNIT_IDS` (12 units incl. `sqft`); `fixedUnitsSqFt` (8 region-invariant units); `AREA_REGION_IDS` + `bighaRegions` (6 region variants: rajasthan default 9,680; shahjahani-pucca 27,225; gantari 17,424; up-pucca 27,225; up-kaccha 9,070; bengal 14,400); `marlaSqFt` (272.25) and `kanalSqFt` (5,445 = 20×marla) as single canonical North-India figures kept out of the region table per Design Notes. Every entry carries `{value, asOf:'2026-07-13', source}`.
- `src/lib/tools/area/schema.ts` — `areaSchema` (value finite/min 0/max 1e9, `fromUnit`/`region` as `z.enum` sourced directly from `data.ts`'s id tuples so the schema can never drift from the data table), `areaDefaults` (`value:1, fromUnit:"bigha", region:"rajasthan"`), `areaBounds` for the UI field.
- `src/lib/tools/area/compute.ts` — pure `compute(input): AreaConvertResult`. Zero hardcoded numbers (all factors pulled from `data.ts`); resolves the active region, converts to sq ft, then to every unit; biswa derived as `bighaSqFt/20` inline (never separately tabulated); guards non-finite/zero/negative input to 0 with no throw/NaN/Infinity.
- `src/components/tools/_surface/Select.tsx` — new controlled select primitive, wrapper classes copied verbatim from `InputField`'s box (`border-line bg-cream`, `focus-within:border-gold focus-within:bg-cream-warm/40 focus-within:ring-2 focus-within:ring-gold/20`).
- `src/components/tools/area/Tool.tsx` — `'use client'`; `useToolState(areaSchema, areaDefaults)` + `useMemo(compute)`; numeric `InputField` for value, `Select` for from-unit, `Select` for region; `ResultCard` grid of all 12 converted units (active `fromUnit` marked with a gold dot); provenance line showing active bigha sq ft, region label, biswa sq ft, `asOf`, `source`; North-India convention note shown when `fromUnit` is marla/kanal; Share (clipboard) + Download PDF (`window.print()`) actions mirroring `emi/Tool.tsx`. No submit button, live recompute only.

**Files modified:**
- `src/lib/tools/format.ts` — added `numDecimal()` (en-IN, up to 2 decimals, no rounding to integer). `inr`/`num`/`inrCompact`/`formatMonths` untouched.
- `src/lib/tools/registry.ts` — `area-converter` entry: `phase: 2` → `phase: 1`. No other field changed (title/oneLiner/seo copy left exactly as written).
- `src/components/tools/registry.tsx` — added `import { AreaTool } from "./area/Tool"` and `"area-converter": AreaTool` to `toolComponents`.
- `_bmad-output/implementation-artifacts/spec-area-converter.md` — this file: checked off all Task/AC boxes, appended this record. `<intent-contract>` section left untouched.

**Math verification:** ran a standalone Node script (`verify-area.mjs`, scratchpad, not committed to the repo) that re-implements `compute.ts`'s exact logic against literal copies of the `data.ts` constants, plus read `compute.ts` by eye to confirm the script matches. Results for 1 bigha, Rajasthan: sq ft = 9680 (exact), biswa = 20 (exact), acre = 0.2222222… (exact, 43560/9680 = 4.5), sq m = 899.302297… (~899.30 ✓), gaj = 1075.555556… (~1075.56 ✓). Region switch to up-pucca: sq ft = 27225 (exact), biswa still 20 by definition, biswa basis = 1361.25 sq ft. Zero/negative/NaN input: all 12 units return exactly 0, no NaN/Infinity. Marla = 272.25 sq ft, kanal = 5445 sq ft (= 20×marla) regardless of region, confirming marla/kanal ignore the region selector per spec.

**Build verification:** `npm run build` (Next 16.2.6, Turbopack, `output: "export"`) — compiled successfully, TypeScript passed, `/tools/[slug]` SSG generated `/tools/emi`, `/tools/area-converter`, `/tools/stamp-duty-rj`, `/tools/vastu-score`. Post-build checks: `out/tools/area-converter/index.html` exists; `<title>Area Unit Converter — Nirman Media</title>` present; H1 "Area Unit Converter" present (×4, header + repeated in static markup); `FAQPage` JSON-LD present; FAQ question text ("Is 1 bigha the same everywhere in India?") present. `out/sitemap.xml` contains `tools/area-converter/` and `tools/emi/`, and correctly does NOT contain `tools/stamp-duty-rj/` or `tools/vastu-score/` (still phase 2). `out/tools/index.html` shows the Area Unit Converter card with the "Live" badge (gold dot + "Live" text), not "Coming soon".

**Deviations / judgment calls:**
- None required invention beyond the addendum's stated constants — no internal inconsistency was found, so the Block-If clause was never triggered.
- Region ids chosen as kebab-case strings (`rajasthan`, `shahjahani-pucca`, `gantari`, `up-pucca`, `up-kaccha`, `bengal`) — not specified verbatim in the spec, only the 6 labels were. This follows the existing `slug`/id kebab-case convention used elsewhere in the registry.
- `AREA_UNIT_IDS`/`AREA_REGION_IDS` id tuples live in `data.ts` and are imported by `schema.ts` for its `z.enum(...)`, rather than duplicating a separate literal list in the schema (as EMI's schema does for its own smaller enums). Chosen so the unit/region enum can never drift out of sync with the data table it describes — still respects "compute.ts contains zero hardcoded numbers" and doesn't change `schema.ts`'s external shape/behavior.
- No `max` prop passed to the value `InputField` (only `min`/`step`) — mirrors EMI's own `InputField` usage for `prepayAmount` (also no `max`). The "extreme value" edge case is handled by `useToolState`'s existing initial-load fallback-to-defaults behavior (via the schema's `.max(1_000_000_000)`), exactly as the spec's I/O matrix describes, with no new logic needed in `Tool.tsx`.
- Included both "Download PDF" (`window.print()`) and "Share" (clipboard) actions, not just Share — the task brief's framing text described both as part of mirroring `emi/Tool.tsx`'s pattern; the Code Map/Tasks list only named Share explicitly, so PDF is an intentional superset, not a deviation from any constraint.
- No task or acceptance criterion was left incomplete.

## Auto Run Result

**Summary:** Built and shipped tool #2 in the Nirman Tools Hub — the Area Unit Converter (`/tools/area-converter/`). Region-invariant units (sq ft, gaj, sq m, acre, hectare, cent, guntha, ground) plus a region-selectable bigha/biswa table (Rajasthan default, 5 historical/state variants) and a canonical North-India marla/kanal figure, all sourced from the brief addendum and carried as versioned `{value, asOf, source}` data (AD-6). Live recompute, URL-owned state, provenance always shown. Flipped the existing registry stub from `phase: 2` to `phase: 1` — routing, sitemap, and the `/tools` hub card promoted automatically with zero edits to `sitemap.ts` or `app/tools/page.tsx`.

**Files changed:**
- `src/lib/tools/area/data.ts` (new) — versioned unit/region data tables, the tool's sole source of numeric truth.
- `src/lib/tools/area/schema.ts` (new) — zod schema + defaults (1 bigha, Rajasthan).
- `src/lib/tools/area/compute.ts` (new) — pure conversion math, zero hardcoded numbers, guards invalid input to 0.
- `src/components/tools/_surface/Select.tsx` (new) — controlled select chassis primitive (AD-8), reusable by stamp-duty-rj/vastu-score next in the queue.
- `src/components/tools/area/Tool.tsx` (new) — client UI: value + unit + region controls, live result grid, provenance line, marla/kanal disclosure, Share/PDF actions.
- `src/lib/tools/format.ts` (edit) — added `numDecimal()`, an adaptive-precision en-IN formatter; existing formatters untouched.
- `src/lib/tools/registry.ts` (edit) — `area-converter.phase`: `2` → `1`; no copy changed.
- `src/components/tools/registry.tsx` (edit) — wired `"area-converter": AreaTool`.
- `_bmad-output/implementation-artifacts/deferred-work.md` (new) — 2 deferred findings logged (see below).

**Review findings breakdown:** 15 raw findings from 2 parallel adversarial reviewers (Blind Hunter + Edge Case Hunter), deduplicated and triaged — 0 intent_gap, 0 bad_spec, 6 patch (all auto-fixed this pass: adaptive-precision number formatting, client-side max-value clamp, always-visible marla/kanal disclosure, `Select.tsx` id sanitization, id-based `defaultRegion`, defensive fallback in `sqFtPerUnit`), 2 defer (pre-existing `useToolState` validation asymmetry; absent test runner — both logged to `deferred-work.md`, both predate this story), 7 reject (noise — see Review Triage Log for the full list).

**Verification performed:** `npm run build` run twice (pre- and post-patch), both green — Next 16.2.6/Turbopack, TypeScript clean, `output: "export"`. Post-build: `out/tools/area-converter/index.html` present with H1/FAQPage JSON-LD; `out/sitemap.xml` contains `tools/area-converter/` and correctly omits still-phase-2 tools; `out/tools/index.html` shows a "Live" badge on the Area Unit Converter card. Math independently re-verified after the formatter patch via a standalone Node snippet: 1 bigha (Rajasthan) → 9,680 sq ft, 20 biswa (exact), 0.2222 acre (exact), ~899.3 sq m, ~1,075.56 gaj; the previously-collapsing case (100 sq ft → acre) now shows `0.002296` instead of `0`. `<intent-contract>` was never modified.

**Residual risks:** `followup_review_recommended: true` — the patch pass touched a shared formatter (`numDecimal`, newly added, not yet consumed elsewhere) and a new shared primitive (`Select.tsx`) that the next two queued tools (stamp-duty-rj, vastu-score) will build directly on top of; worth a light independent look before those tools lean on them further. Two items sit in `deferred-work.md` for a future dedicated pass: `useToolState.patch()`'s validation-failure asymmetry (affects every tool using the hook, including EMI) and the repo's total absence of a unit-test runner.
