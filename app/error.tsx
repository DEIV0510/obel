"use client";

import { useEffect } from "react";
import { PaginaEstado } from "@/components/ui/PaginaEstado";
import { enlaceWhatsapp, mensajes } from "@/lib/whatsapp";
import boton from "@/components/ui/Boton.module.css";

/** Error inesperado: mensaje genérico, sin detalles internos. */
export default function ErrorPagina({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PaginaEstado etiqueta="Algo salió mal" titulo="No pudimos mostrar esta página.">
      <p>Intenta de nuevo. Si el problema continúa, escríbenos por WhatsApp y te ayudamos.</p>
      <div>
        <button type="button" onClick={() => retry()} className={`${boton.boton} ${boton.primario}`}>
          Intentar de nuevo
        </button>
        <a
          href={enlaceWhatsapp(mensajes.general)}
          target="_blank"
          rel="noopener noreferrer"
          className={`${boton.boton} ${boton.secundario}`}
        >
          Habla con un consultor
        </a>
      </div>
    </PaginaEstado>
  );
}
