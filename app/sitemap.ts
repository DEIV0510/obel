import type { MetadataRoute } from "next";
import { sitio } from "@/config/sitio";
import { urlAbsoluta } from "@/lib/seo";

/** Una sola página pública indexable. Sin dominio definido no se publica. */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!sitio.dominio) return [];
  return [
    {
      url: urlAbsoluta("/"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
