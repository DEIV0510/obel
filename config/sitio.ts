/**
 * ─────────────────────────────────────────────────────────────
 *  CONFIGURACIÓN CENTRAL DE OBEL COLOMBIA
 * ─────────────────────────────────────────────────────────────
 *  Datos confirmados por la empresa (brief del sitio) y por su
 *  portafolio de servicios 2026. Ningún dato aquí debe inventarse:
 *  lo que esté vacío ("") simplemente no se muestra en la web.
 *
 *  Variables de entorno opcionales (tienen prioridad):
 *    NEXT_PUBLIC_SITE_URL   Dominio definitivo, p. ej. https://obelcolombia.com
 *    NEXT_PUBLIC_WHATSAPP   Otro número en formato internacional, p. ej. +57 315 464 3733
 */

export type RedSocial = "facebook" | "instagram" | "x" | "linkedin";

export interface PerfilSocial {
  red: RedSocial;
  nombre: string;
  usuario: string;
  /**
   * URL exacta del perfil. Solo se enlaza cuando está verificada; vacía =
   * dato pendiente (se muestra el usuario sin enlace).
   */
  url: string;
}

/**
 * Dominio público. En Vercel, si no se define NEXT_PUBLIC_SITE_URL, se usa el
 * dominio de producción del proyecto (variable de sistema de Vercel).
 */
function dominioPublico(): string {
  const propio = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (propio) return propio.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  return vercel ? `https://${vercel.replace(/\/+$/, "")}` : "";
}

export const sitio = {
  marca: "OBEL Colombia",
  marcaCorta: "OBEL",
  /** Año de origen documentado en el portafolio («2018 – Origen»). */
  fundacion: 2018,

  descripcion:
    "Firma consultora de Santiago de Cali que transforma ideas y oportunidades en proyectos estructurados, financiables y comercialmente viables.",

  dominio: dominioPublico(),

  direccion: {
    calle: "Carrera 79 # 14 C - 94",
    barrio: "Prados de Limonar",
    ciudad: "Santiago de Cali",
    departamento: "Valle del Cauca",
    pais: "Colombia",
    paisCodigo: "CO",
  },

  /** Persona de contacto que figura en el portafolio. */
  contacto: "Oscar Belalcázar",

  whatsapp: {
    /** Número oficial. Se normaliza a solo dígitos para construir los enlaces. */
    numero: process.env.NEXT_PUBLIC_WHATSAPP || "+57 315 464 3733",
  },

  /**
   * Verificadas el 2026-10-21: Facebook y X muestran el nombre OBEL Colombia,
   * Santiago de Cali y la misma descripción de servicios; Instagram coincide
   * en nombre y usuario. LinkedIn bloquea las consultas sin sesión y no se
   * encontró la URL exacta: PENDIENTE (pega aquí la URL confirmada).
   */
  redes: [
    { red: "facebook", nombre: "Facebook", usuario: "@ObelColombia", url: "https://www.facebook.com/obelcolombia/" },
    { red: "instagram", nombre: "Instagram", usuario: "@ObelColombia", url: "https://www.instagram.com/obelcolombia/" },
    { red: "x", nombre: "X", usuario: "@ObelColombia", url: "https://x.com/ObelColombia" },
    { red: "linkedin", nombre: "LinkedIn", usuario: "@ObelColombia", url: "" },
  ] satisfies PerfilSocial[] as PerfilSocial[],

  /**
   * PENDIENTE: URL de la política de tratamiento de datos personales
   * (Ley 1581 de 2012). Mientras esté vacía, el formulario pide la
   * autorización sin enlace y el pie no muestra el vínculo.
   */
  politicaDatosUrl: "",
} as const;
