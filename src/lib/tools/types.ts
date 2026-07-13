// Pure metadata types for the tool registry (AD-2). No React here — this module
// is imported by the sitemap, the /tools index, and cross-promo, none of which
// should pull in client code.

export type ToolCategory = "finance" | "land" | "vastu" | "legal";

export type FaqItem = { q: string; a: string };

export type ToolMeta = {
  /** kebab-case, unique, stable — this is the route, the folder, and the registry key */
  slug: string;
  /** short title for nav/cards */
  title: string;
  category: ToolCategory;
  /** one-line pitch for cards + og description fallback */
  oneLiner: string;
  seo: {
    h1: string;
    description: string;
    faq: FaqItem[];
  };
  /** slugs of related tools (cross-linking); may be empty */
  related: string[];
  /** 1 = live now, 2 = planned (kept out of the index until built) */
  phase: 1 | 2;
};
