import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://www.grannyonthegoadventures.com/", changeFrequency: "monthly", priority: 1 }];
}
