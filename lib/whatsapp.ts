import { sitio } from "@/config/sitio";

/** Número en formato internacional, solo dígitos: «573154643733». */
export function numeroWhatsapp(numero: string = sitio.whatsapp.numero): string {
  return numero.replace(/\D/g, "");
}

/** «+57 315 464 3733» a partir de cualquier formato de entrada. */
export function numeroVisible(numero: string = sitio.whatsapp.numero): string {
  const n = numeroWhatsapp(numero);
  const m = /^57(\d{3})(\d{3})(\d{4})$/.exec(n);
  return m ? `+57 ${m[1]} ${m[2]} ${m[3]}` : `+${n}`;
}

/**
 * Enlace universal de WhatsApp (abre la app en móviles y WhatsApp Web o la
 * aplicación de escritorio en computadores) con el mensaje codificado.
 */
export function enlaceWhatsapp(mensaje?: string, numero: string = sitio.whatsapp.numero): string {
  const base = `https://wa.me/${numeroWhatsapp(numero)}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}

/** Mensajes iniciales por contexto (textos definidos por la empresa). */
export const mensajes = {
  general:
    "Hola, estoy interesado en conocer los servicios de OBEL Colombia y quisiera recibir información.",
  prediagnostico:
    "Hola, quisiera solicitar un prediagnóstico inicial con OBEL Colombia para conversar sobre un proyecto o necesidad de mi organización.",
  formulacion:
    "Hola, estoy interesado en los servicios de formulación y gestión de proyectos de OBEL Colombia.",
  planeacion:
    "Hola, quisiera conocer cómo OBEL Colombia puede ayudarme con la planeación estratégica de mi organización.",
  marketing:
    "Hola, quisiera recibir información sobre los servicios de marketing y crecimiento comercial de OBEL Colombia.",
  comunicacion: "Hola, quisiera conocer los servicios de comunicación digital de OBEL Colombia.",
} as const;
