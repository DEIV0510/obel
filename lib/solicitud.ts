/**
 * Modelo y validación de la solicitud de prediagnóstico. Se usa igual en el
 * navegador (mensajes inmediatos) y en el servidor (validación definitiva).
 */

export const TIPOS_ORGANIZACION = [
  "Emprendimiento",
  "Empresa",
  "Organización social",
  "ONG",
  "Entidad gubernamental",
  "Otro",
] as const;

export const SERVICIOS_INTERES = [
  { valor: "formulacion", etiqueta: "Formulación y gestión de proyectos" },
  { valor: "planeacion", etiqueta: "Planeación estratégica" },
  { valor: "marketing", etiqueta: "Marketing y crecimiento comercial" },
  { valor: "comunicacion", etiqueta: "Comunicación digital" },
  { valor: "orientacion", etiqueta: "No estoy seguro; necesito orientación" },
] as const;

export type TipoOrganizacion = (typeof TIPOS_ORGANIZACION)[number];
export type ValorServicio = (typeof SERVICIOS_INTERES)[number]["valor"];

export interface Solicitud {
  nombre: string;
  organizacion: string;
  correo: string;
  whatsapp: string;
  tipo: string;
  servicio: string;
  descripcion: string;
  autorizacion: boolean;
}

export type CampoSolicitud = keyof Solicitud;
export type Errores = Partial<Record<CampoSolicitud, string>>;

export const LIMITES = {
  nombre: 120,
  organizacion: 160,
  correo: 160,
  whatsapp: 24,
  descripcionMin: 20,
  descripcion: 1200,
} as const;

/** Orden de los campos (enfoque del primer error). */
export const ORDEN_CAMPOS: CampoSolicitud[] = [
  "nombre",
  "organizacion",
  "correo",
  "whatsapp",
  "tipo",
  "servicio",
  "descripcion",
  "autorizacion",
];

function texto(valor: unknown, max: number): string {
  if (typeof valor !== "string") return "";
  // Quita caracteres de control (excepto saltos de línea) y espacios sobrantes.
  const limpio = valor.replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, "").trim();
  return limpio.slice(0, max + 1);
}

function linea(valor: unknown, max: number): string {
  return texto(valor, max).replace(/\s+/g, " ");
}

/** Normaliza una entrada desconocida (JSON o formulario) a una Solicitud. */
export function normalizar(entrada: Record<string, unknown>): Solicitud {
  const autorizacion = entrada.autorizacion;
  return {
    nombre: linea(entrada.nombre, LIMITES.nombre),
    organizacion: linea(entrada.organizacion, LIMITES.organizacion),
    correo: linea(entrada.correo, LIMITES.correo).toLowerCase(),
    whatsapp: linea(entrada.whatsapp, LIMITES.whatsapp),
    tipo: linea(entrada.tipo, 60),
    servicio: linea(entrada.servicio, 40),
    descripcion: texto(entrada.descripcion, LIMITES.descripcion).replace(/\n{3,}/g, "\n\n"),
    autorizacion: autorizacion === true || autorizacion === "true" || autorizacion === "on" || autorizacion === "si",
  };
}

const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TELEFONO_PERMITIDO = /^[+\d\s().-]+$/;

export function validarCampo(campo: CampoSolicitud, s: Solicitud): string | undefined {
  switch (campo) {
    case "nombre":
      if (!s.nombre) return "Escribe tu nombre completo.";
      if (s.nombre.length < 3) return "El nombre parece incompleto.";
      if (s.nombre.length > LIMITES.nombre) return `Usa máximo ${LIMITES.nombre} caracteres.`;
      return;
    case "organizacion":
      if (s.organizacion.length > LIMITES.organizacion) return `Usa máximo ${LIMITES.organizacion} caracteres.`;
      return;
    case "correo":
      if (!s.correo) return "Escribe tu correo electrónico.";
      if (s.correo.length > LIMITES.correo || !CORREO.test(s.correo))
        return "Revisa el correo; debe tener la forma nombre@dominio.com.";
      return;
    case "whatsapp": {
      if (!s.whatsapp) return "Escribe tu número de WhatsApp.";
      const digitos = s.whatsapp.replace(/\D/g, "");
      if (!TELEFONO_PERMITIDO.test(s.whatsapp) || digitos.length < 7 || digitos.length > 15)
        return "Revisa el número; usa solo dígitos y, si no es de Colombia, el indicativo del país.";
      return;
    }
    case "tipo":
      if (!(TIPOS_ORGANIZACION as readonly string[]).includes(s.tipo)) return "Selecciona el tipo de organización.";
      return;
    case "servicio":
      if (!SERVICIOS_INTERES.some((x) => x.valor === s.servicio))
        return "Selecciona un servicio o la opción de orientación.";
      return;
    case "descripcion":
      if (!s.descripcion) return "Cuéntanos brevemente qué necesitas.";
      if (s.descripcion.length < LIMITES.descripcionMin)
        return `Agrega un poco más de contexto (mínimo ${LIMITES.descripcionMin} caracteres).`;
      if (s.descripcion.length > LIMITES.descripcion) return `Usa máximo ${LIMITES.descripcion} caracteres.`;
      return;
    case "autorizacion":
      if (!s.autorizacion) return "Necesitamos tu autorización para usar estos datos y responderte.";
      return;
  }
}

export function validar(s: Solicitud): Errores {
  const errores: Errores = {};
  for (const campo of ORDEN_CAMPOS) {
    const error = validarCampo(campo, s);
    if (error) errores[campo] = error;
  }
  return errores;
}

export function etiquetaServicio(valor: string): string {
  return SERVICIOS_INTERES.find((x) => x.valor === valor)?.etiqueta ?? valor;
}

/**
 * Mensaje de WhatsApp con los datos que la persona decidió compartir. Se
 * muestra completo antes de abrir WhatsApp.
 */
export function mensajeWhatsappSolicitud(s: Solicitud): string {
  const datos = [
    ["Nombre", s.nombre],
    ["Organización", s.organizacion],
    ["Tipo de organización", s.tipo],
    ["Servicio de interés", s.servicio ? etiquetaServicio(s.servicio) : ""],
    ["Correo", s.correo],
  ]
    .filter(([, valor]) => valor)
    .map(([campo, valor]) => `${campo}: ${valor}`);
  const partes = ["Hola, quisiera solicitar un prediagnóstico inicial con OBEL Colombia.", datos.join("\n")];
  if (s.descripcion) partes.push(`Necesidad: ${s.descripcion}`);
  return partes.filter(Boolean).join("\n\n");
}
