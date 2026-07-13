# Addendum — Nirman Media Tools Hub

Downstream build detail (for PRD / architecture / dev). Sourced research, 2026-07-10. **Verify rate-sensitive values against official sources at build time and date-stamp them in the UI.**

## Tool chassis (reusable frame — build once)

Every tool is a self-contained module registered in a central catalog. Shared frame provides:
- Mobile-first tool UI + **live result card** (recompute on input/drag — NN/g: users prefer real-time output, no submit button)
- **Slider + synced numeric input** pairs (slider for feel, field for precision)
- Per-tool **SEO landing page**: dedicated URL (e.g. `/rajasthan-stamp-duty-calculator`), H1 = search intent, tool above the fold, then formula + worked example + FAQ (schema.org FAQ), city/state variants for local SEO
- **Result visualization** slot (pie / line / bar / gauge)
- **Share/download** slot: shareable URL with inputs encoded in query params + PDF/print of result — good UX *and* virality
- **Lead-capture slot** (Phase 2): soft "email/WhatsApp me this report" — never a gate
- **Cross-promo strip**: Nirman CRM/LMS + broker products
- Central **catalog**: add-a-tool = drop folder + register entry

UI north star: **emicalculator.net** (canonical Indian EMI UX). Guidance: NN/g "Design Recommendations for Calculator Tools"; contextualize outputs ("you save ₹X"), easy edit/reset, progressive disclosure for advanced inputs, careful regional defaults.

## Tool 1 — Home Loan / EMI calculator

Formula (Indian bank standard):
```
EMI = [P × R × (1+R)^N] / [(1+R)^N − 1]
R = annualRate / 12 / 100   ;   N = tenureMonths
```
- Inputs: principal, annual rate %, tenure (accept years → months). Sliders + fields.
- Outputs: monthly EMI, total interest, total payment, **amortization schedule** (opening bal, EMI, interest part, principal part, closing bal), pie (principal vs interest) + balance-decay line.
- India specifics: floating (repo/RLLR) is the norm → **estimate-only disclaimer**. **Prepayment / part-payment** optional input (penalty-free on floating individual loans per RBI) showing interest saved + tenure cut — **the differentiator**.
- Refs (cross-check only, no hard dep): cfpb/amortize (CC0), YuvarajSingh-0/EMI-Calculator (Next.js+Tailwind, matches stack).

## Tool 2 — Area unit converter

**Fixed constants (region-invariant), to sq ft:**
| Unit | sq ft | sq m |
|---|---|---|
| Gaj / sq yard | 9 | 0.8361 |
| sq metre | 10.7639 | 1 |
| Acre | 43,560 | 4,046.86 |
| Hectare | 107,639 | 10,000 |
| Cent (1/100 acre) | 435.6 | 40.47 |
| Guntha (1/40 acre) | 1,089 | 101.17 |
| Ground (TN) | 2,400 | 222.97 |

**Region-VARIABLE — must be a state selector, Rajasthan default, never hardcode:**
- **Bigha** — no national standard. Rajasthan commonly **9,680 sq ft**, but historical variants: Shahjahani/pucca **27,225 sq ft** (165×165), Gantari **17,424 sq ft**. UP pucca 27,225 / kaccha 9,070; Bengal 14,400.
- **Biswa** — Rajasthan: 1 bigha = 20 biswa → **~484 sq ft** (derives from chosen bigha).
- **Marla/Kanal** — N-India (not native to Rajasthan): marla ≈ 272.25 sq ft (25 sq yd), kanal = 20 marla ≈ 5,445 sq ft; ~225 sq ft marla exists in some districts.
- Implementation: bigha/biswa/marla/kanal = state-dependent w/ override; rest fixed. Encode as JSON tables (this data IS the IP; no mature npm pkg exists).
- Refs: bhumicalculator.com (Rajasthan), landvaluetools.com state chart, GitHub electron0zero/Hisabi, aritra363/landconverter.

## Tool 3 — Stamp duty + registration (Rajasthan)

2025–26 rates (multi-source, **verify vs official IGRS Rajasthan notification + date-stamp**):
- Stamp duty: **6% male/joint**, **5% sole female**, **4% female SC/ST/BPL**
- **Labour cess: 20% of the stamp-duty amount** (on the duty, not the value)
- Registration: **flat 1%**
- Base: **higher of transaction value or DLC (District Level Committee) rate** — the govt-notified minimum per-area value; cannot compute below it.
- Worked (male, ₹50L): duty 6% = ₹3,00,000 + cess ₹60,000 + reg ₹50,000 → all-in ≈ 8.2% (female ≈ 7%).
- Refs: homefirstindia.com, 1acre.in/stamp-duty-calculator/rajasthan, godrejcapital.com.

## Tool 4 — Vastu direction / score (no AI, deterministic)

Pure lookup table + weighted average — no API.
- 8-dir compass (extend 16): N, NE(water/Ishanya, most sacred), E, SE(fire/Agni), S, SW(earth/stability), W, NW(air).
- Ideal room-direction rulebook: Kitchen→SE, Pooja→NE, Master bedroom→SW, Toilets→NW/W (avoid NE/SE/center), Main door→N/E/NE.
- Scoring (per HexaHome/ganak.app): inputs = house-facing dir + each room's location; each room scored 0–10 vs ideal; aggregate to **0–100** with per-room compliant/defect flags + remedy text. Output: gauge + per-room list.
- Encode rule table as JSON. **No prominent OSS vastu-scorer exists → differentiator.**
- Refs: hexahome.in vastu-score, ganak.app, subhavaastu.com, 99pandit.com 16-direction guide.

## Build-time flags
1. Bigha ≠ constant — state selector, RJ default, never hardcode.
2. Stamp-duty rates shift with state budgets — verify official + date-stamp.
3. EMI floating disclaimer; prepayment modeling = differentiator.
4. Vastu = deterministic JSON lookup, not AI.
