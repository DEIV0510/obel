import { sitio } from "@/config/sitio";
import { servicios } from "@/content/servicios";
import { numeroVisible } from "@/lib/whatsapp";

export const tituloSitio = "OBEL Colombia · Consultoría de proyectos y estrategia en Cali";

export const descripcionSitio =
  "Consultoría en Cali para formular y gestionar proyectos, planeación estratégica, marketing y comunicación digital. Emprendimientos, empresas, ONG y gobierno.";

/** Open Graph común (la portada le añade su URL canónica). */
export const openGraphBase = {
  type: "website",
  locale: "es_CO",
  siteName: sitio.marca,
  title: tituloSitio,
  description: descripcionSitio,
} as const;

/** URL absoluta a partir de una ruta; vacía si aún no hay dominio definido. */
export function urlAbsoluta(ruta = "/"): string {
  return sitio.dominio ? `${sitio.dominio}${ruta === "/" ? "/" : ruta}` : "";
}

/** Dirección postal en una línea, tal como la confirmó la empresa. */
export function direccionCompleta(): string {
  const d = sitio.direccion;
  return `${d.calle}, barrio ${d.barrio}, ${d.ciudad}, ${d.pais}`;
}

export function enlaceMapa(): string {
  const d = sitio.direccion;
  const consulta = `${d.calle}, ${d.barrio}, ${d.ciudad}, ${d.departamento}, ${d.pais}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(consulta)}`;
}

/**
 * Datos estructurados (schema.org) con información verificada únicamente:
 * sin valoraciones, horarios ni datos que la empresa no haya confirmado.
 */
export function datosEstructurados() {
  const url = urlAbsoluta("/");
  const d = sitio.direccion;
  const redes = sitio.redes.filter((r) => r.url).map((r) => r.url);

  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    ...(url ? { "@id": `${url}#organizacion`, url } : {}),
    name: sitio.marca,
    alternateName: sitio.marcaCorta,
    description: sitio.descripcion,
    foundingDate: String(sitio.fundacion),
    ...(url
      ? {
          logo: urlAbsoluta("/marca/obel-logotipo.png"),
          image: urlAbsoluta("/opengraph-image"),
        }
      : {}),
    telephone: numeroVisible().replace(/\s/g, ""),
    address: {
      "@type": "PostalAddress",
      streetAddress: `${d.calle}, ${d.barrio}`,
      addressLocality: d.ciudad,
      addressRegion: d.departamento,
      addressCountry: d.paisCodigo,
    },
    areaServed: { "@type": "Country", name: d.pais },
    ...(redes.length ? { sameAs: redes } : {}),
    knowsAbout: [
      "Consultoría empresarial",
      "Formulación de proyectos",
      "Gestión de proyectos",
      "Marco lógico",
      "Estudios de factibilidad",
      "Planes de negocio",
      "Planeación estratégica",
      "Marketing",
      "Comunicación digital",
      "Desarrollo organizacional",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Líneas de servicio",
      itemListElement: servicios.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.titulo,
          description: s.descripcion,
        },
      })),
    },
  };
}

/** Serializa JSON-LD de forma segura para incrustarlo en un <script>. */
export function jsonLd(datos: unknown): string {
  return JSON.stringify(datos).replace(/</g, "\\u003c");
}
