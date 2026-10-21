import { mensajes } from "@/lib/whatsapp";

export type IdServicio = "formulacion" | "planeacion" | "marketing" | "comunicacion";

/** Color de la línea de servicio, tal como la codifica el portafolio. */
export type ColorServicio = "azul" | "rojo" | "verde" | "amarillo";

export interface Servicio {
  id: IdServicio;
  numero: string;
  titulo: string;
  /** Nombre corto para índices y navegación. */
  corto: string;
  color: ColorServicio;
  descripcion: string;
  capacidades: string[];
  cta: string;
  mensaje: string;
}

/** Las cuatro líneas de servicio de OBEL Colombia (portafolio 2026). */
export const servicios: Servicio[] = [
  {
    id: "formulacion",
    numero: "01",
    titulo: "Formulación y gestión de proyectos",
    corto: "Proyectos",
    color: "azul",
    descripcion:
      "Estructuramos ideas y oportunidades para convertirlas en proyectos claros, viables y orientados a resultados.",
    capacidades: [
      "Estructuración y formulación de proyectos",
      "Gestión y seguimiento",
      "Marco lógico",
      "Planes de negocio",
      "Estudios de factibilidad",
    ],
    cta: "Quiero estructurar mi proyecto",
    mensaje: mensajes.formulacion,
  },
  {
    id: "planeacion",
    numero: "02",
    titulo: "Planeación estratégica",
    corto: "Planeación",
    color: "rojo",
    descripcion:
      "Ayudamos a las organizaciones a definir su rumbo, establecer prioridades y convertir sus objetivos en planes de acción.",
    capacidades: [
      "Planeación estratégica",
      "Planeación táctica",
      "Planeación operativa",
      "Definición de objetivos y prioridades",
    ],
    cta: "Quiero planificar mi crecimiento",
    mensaje: mensajes.planeacion,
  },
  {
    id: "marketing",
    numero: "03",
    titulo: "Marketing y crecimiento comercial",
    corto: "Marketing",
    color: "verde",
    descripcion:
      "Desarrollamos estrategias para fortalecer marcas, mejorar su posicionamiento y generar oportunidades comerciales.",
    capacidades: [
      "Desarrollo y fortalecimiento de marca",
      "Posicionamiento",
      "Estrategias comerciales",
      "Crecimiento de negocios",
    ],
    cta: "Quiero fortalecer mi negocio",
    mensaje: mensajes.marketing,
  },
  {
    id: "comunicacion",
    numero: "04",
    titulo: "Comunicación digital",
    corto: "Comunicación",
    color: "amarillo",
    descripcion:
      "Diseñamos estrategias de comunicación para mejorar la presencia digital y conectar a las organizaciones con sus públicos.",
    capacidades: [
      "Estrategias de comunicación",
      "Gestión de redes sociales",
      "Fortalecimiento de la presencia digital",
    ],
    cta: "Quiero mejorar mi comunicación",
    mensaje: mensajes.comunicacion,
  },
];
