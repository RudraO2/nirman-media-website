import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";
import { industries } from "@/lib/industries";
import { posts } from "@/lib/blog";
import { liveTools } from "@/lib/tools/registry";

const base = "https://nirman.media";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/work/`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/industries/`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/services/`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/pricing/`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/blog/`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/about/`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${base}/tools/`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...liveTools.map((t) => ({
      url: `${base}/tools/${t.slug}/`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...industries.map((i) => ({
      url: `${base}/industries/${i.slug}/`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...posts.map((p) => ({
      url: `${base}/blog/${p.slug}/`,
      lastModified: new Date(p.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...projects.map((p) => ({
      url: `${base}/work/${p.slug}/`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
