import type { MetadataRoute } from "next";
import { site } from "@/content/course";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const now = new Date();

  const pages: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/course", priority: 0.9 },
    { path: "/diagnostic", priority: 0.8 },
    { path: "/about", priority: 0.6 },
    { path: "/faq", priority: 0.6 },
    { path: "/waitlist", priority: 0.4 },
  ];

  return pages.map((p) => ({
    url: `${base}${p.path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: p.priority,
  }));
}
