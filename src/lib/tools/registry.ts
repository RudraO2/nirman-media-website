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
    phase: 1,
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
    phase: 1,
  },
  {
    slug: "rent-vs-buy",
    title: "Rent vs. Buy Calculator",
    category: "finance",
    oneLiner:
      "See whether renting or buying wins for your numbers — with a clear breakeven year, not just a wall of totals.",
    seo: {
      h1: "Rent vs. Buy Calculator",
      description:
        "Compare the true long-term cost of renting versus buying a home in India — EMI, property tax, maintenance and resale equity against rent and the return you'd earn investing what you save. Get a plain breakeven year, not just numbers.",
      faq: [
        {
          q: "Is buying always better than renting long-term?",
          a: "No — it depends entirely on the inputs you give it: home appreciation, rent growth, and the return you'd earn investing what buying doesn't cost you. This tool runs the math on your own numbers rather than assuming an answer either way.",
        },
        {
          q: "Why can renting-and-investing beat buying in the math, even over many years?",
          a: "Indian residential rental yields are typically low — annual rent is often only around 2–3.5% of a property's value — so the money you don't put into a down payment and EMI can compound faster than the home appreciates, in some scenarios. Adjust the assumptions to your own city and property to see how it changes for you.",
        },
      ],
    },
    related: ["emi"],
    phase: 1,
  },
  {
    slug: "rental-yield",
    title: "Rental Yield Calculator",
    category: "finance",
    oneLiner:
      "See your property's real rental yield — gross, net after real running costs, and cash-on-cash return if you're financing it.",
    seo: {
      h1: "Rental Yield Calculator",
      description:
        "Calculate gross and net rental yield on an Indian property — factoring in property tax, maintenance, society charges and vacancy — plus cash-on-cash return if you finance it with a home loan. See how your number compares to India's typical rental yield range.",
      faq: [
        {
          q: "What's the difference between gross and net rental yield?",
          a: "Gross yield is simply annual rent divided by property price. Net yield subtracts the real annual running costs — property tax, maintenance, society charges, and a vacancy allowance — before dividing, so it reflects what an owner actually keeps. Net yield is always lower than gross, and it's the more honest number for comparing an income property.",
        },
        {
          q: "Why are Indian residential rental yields so low?",
          a: "Gross yields of roughly 2–3.5% are commonly cited for Indian residential property — an informal, widely-varying market figure, not an official statistic. Compare your own number above and adjust the city- and property-specific assumptions to see how it changes for you.",
        },
      ],
    },
    related: ["emi", "rent-vs-buy"],
    phase: 1,
  },
  {
    slug: "loan-eligibility",
    title: "Loan Eligibility Calculator",
    category: "finance",
    oneLiner:
      "Find out how large a home loan your income can realistically support, before you apply.",
    seo: {
      h1: "Loan Eligibility Calculator",
      description:
        "Estimate the maximum home loan your net monthly income supports, using the standard FOIR (Fixed Obligation to Income Ratio) method lenders use — factoring in your existing EMIs, interest rate and tenure.",
      faq: [
        {
          q: "How much home loan can I get based on my salary?",
          a: "Lenders typically cap your total EMI obligations — this loan plus any existing ones — at a percentage of your net monthly income, commonly called FOIR (Fixed Obligation to Income Ratio), usually 40–50% depending on the bank and your income band. This calculator applies your own FOIR assumption to your income and existing EMIs, then works out the loan amount that fits in the remaining gap at your chosen rate and tenure.",
        },
        {
          q: "Is this the exact amount a bank will approve?",
          a: "No — it's an estimate using the standard FOIR method. Actual sanction also depends on your credit score, employment type, co-applicant income, age-based tenure caps, and each lender's specific policy. Treat this as a starting estimate for what to shop for, not a loan offer.",
        },
      ],
    },
    related: ["emi", "rent-vs-buy"],
    phase: 1,
  },
  {
    slug: "brokerage",
    title: "Brokerage Calculator",
    category: "finance",
    oneLiner:
      "Work out the brokerage due on a sale or rental deal — with GST, the way brokers actually quote it.",
    seo: {
      h1: "Brokerage Calculator",
      description:
        "Calculate real estate brokerage on a sale (typically 1–2% of property value) or rental deal (typically one month's rent), with an optional 18% GST — built for Indian brokers and clients who want the number before the deal closes.",
      faq: [
        {
          q: "How much brokerage do real estate agents charge in India?",
          a: "It's negotiated, not fixed by law — but common market practice is roughly 1–2% of the property value on a sale, and one month's rent (sometimes half a month) on a rental. This calculator uses those conventions as adjustable defaults, not statutory rates.",
        },
        {
          q: "Does GST apply to real estate brokerage?",
          a: "Yes, at 18%, but only when the broker or firm is GST-registered. Toggle it off if yours isn't.",
        },
      ],
    },
    related: ["emi", "rental-yield"],
    phase: 1,
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
