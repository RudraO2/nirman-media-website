# Cross-posting blogs to Medium/LinkedIn — canonical setup

Goal: original credit stays with nirman.media in Google + AI answers (ChatGPT, Perplexity, etc), even when the same article also lives on Medium or LinkedIn.

## Rule
Every syndicated copy MUST set its canonical URL to the nirman.media original. Never let the copy self-canonicalize — that splits ranking signal and can cause the copy to outrank the original.

## Per-platform steps

### Medium
1. Import via Medium's "Import a story" tool (Settings → Stories → Import), pasting the nirman.media URL. Medium auto-sets `rel=canonical` to the source. This is the preferred method — don't paste-and-retype.
2. If pasting manually instead: after publishing, open Story settings → "Change canonical URL" → paste the exact nirman.media URL (with trailing slash, matches sitemap.ts).

### LinkedIn Articles
LinkedIn has no canonical field. Mitigate by:
- Publishing the nirman.media version first, waiting for it to get indexed (a few days) before syndicating.
- Adding a first line: "Originally published at [nirman.media/blog/slug]" with the link.

### Any other platform (Dev.to, Hashnode, etc.)
Same rule — if a canonical URL field exists, use it. If not, add the "originally published at" line + link, first paragraph.

## URL reference table
Use the exact URL (canonical, from `alternates.canonical` in `src/app/blog/[slug]/page.tsx`, resolved against `https://nirman.media`):

| Slug | Canonical URL |
|---|---|
| real-estate-videography-jaipur | https://nirman.media/blog/real-estate-videography-jaipur/ |
| hotel-photography-that-fills-rooms | https://nirman.media/blog/hotel-photography-that-fills-rooms/ |
| 3d-scrollytelling-tours-explained | https://nirman.media/blog/3d-scrollytelling-tours-explained/ |
| restaurant-photography-jaipur-guide | https://nirman.media/blog/restaurant-photography-jaipur-guide/ |
| best-localities-to-buy-flat-in-jaipur | https://nirman.media/blog/best-localities-to-buy-flat-in-jaipur/ |
| jaipur-me-flat-kharidne-ke-best-ilake | https://nirman.media/blog/jaipur-me-flat-kharidne-ke-best-ilake/ |
| how-to-buy-flat-in-jaipur-step-by-step | https://nirman.media/blog/how-to-buy-flat-in-jaipur-step-by-step/ |
| jaipur-me-flat-kaise-kharide | https://nirman.media/blog/jaipur-me-flat-kaise-kharide/ |

Adding a new post later: canonical is always `https://nirman.media/blog/<slug>/` — matches `sitemap.ts` and `generateMetadata` in the post page.

## Author attribution
All posts now carry:
- Visible byline "By Nirvan" on the article page.
- `Person` schema (`name: "Nirvan"`) as `author` in the Article JSON-LD (`src/app/blog/[slug]/page.tsx`).
- Site-wide `Person`/`Organization` graph in `src/app/layout.tsx`, linked via `founder: {"@id": ".../#founder"}`.

When cross-posting, set the Medium/LinkedIn author bio to mention "Nirvan, Nirman Media" and link back to nirman.media — this reinforces the same entity to AI crawlers (ChatGPT, Perplexity) doing entity resolution.

## sameAs profile links (update once real accounts exist)
`src/lib/site.ts` → `founder.sameAs` currently holds placeholders:
```
https://medium.com/@nirman-media
https://www.linkedin.com/company/nirman-media
```
Replace with real URLs once created — this feeds both the Organization and Person `sameAs` arrays in the homepage JSON-LD, which is what lets Google/ChatGPT tie "Nirvan" and "Nirman Media" to one entity across platforms.
