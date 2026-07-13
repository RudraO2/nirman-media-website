import type { ToolMeta } from "./types";

// The single source of truth for every tool (AD-2). The route, the /tools index,
// the sitemap, and cross-promo all derive from this array — adding a tool means
// adding one entry here (+ its module + its UI), never hand-editing routing.
// Mirrors the shape of src/lib/industries.ts.

export const tools: ToolMeta[] = [
  {
    slug: "emi",
    title: "Home Loan EMI Calculator",
    category: "finance",
    oneLiner:
      "Find your exact monthly EMI, total interest, and how much a prepayment saves you.",
    seo: {
      h1: "Home Loan EMI Calculator",
      description:
        "Calculate your home loan EMI instantly. See total interest, a full amortization schedule, and exactly how much time and interest a prepayment saves — built for Indian home buyers in Jaipur & Rajasthan.",
      faq: [
        {
          q: "How is home loan EMI calculated?",
          a: "EMI = [P × R × (1+R)^N] / [(1+R)^N − 1], where P is the loan amount, R is the monthly interest rate (annual rate ÷ 12 ÷ 100), and N is the tenure in months. This calculator applies that formula and builds the full month-by-month schedule.",
        },
        {
          q: "Does prepayment reduce my home loan interest?",
          a: "Yes. On floating-rate home loans to individuals, prepayment and part-payment carry no penalty (per RBI). Paying extra reduces your outstanding principal, which cuts both your total interest and your tenure. Use the 'Add prepayment' option to see your exact saving.",
        },
        {
          q: "Is the EMI fixed for the whole loan?",
          a: "Most Indian home loans are floating-rate (linked to the repo rate / RLLR), so the rate — and therefore the EMI or tenure — can change when the benchmark changes. This calculator gives an accurate estimate at the rate you enter.",
        },
      ],
    },
    related: ["area-converter"],
    phase: 1,
  },
  {
    slug: "area-converter",
    title: "Area Unit Converter",
    category: "land",
    oneLiner:
      "Convert gaj, bigha, biswa, acre and more — with a Rajasthan-correct bigha, not a generic national average.",
    seo: {
      h1: "Area Unit Converter",
      description:
        "Convert between gaj, bigha, biswa, acre, hectare and more. Region-correct bigha/biswa values by state — Rajasthan default — because bigha has no single national standard.",
      faq: [
        {
          q: "Is 1 bigha the same everywhere in India?",
          a: "No. Bigha has no national standard — Rajasthan commonly uses ~9,680 sq ft, but historical variants (Shahjahani ~27,225 sq ft, Gantari ~17,424 sq ft) exist, and other states differ again (UP, Bengal, etc.). This tool uses a state selector so you convert against the right local value, not a generic average.",
        },
      ],
    },
    related: ["emi"],
    phase: 2,
  },
  {
    slug: "stamp-duty-rj",
    title: "Rajasthan Stamp Duty Calculator",
    category: "legal",
    oneLiner:
      "Estimate stamp duty, labour cess and registration cost on a Rajasthan property purchase.",
    seo: {
      h1: "Rajasthan Stamp Duty & Registration Calculator",
      description:
        "Estimate stamp duty, labour cess and registration charges for a property purchase in Rajasthan — rates vary by buyer category (male/joint, sole female, SC/ST/BPL female) and are computed on the higher of transaction value or DLC rate.",
      faq: [
        {
          q: "How is stamp duty calculated in Rajasthan?",
          a: "On the higher of the transaction value or the government-notified DLC (District Level Committee) rate for that area. Duty is typically 6% for male/joint buyers, 5% for a sole female buyer, and 4% for SC/ST/BPL female buyers, plus a labour cess of 20% of the duty amount and 1% flat registration. Rates shift with state budgets, so this tool date-stamps the rate it uses.",
        },
      ],
    },
    related: ["emi", "area-converter"],
    phase: 2,
  },
  {
    slug: "vastu-score",
    title: "Vastu Score Checker",
    category: "vastu",
    oneLiner:
      "Score your home's vastu room-by-room against the traditional direction rulebook — no photo, no AI, just the rules.",
    seo: {
      h1: "Vastu Score Checker",
      description:
        "Check your home's vastu compliance: enter your house facing and each room's location, get a 0–100 score with per-room compliant/defect flags and remedies — a deterministic rulebook lookup, free.",
      faq: [
        {
          q: "How does the vastu score get calculated?",
          a: "It's a deterministic lookup against the traditional room-direction rulebook — for example kitchen ideally in the south-east (Agni), pooja room in the north-east (Ishanya), master bedroom in the south-west, toilets avoiding the north-east. Each room you place is scored against its ideal direction and the scores aggregate to 0–100. No AI, no photo upload — just the rules, transparently applied.",
        },
      ],
    },
    related: ["area-converter"],
    phase: 2,
  },
];

export const toolBySlug = (slug: string) => tools.find((t) => t.slug === slug);

/** Tools that are live (phase 1) — what the index and sitemap actually list. */
export const liveTools = tools.filter((t) => t.phase === 1);

/** Tools announced but not yet built (phase 2) — shown on the hub as "coming
 * soon" so the catalog reads as a growing system, never listed in the sitemap. */
export const plannedTools = tools.filter((t) => t.phase === 2);
