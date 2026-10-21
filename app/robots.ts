import type { MetadataRoute } from "next";
import { sitio } from "@/config/sitio";
import { urlAbsoluta } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    // Las páginas de /solicitud llevan noindex: deben poder rastrearse para que se lea.
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    ...(sitio.dominio ? { sitemap: urlAbsoluta("/sitemap.xml"), host: sitio.dominio } : {}),
  };
}
