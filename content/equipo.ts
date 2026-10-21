import type { StaticImageData } from "next/image";
import oscar from "@/assets/equipo/oscar-belalcazar.jpg";
import xiomara from "@/assets/equipo/xiomara-belalcazar.jpg";
import vanessa from "@/assets/equipo/kellyn-vanessa-velez.jpg";
import brian from "@/assets/equipo/brian-castaneda.jpg";

export interface Integrante {
  nombre: string;
  cargo: string;
  perfil: string;
  foto: StaticImageData;
  alt: string;
  /** Encuadre del rostro dentro del recorte cuadrado (object-position). */
  encuadre: string;
}

/**
 * Equipo según el portafolio de servicios 2026 (nombres, profesiones y
 * perfiles tal como están documentados). Fotografías originales entregadas
 * por la empresa; la de Xiomara Belalcázar se tomó del propio portafolio
 * porque no venía como archivo independiente.
 */
export const equipo: Integrante[] = [
  {
    nombre: "Oscar Daniel Belalcázar Castillo",
    cargo: "Mercadólogo",
    perfil:
      "Estratega en estructuración de proyectos, marketing y planeación estratégica; impulsor de desarrollo territorial y modelos de negocio escalables.",
    foto: oscar,
    alt: "Oscar Daniel Belalcázar Castillo, sentado en una oficina con camisa azul clara",
    encuadre: "50% 22%",
  },
  {
    nombre: "Xiomara Belalcázar Castillo",
    cargo: "Comunicadora social · Magíster en Comunicación Digital",
    perfil:
      "Estratega en comunicación organizacional y posicionamiento de marca; experta en gestión reputacional y articulación de procesos institucionales.",
    foto: xiomara,
    alt: "Xiomara Belalcázar Castillo, con traje azul oscuro y blusa blanca, de brazos cruzados",
    encuadre: "50% 16%",
  },
  {
    nombre: "Kellyn Vanessa Vélez Duque",
    cargo: "Administradora de empresas",
    perfil:
      "Experta en supervisión y coordinación integral de proyectos, enfocada en la eficiencia operativa y la articulación de procesos.",
    foto: vanessa,
    alt: "Kellyn Vanessa Vélez Duque, con traje azul oscuro y blusa blanca, sonriendo en una oficina",
    encuadre: "50% 14%",
  },
  {
    nombre: "Brian Castañeda",
    cargo: "Abogado · Especialista en derecho corporativo",
    perfil:
      "Especialista en derecho corporativo, contratación y gestión de riesgos; experto en estructuración legal y defensa jurídica empresarial.",
    foto: brian,
    alt: "Brian Castañeda, con saco gris y camisa azul clara, en una oficina",
    encuadre: "50% 30%",
  },
];
