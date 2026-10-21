import type { Metadata } from "next";
import Link from "next/link";
import { PaginaEstado } from "@/components/ui/PaginaEstado";
import { IconoFlecha } from "@/components/ui/Iconos";
import boton from "@/components/ui/Boton.module.css";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false },
};

export default function NoEncontrada() {
  return (
    <PaginaEstado etiqueta="Error 404" titulo="Esta página no existe.">
      <p>Es posible que el enlace haya cambiado. Desde el inicio puedes conocer nuestros servicios o agendar un prediagnóstico.</p>
      <div>
        <Link href="/" className={`${boton.boton} ${boton.primario}`}>
          Ir al inicio
          <IconoFlecha className={boton.flecha} />
        </Link>
        <Link href="/#contacto" className={`${boton.boton} ${boton.secundario}`}>
          Agenda tu prediagnóstico
        </Link>
      </div>
    </PaginaEstado>
  );
}
