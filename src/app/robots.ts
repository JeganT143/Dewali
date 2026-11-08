import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// /card is not disallowed here: link-preview crawlers must be able to fetch it.
// Personal cards are kept out of search results with a noindex meta tag instead.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
