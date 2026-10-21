import type { Metadata } from "next";
import { sitio } from "@/config/sitio";
import { openGraphBase } from "@/lib/seo";
import { PantallaCarga } from "@/components/intro/PantallaCarga";
import { Hero } from "@/components/inicio/Hero";
import { Propuesta } from "@/components/inicio/Propuesta";
import { Servicios } from "@/components/inicio/Servicios";
import { Metodologia } from "@/components/inicio/Metodologia";
import { Sectores } from "@/components/inicio/Sectores";
import { Nosotros } from "@/components/inicio/Nosotros";
import { Equipo } from "@/components/inicio/Equipo";
import { Conversion } from "@/components/inicio/Conversion";
import { Preguntas } from "@/components/inicio/Preguntas";
import { Contacto } from "@/components/contacto/Contacto";

/**
 * La URL canónica se declara solo en la portada (no la heredan 404 ni
 * /solicitud). openGraph se reemplaza completo al fusionar: se repite la base.
 */
export const metadata: Metadata = sitio.dominio
  ? { alternates: { canonical: "/" }, openGraph: { ...openGraphBase, url: "/" } }
  : {};

/**
 * Recorrido de la página (cada sección responde una pregunta del visitante):
 * qué hace OBEL → por qué → en qué ayuda → cómo trabaja → con quién →
 * quiénes son → el siguiente paso → dudas → cómo empezar.
 */
export default function Inicio() {
  return (
    <>
      <PantallaCarga />
      <main id="contenido" tabIndex={-1}>
        <Hero />
        <Propuesta />
        <Servicios />
        <Metodologia />
        <Sectores />
        <Nosotros />
        <Equipo />
        <Conversion />
        <Preguntas />
        <Contacto />
      </main>
    </>
  );
}
