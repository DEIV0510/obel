import type { IdServicio } from "@/content/servicios";

export type IdSector = "emprendimiento" | "empresa" | "social" | "ong" | "gobierno";

export interface Sector {
  id: IdSector;
  nombre: string;
  /** Valor equivalente en el campo «Tipo de organización» del formulario. */
  tipoFormulario: string;
  enfoque: string;
  servicios: IdServicio[];
  mensaje: string;
}

/**
 * Tipos de organización con los que trabaja OBEL (información institucional).
 * Los enfoques solo combinan servicios documentados; no describen casos ni
 * clientes.
 */
export const sectores: Sector[] = [
  {
    id: "emprendimiento",
    nombre: "Emprendimientos",
    tipoFormulario: "Emprendimiento",
    enfoque:
      "Para pasar de la idea al plan: planes de negocio, estudios de factibilidad y una marca preparada para llegar a su mercado.",
    servicios: ["formulacion", "marketing"],
    mensaje:
      "Hola, escribo desde un emprendimiento y quisiera conversar con OBEL Colombia sobre cómo estructurar y hacer crecer nuestra idea.",
  },
  {
    id: "empresa",
    nombre: "Empresas",
    tipoFormulario: "Empresa",
    enfoque:
      "Para ordenar prioridades y crecer: planeación estratégica, táctica y operativa, estrategias comerciales y presencia digital.",
    servicios: ["planeacion", "marketing", "comunicacion"],
    mensaje:
      "Hola, escribo desde una empresa y quisiera conversar con OBEL Colombia sobre planeación y crecimiento comercial.",
  },
  {
    id: "social",
    nombre: "Organizaciones sociales",
    tipoFormulario: "Organización social",
    enfoque:
      "Para convertir iniciativas comunitarias en proyectos formulados con marco lógico y preparados para buscar financiación.",
    servicios: ["formulacion", "planeacion"],
    mensaje:
      "Hola, escribo desde una organización social y quisiera conversar con OBEL Colombia sobre la formulación de un proyecto.",
  },
  {
    id: "ong",
    nombre: "ONG",
    tipoFormulario: "ONG",
    enfoque:
      "Para estructurar proyectos, orientarlos hacia fuentes de financiación públicas, privadas y de cooperación, y comunicar su propósito.",
    servicios: ["formulacion", "comunicacion"],
    mensaje:
      "Hola, escribo desde una ONG y quisiera conversar con OBEL Colombia sobre la estructuración de nuestros proyectos.",
  },
  {
    id: "gobierno",
    nombre: "Entidades gubernamentales",
    tipoFormulario: "Entidad gubernamental",
    enfoque:
      "Para estructurar planes, programas y proyectos de desarrollo territorial, con planeación estratégica, táctica y operativa.",
    servicios: ["planeacion", "formulacion"],
    mensaje:
      "Hola, escribo desde una entidad gubernamental y quisiera conversar con OBEL Colombia sobre planes, programas o proyectos.",
  },
];
