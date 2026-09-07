# Deferred SEO work — needs you, not an agent

Everything an agent could safely do (seo-audit, schema, ai-seo, site-architecture skills) is done. These items need real data or a decision only you can make.

## 1. Founder identity on About page
`src/app/about/page.tsx` team array has placeholder names (`"—"`) for all 4 roles, including "Founder · Director". Meanwhile `src/lib/site.ts` now has `founder.name = "Nirvan"` wired into schema sitewide. These aren't connected.
- If Nirvan is the founder: update the team array's name field, or decide if real names should be public at all.
- If team names stay private: leave as-is, no action needed.

## 2. Real Google review count for AggregateRating
Site shows "4.9★ Google rating" in UI (`trustStats` in `site.ts`) but no schema backs it — deliberately skipped adding fake reviewCount (Google penalizes fabricated review schema). Give me the actual review count and I'll add `AggregateRating` to the ProfessionalService schema in `layout.tsx`.

## 3. Real Medium/LinkedIn profile URLs
`src/lib/site.ts` → `founder.sameAs` has placeholder URLs:
```
https://medium.com/@nirman-media
https://www.linkedin.com/company/nirman-media
```
Once real profiles exist, swap them in — this is what actually ties "Nirvan, Nirman Media" together as one entity for Google/ChatGPT/Perplexity.

## 4. Core Web Vitals / PageSpeed
seo-audit skill flags this as priority-2 (technical foundations). Needs either:
- Chrome DevTools MCP (`mcp__chrome-devtools__performance_start_trace` / `lighthouse_audit`) against the live/staging site, or
- Manual run through PageSpeed Insights / WebPageTest once deployed.
Not done — needs a running deployed instance, not just source review.

## 5. Search Console / indexation check
Can't check actual Google indexation status, crawl errors, or Core Web Vitals field data without Search Console access. If you have it connected, share access or paste the Coverage report and I'll act on real findings instead of guessing.

## 6. Cross-posting to Medium/LinkedIn (syndication)
Covered in `docs/syndication-guide.md` already — the canonical-URL setup steps are ready, but actually publishing to Medium/LinkedIn is on you (or tell me to draft the cross-post copy per article).

## 7. AI visibility baseline
ai-seo skill's monitoring section wants a baseline: run your top 10-20 queries through ChatGPT/Perplexity/Google AI Overview and log who's cited. No tool access to do that from here — DIY spreadsheet check or a paid tool (Otterly, Peec AI) is the next step.
