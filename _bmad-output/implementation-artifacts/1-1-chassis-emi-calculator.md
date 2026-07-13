---
baseline_commit: 7dc1abe3862dbf38d79ef57c09060adb9de398cc
---

# Story 1.1: Tool Chassis + Home Loan/EMI Calculator (Tool #1)

Status: review

## Story

As a **property buyer/broker in Rajasthan (and Nirman, who wants their leads)**,
I want **a fast, beautiful home-loan EMI calculator on nirmanmedia.com/tools, built on a reusable chassis**,
so that **I get my monthly payment instantly — and every future tool drops onto the same frame without a rebuild**.

This story builds the **chassis** (the reusable frame all tools ride) AND the **first tool** (EMI) that proves it. Ship both together; the tool validates the chassis.

## Acceptance Criteria

**Chassis**
1. A pure, React-free tool registry exists at `src/lib/tools/registry.ts` exporting `ToolMeta[]` + `toolBySlug(slug)`, mirroring the shape/convention of `src/lib/industries.ts`. It is the single source of truth — the route, `/tools` index, `sitemap.ts`, and cross-promo all derive from it.
2. `src/app/tools/[slug]/page.tsx` renders any tool via `generateStaticParams()` (from the registry) + async `generateMetadata()`, mirroring `src/app/industries/[slug]/page.tsx`. Unknown slug → `notFound()`.
3. `/tools` index page (`src/app/tools/page.tsx`) lists all registry tools as cards linking to `/tools/{slug}/`.
4. `src/app/sitemap.ts` is extended to spread the registry (`...tools.map(...)`) — adding a tool never requires hand-editing the sitemap again.
5. A shared `ToolShell` wraps every tool: **branded-light** (Nirman logo corner + one gold accent, existing tokens), SEO landing structure (H1, tool above the fold, explainer + FAQ below), a `LeadSlot` component that is **feature-flagged OFF** (renders nothing in Phase 1), and a `CrossPromo` strip placeholder.
6. Shared tool-surface primitives exist and are reused (not reinvented per tool): `InputField`, `Slider` (synced with a numeric field), `ResultCard`. Plus an `en-IN` money/number formatter util (`src/lib/tools/format.ts`) and a `useToolState(schema)` hook that parses/serializes tool inputs to URL query params.
7. `next build` still succeeds under `output: "export"` — **no** Route Handlers, Server Actions, or dynamic server rendering introduced.

**EMI tool**
8. Pure compute module `src/lib/tools/emi/compute.ts` (no React, no I/O) implements EMI = `[P·R·(1+R)^N] / [(1+R)^N − 1]` where `R = annualRate/12/100`, `N = tenureMonths`; returns EMI, total interest, total payment, and a month-by-month amortization schedule. Handles the `R = 0` edge (EMI = P/N). Verified: ₹20L @ 7.5% × 120mo → EMI ≈ ₹23,740.
9. Prepayment modeling: optional extra payment (one-time or monthly) returns revised tenure + interest saved.
10. `src/lib/tools/emi/schema.ts` is a zod schema for inputs (loan amount, annual rate, tenure years/months, optional prepayment) with sane bounds.
11. Client component `src/components/tools/emi/Tool.tsx` implements Sally's approved screen (see Dev Notes): number-first; desktop 2-col (controls ~40% / result ~60%), mobile stacked with sticky result card; **slider + numeric field on every input**; **live recompute on every change — NO "Calculate" button**; big gold EMI/mo hero (`tab-num`); hand-drawn **inline SVG** donut for principal-vs-interest (**no charting library**); plain-language interest line; collapsible "Add prepayment"; floating-rate disclaimer microcopy; PDF/print + Share (copies URL) actions shown **after** a result exists; collapsed amortization schedule + "How EMI is calculated" / FAQ SEO copy below.
12. Inputs are reflected in the URL (AD-5) so the result is shareable/deep-linkable; page reads them on load.
13. Registry has the `emi` entry; visiting `/tools/emi/` renders the working tool inside `ToolShell` with correct `<title>`/meta.

**Constraints (all ACs)**
14. Reuse existing design tokens only (see Dev Notes) — no new color/font systems.
15. `en-IN` formatting (₹, lakh/crore grouping) via the shared formatter — never ad-hoc `toLocaleString` per tool.
16. Accessible: labeled inputs, keyboard-operable sliders, respects `prefers-reduced-motion` (already globally handled).

## Tasks / Subtasks

- [x] **Task 0 — Read the customized Next.js docs FIRST (AC: 2,7)**
  - [x] Read `node_modules/next/dist/docs/01-app/02-guides/static-exports.md` (unsupported features: no server actions/route handlers-with-Request/dynamicParams) and `.../04-functions/use-search-params.md` (static page using `useSearchParams` MUST be Suspense-wrapped or the export build fails). Route/metadata pattern trusted from the shipped `industries/[slug]` code.
- [x] **Task 1 — Registry + types (AC: 1)**
  - [x] `src/lib/tools/types.ts` → `ToolMeta`.
  - [x] `src/lib/tools/registry.ts` → `tools: ToolMeta[]` + `toolBySlug` + `liveTools`. Pure data, zero React. Mirrors `industries.ts`.
- [x] **Task 2 — Shared surface + utils (AC: 6,15)**
  - [x] `src/lib/tools/format.ts` → `inr`, `inrCompact` (lakh/crore), `num`, `formatMonths`, all `en-IN`.
  - [x] `src/lib/tools/useToolState.ts` → `'use client'` hook: parses `useSearchParams()` vs zod schema, mirrors state to URL via `history.replaceState` (no router churn → cheap live recompute). Single place any tool touches query params.
  - [x] `_surface/InputField.tsx`, `Slider.tsx` (range synced with numeric field), `ResultCard.tsx`.
- [x] **Task 3 — ToolShell chassis (AC: 5)**
  - [x] `_shell/ToolShell.tsx`: logo corner (`LogoMark`), H1 from `seo.h1`, tool island, explainer + FAQ with `FAQPage` JSON-LD, `<CrossPromo/>`.
  - [x] `LeadSlot.tsx` → `LEADS_ENABLED = false`, returns `null`; exports fixed `LeadPayload` type for Phase 2.
  - [x] `CrossPromo.tsx` → static strip (real-estate media + pricing).
- [x] **Task 4 — Route + index + sitemap (AC: 2,3,4,13)**
  - [x] `src/app/tools/[slug]/page.tsx` mirrors `industries/[slug]`; resolves the client component via `src/components/tools/registry.tsx`; wraps it in `<Suspense>` (required for the static-export + `useSearchParams` combo).
  - [x] `src/app/tools/page.tsx` index — cards from `liveTools`.
  - [x] Extended `src/app/sitemap.ts` with `/tools/` + `...liveTools.map(...)` (trailing-slash convention matched).
- [x] **Task 5 — EMI compute + schema (AC: 8,9,10)**
  - [x] `src/lib/tools/emi/compute.ts` pure (EMI + `r=0` edge + amortization + prepayment one-time/monthly with infinite-loop guard).
  - [x] `src/lib/tools/emi/schema.ts` zod schema + defaults (₹50,00,000 / 8.5% / 20yr) + `emiBounds`.
- [x] **Task 6 — EMI UI (AC: 11,12,14,16)**
  - [x] `src/components/tools/emi/Tool.tsx` per Sally's screen. `useToolState` + `useMemo(compute)`, formatter for all money, `md:sticky` result on desktop, no Calculate button.
  - [x] Hand-drawn SVG donut (two `<circle>` arcs, no lib); collapsible `<details>` prepayment; `window.print()` PDF; `navigator.clipboard` Share. Styled range CSS added to `globals.css` (`.tool-range`).
- [x] **Task 7 — Verify (AC: 7,13)**
  - [x] `npm run build` passes; `/tools/emi/index.html` emitted (SSG). Sample EMI ₹20L@7.5%×120mo = **₹23,740** (exact), zero-rate edge = ₹100,000 (exact), default = ₹43,391. Sitemap contains `/tools/emi/`; title + `FAQPage` JSON-LD + FAQ text present in static HTML.

### Review Follow-ups (AI)

_None yet._

## Dev Notes

### CRITICAL — read before coding
- **`node_modules/next/dist/docs/`** — mandatory per `AGENTS.md`. Next **16.2.6** here; do not assume training-data API shapes. The repo's real usage is the ground truth (see cited files).
- **Static export.** `next.config.ts`: `output: "export"`, `trailingSlash: true`, `images: { unoptimized: true }`. **No server runtime** — all compute client-side; no route handlers/server actions. Internal links get a trailing slash (`/tools/emi/`).
- **No new dependencies for the tool.** EMI math is ~15 lines; the donut is two SVG circles. Do **not** add a charting lib, PDF lib, or Indian-units package. `zod` (4.4.3) and `react-hook-form` (7.75.0) are already installed if useful.

### Architecture invariants (from the spine — must obey)
Source: `_bmad-output/planning-artifacts/architecture/architecture-nirman-tools-hub-2026-07-10/ARCHITECTURE-SPINE.md`
- **AD-2** Registry is single source of truth; routing/sitemap/index/cross-promo derive from it — adding a tool never hand-edits routing/sitemap.
- **AD-3** One dynamic route renders all tools via the shared `ToolShell` (mirror the industries pattern).
- **AD-4** Compute is pure and separate from UI — no calculation logic inside React components.
- **AD-5** Tool input state is URL-owned (via the shared `useToolState`); tools never read/write `searchParams` directly.
- **AD-6** No rate/factor hardcoded in compute (matters more for later tools; EMI has none, but keep the discipline).
- **AD-7** One `LeadSlot` + one fixed payload; flagged OFF in Phase 1; capture is **result-first**, never a pre-result wall.
- **AD-8** Reuse the site design system; one shared surface family, no per-tool bespoke primitives.

### Existing patterns to MIRROR (read these files, copy the shape)
- **Catalog:** `src/lib/industries.ts` — typed array + `xBySlug()` at `:193`. Registry should feel identical.
- **Dynamic route:** `src/app/industries/[slug]/page.tsx:11-36` — `generateStaticParams`, async `generateMetadata`, `params: Promise<{slug}>`, `notFound()`. Copy this exactly for `tools/[slug]`.
- **Sitemap:** `src/app/sitemap.ts` — `export const dynamic = "force-static"`; base = `https://nirman.media`; spreads catalog arrays. Add tools here.
- **Small label component pattern:** `src/components/layout/PageMeta.tsx` — shows the tone-prop + eyebrow style used across the site.

### Layout facts (important, non-obvious)
- `src/app/layout.tsx` wraps **every** page in `<SmoothScroll>` (Lenis), `<Nav/>`, `<main id="main">`, `<Footer/>`, plus `<SiteLoader/>`, `<ScrollProgress/>`, `<WhatsAppFAB/>`. Your `/tools` pages inherit all of this — **do not** re-add Nav/Footer.
- Global **Lenis smooth-scroll is fine** (it's inertia, not scroll-jacking). But per the UI decision, **do NOT add GSAP ScrollTrigger scrub/reveals on tool pages** — the tool zone is calm/instant. The only motion is the result updating live.
- `position: sticky` for the mobile result card works under Lenis. Test it.
- Fonts: Playfair Display (`font-heading`) + Inter (body), wired in `layout.tsx:11-24`.

### Design tokens (from `src/app/globals.css` — use these, invent nothing)
- Tailwind 4 `@theme` colors → utility classes work directly: `bg-cream` (`--color-cream`), `text-ink`, `bg-navy`, `text-gold` (`--color-gold` oklch(0.72 0.135 78)), `border-line`, plus `-soft/-deep/-bright` variants, `sand`, `mist`.
- Utilities: `font-heading` (`:64`), `eyebrow` (`:92`, uppercase tracked label), `tab-num` (`:175`, tabular figures — use on all numeric results), `no-scrollbar`, `arrow-link`, `link-underline`, `reveal-up`.
- Default `--radius: 9999px` (pill); use explicit `rounded-2xl` etc. for cards like the industries page does.
- Accent discipline (branded-light): logo in corner + **one** gold accent on the result. Body/labels stay ink on cream. Don't gild everything.
- `prefers-reduced-motion` already globally neutralizes transitions (`:193`).

### EMI math & Indian conventions (from brief addendum — verified/sourced)
Source: `_bmad-output/planning-artifacts/briefs/brief-nirman-media-tools-hub-2026-07-10/addendum.md`
- Formula above. Amortization row: opening balance, EMI, interest part (`bal·R`), principal part (`EMI − interest`), closing balance. Early EMIs interest-heavy; principal share rises.
- **Floating-rate disclaimer** (required microcopy): most Indian home loans are floating (repo/RLLR) — result is an estimate; the rate resets. State this near the result.
- **Prepayment is the differentiator** — penalty-free on floating individual loans (RBI). Show years+months saved and ₹ interest saved. Make it feel like the payoff.
- Cross-check reference only (do not add as dep): `cfpb/amortize` (CC0), `YuvarajSingh-0/EMI-Calculator` (Next+Tailwind).

### Sally's approved EMI screen (the UX contract)
- **Number-first**: EMI/mo is the hero, always above the fold, big, gold, `tab-num`. Never behind a button.
- **Desktop**: two columns — controls ~40% left, result ~60% right. **Mobile**: stacked; result card sticks to top while controls scroll.
- **Every value = slider + numeric field, synced.** Live recompute on keystroke/drag. **No Calculate button** (non-negotiable).
- Result card contents: big EMI/mo; SVG donut principal-vs-interest; total payment; one plain-language line (e.g. "Over 20 yrs you pay ₹54L interest — 1.08× the loan").
- "Add prepayment" is a collapsed link; opening it reveals inputs and grows a result line (years saved + interest saved).
- After a result exists: "Email me this as PDF" (LeadSlot, off in P1 → for now a print/`window.print()` "Download PDF") + "Share" (copy URL).
- Below the fold: collapsed amortization schedule (sideways-scroll on mobile) + "How EMI is calculated" (show the formula + worked example) + FAQ. This is the SEO body.

### SEO structure (per tool)
- URL `/tools/emi/`, H1 = search intent ("Home Loan EMI Calculator"), tool above the fold, explainer + FAQ below with `FAQPage` JSON-LD. `generateMetadata` sets title `"Home Loan EMI Calculator — Nirman Media"` + description from `seo.description`. Jaipur/Rajasthan phrasing in copy for local SEO.

### Project Structure Notes
- New tree under existing `src/` (matches spine Structural Seed):
  - `src/lib/tools/{types,registry,format,useToolState}.ts` + `emi/{compute,schema}.ts`
  - `src/components/tools/_shell/{ToolShell,LeadSlot,CrossPromo}.tsx`, `_surface/{InputField,Slider,ResultCard}.tsx`, `emi/Tool.tsx`, `registry.tsx` (slug→component map)
  - `src/app/tools/page.tsx`, `src/app/tools/[slug]/page.tsx`
  - EDIT (only existing file touched): `src/app/sitemap.ts`
- Aliasing: `@/*` → `./src/*` (`tsconfig.json`).
- Keep client/server split clean: registry data + route are server; interactive tool + `useToolState` are `'use client'` islands.

### Testing standards
- No test runner is configured in the repo yet. At minimum: hand-verify the sample case (₹20L @ 7.5% × 120mo → ≈₹23,740) and that `npm run build` produces `/tools/emi/index.html` under `output: export`. `compute.ts` is written pure specifically so a runner can be added later without refactor.

### References
- [Source: _bmad-output/planning-artifacts/architecture/architecture-nirman-tools-hub-2026-07-10/ARCHITECTURE-SPINE.md] — AD-1..8, conventions, structural seed
- [Source: _bmad-output/planning-artifacts/architecture/architecture-nirman-tools-hub-2026-07-10/.memlog.md] — full decision trail incl. UI direction + EMI screen spec
- [Source: _bmad-output/planning-artifacts/briefs/brief-nirman-media-tools-hub-2026-07-10/addendum.md#Tool-1] — EMI formula, prepayment, disclaimer, refs
- [Source: src/lib/industries.ts] — catalog pattern to mirror
- [Source: src/app/industries/[slug]/page.tsx] — dynamic-route + metadata pattern to mirror
- [Source: src/app/sitemap.ts] — sitemap pattern to extend
- [Source: src/app/globals.css] — design tokens + utilities
- [Source: src/app/layout.tsx] — global Nav/Footer/Lenis wrapper (do not duplicate)
- [Source: AGENTS.md] — read node_modules/next/dist/docs before coding

## Dev Agent Record

### Agent Model Used

claude-opus-4-8 (Amelia, bmad-dev-story)

### Debug Log References

- EMI math verified via a standalone Node script before building UI: sample ₹20L@7.5%×120mo → ₹23,740 (matches story), zero-rate edge → ₹100,000, default ₹50L@8.5%×240mo → ₹43,391, monthly prepay ₹5k → 53 months + ₹13.9L saved.
- `npm run build` (Next 16.2.6, Turbopack, `output: export`) — compiled + TypeScript passed; `/tools` (static) and `/tools/[slug]` → `/tools/emi` (SSG) generated.
- Post-build grep confirmed: `out/tools/emi/index.html` present; static H1, FAQ text, `FAQPage` JSON-LD, and floating-rate copy in HTML; `out/sitemap.xml` contains `tools/emi/`; `<title>Home Loan EMI Calculator — Nirman Media</title>`.

### Completion Notes List

- Chassis + EMI (tool #1) built together; the tool exercises the whole chassis (registry → route → ToolShell → surface → URL state → cross-promo).
- **Design decision honored:** branded-light (logo corner + gold accent, existing tokens), calm/instant tool zone, live recompute, **no Calculate button**, no charting/PDF libs.
- **Static-export nuance (by design, not a bug):** the interactive result is client-rendered inside the required `<Suspense>` boundary (because `useToolState` uses `useSearchParams`), so the live number appears after hydration; the SEO body (H1, oneLiner, FAQ, cross-promo) is fully static in the HTML. Acceptable for v1; a future option is reading `window.location` in an effect to allow SSR of the default state.
- **No test runner is configured** in the repo (no jest/vitest, no eslint). Verification was done via the Node math script + the production build + HTML grep. `compute.ts` is pure specifically so a runner can be added later with zero refactor. This is an honest gap, not a passed suite.
- Add-a-tool path proven: a new tool needs only `src/lib/tools/<slug>/` (compute+schema), `src/components/tools/<slug>/Tool.tsx`, one `registry.ts` row, and one `registry.tsx` map entry — routing, index, sitemap, SEO shell all derive automatically.

### File List

New:
- `src/lib/tools/types.ts`
- `src/lib/tools/registry.ts`
- `src/lib/tools/format.ts`
- `src/lib/tools/useToolState.ts`
- `src/lib/tools/emi/compute.ts`
- `src/lib/tools/emi/schema.ts`
- `src/components/tools/_surface/Slider.tsx`
- `src/components/tools/_surface/InputField.tsx`
- `src/components/tools/_surface/ResultCard.tsx`
- `src/components/tools/_shell/ToolShell.tsx`
- `src/components/tools/_shell/LeadSlot.tsx`
- `src/components/tools/_shell/CrossPromo.tsx`
- `src/components/tools/emi/Tool.tsx`
- `src/components/tools/registry.tsx`
- `src/app/tools/page.tsx`
- `src/app/tools/[slug]/page.tsx`

Modified:
- `src/app/sitemap.ts` (added `/tools/` + `liveTools` mapping)
- `src/app/globals.css` (added `.tool-range` styled slider)

### Chassis v2 — visual design upgrade (2026-07-13)

New:
- `plannedTools` export in `src/lib/tools/registry.ts` — phase-2 stub entries (`area-converter`, `stamp-duty-rj`, `vastu-score`) so the hub reads as a growing catalog, not one lonely card. Pure data (AD-2); each gets a real static route via the existing `generateStaticParams()` (unchanged), rendered with the existing "coming soon" fallback in `[slug]/page.tsx`.

Modified:
- `src/app/tools/[slug]/page.tsx` — `generateMetadata` now sets `robots: { index: false, follow: true }` on non-live (phase-2) tool pages, so the new coming-soon routes don't get indexed as thin content. Sitemap untouched (still `liveTools`-only).
- `src/app/tools/page.tsx` — hub index rebuilt: bento layout (single live tool spans `sm:col-span-2`, self-corrects to a uniform grid once ≥2 tools are live), category icon tiles (hand-drawn SVG, one per `ToolCategory`, no icon lib), "Live" / "Coming soon" badges, and a 3-stat trust strip in the header.
- `src/components/tools/_shell/ToolShell.tsx` — tool-island section now `bg-cream-warm/30` vs the explainer's `bg-cream`, so the chassis reads as a distinct workspace via color-block instead of another border.
- `src/components/tools/_surface/InputField.tsx`, `Slider.tsx` — **fixed a real a11y bug**: both had `focus:outline-none` on the input with no replacement, silently killing keyboard focus visibility (the site's global `*:focus-visible` gold-outline rule never got a chance to apply cleanly inside the bordered box). Replaced with a `focus-within` ring + border-gold + bg lift on the wrapper.
- `src/components/tools/_surface/ResultCard.tsx` — was the flattest element on the page despite being the hero; added `shadow-xl shadow-navy/25`, a subtle top gold sheen, and a soft radial tint.
- `src/components/tools/emi/Tool.tsx` — donut gets a drop-shadow + animates its arc on value change (`transition: stroke-dasharray`, respects the existing global `prefers-reduced-motion` override); `cursor-pointer` added to the two result-action buttons (native `<button>` doesn't default to it).
- `src/app/globals.css` — `.tool-range` thumb 20px→22px (touch target), added a `:focus-visible` gold ring on the thumb (previously only the gradient track had a visual state; keyboard users tabbing to the range input got nothing).

Design direction sourced via `ui-ux-pro-max` (Swiss Modernism 2.0 + Trust & Authority patterns — single-accent discipline, compatible with the fixed cream/navy/gold tokens, no palette change).

## Change Log

| Date | Change |
| --- | --- |
| 2026-07-10 | Implemented story 1.1 — tool chassis (registry-driven, single-source-of-truth) + Home Loan/EMI calculator (tool #1). Build passes under static export; EMI math verified against known samples. Status → review. |
| 2026-07-13 | Chassis v2 — visual design upgrade (hub bento layout + trust strip, category icons, ResultCard/donut depth, phase-2 stub tools for the hub roadmap) + fixed a real focus-ring a11y bug in InputField/Slider. `npm run build` passes; sitemap still emi-only, phase-2 routes correctly `noindex`. Not yet visually checked in a browser (no browser tool available this session) — verified via static HTML output only. |
