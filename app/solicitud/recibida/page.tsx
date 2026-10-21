import type { Metadata } from "next";
import Link from "next/link";
import { PaginaEstado } from "@/components/ui/PaginaEstado";
import boton from "@/components/ui/Boton.module.css";

export const metadata: Metadata = {
  title: "Solicitud recibida",
  robots: { index: false, follow: false },
};

/** Resultado del formulario cuando el navegador no ejecuta JavaScript. */
export default function SolicitudRecibida() {
  return (
    <PaginaEstado etiqueta="Prediagnóstico" titulo="Recibimos tu solicitud.">
      <p>
        Tu solicitud de prediagnóstico fue enviada al equipo de OBEL Colombia. Usaremos los datos que compartiste para
        contactarte.
      </p>
      <div>
        <Link href="/" className={`${boton.boton} ${boton.primario}`}>
          Volver al inicio
        </Link>
      </div>
    </PaginaEstado>
  );
}
