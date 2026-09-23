import type { MetadataRoute } from "next";
import { site } from "@/content/course";
import { isIndexable } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  // Pre-launch and preview builds are closed to crawlers entirely.
  if (!isIndexable()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Transactional, private and unreviewed pages stay out of the index.
      disallow: ["/api/", "/enrol", "/enrol/success", "/learn", "/legal/"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
