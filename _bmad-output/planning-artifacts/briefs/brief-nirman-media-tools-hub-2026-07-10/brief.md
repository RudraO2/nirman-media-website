---
title: "Product Brief: Nirman Media Tools Hub (nirmanmedia.com)"
status: draft
created: 2026-07-10
updated: 2026-07-10
---

# Product Brief: Nirman Media Tools Hub

## Executive Summary

Nirman Media is a Jaipur-based media agency serving the real-estate sector. **nirmanmedia.com** will become a hub of free, best-in-class online tools for Indian property buyers, sellers, brokers, and homeowners — a "TinyWow for real estate and vastu." Each tool solves one concrete job exceptionally well: calculating a home loan EMI, converting gaj to square feet, estimating Rajasthan stamp duty, or checking a home's vastu.

The tools are free, but they are not charity. They are **lead magnets**. Every calculator is a reason for a high-intent property prospect to land on Nirman's domain, and — at a natural moment ("email me this report") — hand over a name and phone number. Those leads feed Nirman's existing CRM/LMS and its real-estate clients. The hub also cross-promotes Nirman's existing broker products.

The strategy is deliberately phased and capital-light: ship **free, no-paid-API tools first**, one at a time, each polished to a "wow." Tools that need paid AI (e.g. upload a floor-plan photo → automatic vastu reading) are deferred until revenue justifies the API cost. The whole thing rides on one reusable **tool "chassis"** so that adding a new tool later is a drop-in job — ideal for fast, iterative "vibe coding."

## The Problem

Indian property decisions are high-stakes and math-heavy, and the helper tools that exist are fragmented, ad-choked, or generic:

- A Jaipur buyer working in **gaj and bigha** gets calculators built for generic square-meters.
- **Stamp duty and registration** costs are state-specific; national tools mislead.
- **Vastu** — central to Indian home decisions — has almost no credible, usable free tooling; it's blog posts and paid consultants.
- Brokers juggle EMI, area, brokerage, and yield math daily with scattered, unreliable tools.

For Nirman specifically, the business problem is **lead supply**: a media agency needs a steady, low-cost stream of qualified property prospects to serve its clients. Paid ads are expensive and rented. Owned, high-intent tool traffic is not.

## The Solution

A single domain hosting a growing catalog of focused tools. v1 tools are pure client-side calculators — fast, free, no backend cost. Every tool shares a common **chassis**:

- Clean, mobile-first tool UI + instant result card
- SEO block (each tool is its own landing page targeting real search demand)
- A natural **lead-capture slot** ("email/WhatsApp me this report") — soft, added in the phased rollout, never a hard gate
- A **cross-promo strip** surfacing Nirman's CRM/LMS and broker products
- Central **tool catalog** so a new tool = drop one folder + register it

Phasing: **Phase 1** — fully free, no capture, maximize traffic + prove the chassis. **Phase 2** — add soft lead capture + cross-promo once tools have usage.

## What Makes This Different

- **Hyper-local precision.** Gaj/bigha units and Rajasthan stamp-duty rates out of the box — the accuracy generic tools miss. This *is* the wow, not a feature.
- **Vastu is the moat.** A genuinely useful free vastu tool is rare; it's Nirman's differentiator and its natural brand fit.
- **Execution speed, honestly stated.** The chassis + catalog architecture lets Nirman add a polished tool in ~an afternoon. The moat is cadence, not proprietary tech.
- **Owned lead channel.** Unlike paid ads, tool traffic is an appreciating, owned asset feeding an existing CRM/LMS.

## Who This Serves

- **Property buyers/sellers (primary).** Want fast, trustworthy answers on cost, area, loans, vastu. Success = a clear answer in seconds, on mobile.
- **Brokers/agents (primary).** Daily power users of EMI/area/yield math; also a target audience for Nirman's broker products. Success = reliable tools they bookmark and reuse.
- **Homeowners (vastu).** Want to check/improve their home's vastu without paying a consultant.
- **Nirman Media (the business).** Success = qualified leads into CRM/LMS at low CAC.

## Success Criteria

- **Phase 1:** tool #1 (EMI) live, mobile-fast, ranking for target queries; chassis proven reusable (a 2nd tool added quickly on the same frame). `[ASSUMPTION]` concrete traffic/ranking targets TBD.
- **Phase 2:** measurable lead capture rate per tool; leads flowing into CRM/LMS; cross-promo click-through to Nirman products.
- **Ongoing:** time-to-add-a-new-tool stays low (drop-in), tool quality stays "wow" (not quantity-over-polish).

## Scope

**In (v1 / near-term, free, no paid API):**
1. **Home Loan / EMI calculator** (+ amortization schedule/chart) — tool #1, proves the chassis
2. **Area unit converter** (gaj / bigha / sq ft / sq yard / acre / hectare)
3. **Stamp duty + registration cost** (Rajasthan first)
4. **Vastu direction / score checker** (interactive grid + phone compass)
5. Fill over time: rent-vs-buy, rental yield, loan eligibility, brokerage, property tax

**Out (deferred):**
- AI/vision tools — **floor-plan photo → automatic vastu reading** and similar (need paid external APIs; revisit when revenue justifies)
- Hard lead gates / mandatory login in Phase 1
- The separate CRM/LMS product landing pages (existing, distinct — this hub *cross-promotes* them, does not replace them)

## Experience Principles (the "amazing UI" bar)

The UI is not decoration — it's the product. Non-negotiables, grounded in NN/g calculator guidance and the best Indian fintech tools (north star: emicalculator.net):

- **Live, no-gate results.** Recompute as the user types or drags — no submit button, no login wall. Slider + synced numeric input for every value.
- **Interpret, don't dump.** "You'll save ₹X in interest," not just raw numbers. Visualize (pie for principal-vs-interest, gauge for vastu score, line for balance decay).
- **Mobile-first.** Most users are on phones; amortization tables scroll/collapse gracefully.
- **Hyper-local correctness on display.** Show the state selector, the bigha value in use, the DLC-rate basis, and a date-stamp on rate-sensitive tools — the visible precision builds trust.
- **Shareable + downloadable.** Encode inputs in the URL; offer a PDF/print of the result — good UX and free virality.
- **Progressive disclosure.** Advanced inputs (prepayment, tax) stay hidden until wanted.

Full formulas, conversion tables, current Rajasthan rates, and open-source references are captured in `addendum.md` for the build.

## Vision

nirmanmedia.com becomes the default free toolbox for Indian real estate and vastu — starting Jaipur/Rajasthan, expanding state by state (each state's stamp duty = a new landing page and new traffic). The catalog grows to dozens of polished tools; the best free ones (AI vastu from a photo) arrive once funded. For the business, it matures into Nirman's primary owned lead engine — a compounding asset that turns everyday property math into a pipeline of qualified prospects.
