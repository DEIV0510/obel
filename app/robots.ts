import type { MetadataRoute } from "next";
import { sitio } from "@/config/sitio";
import { urlAbsoluta } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/solicitud/"] },
    ...(sitio.dominio ? { sitemap: urlAbsoluta("/sitemap.xml"), host: sitio.dominio } : {}),
  };
}
