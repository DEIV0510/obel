import type { Metadata } from "next";
import Link from "next/link";
import { PaginaEstado } from "@/components/ui/PaginaEstado";
import { enlaceWhatsapp, mensajes } from "@/lib/whatsapp";
import { IconoWhatsapp } from "@/components/ui/Iconos";
import boton from "@/components/ui/Boton.module.css";

export const metadata: Metadata = {
  title: "Solicitud no enviada",
  robots: { index: false, follow: false },
};

const MOTIVOS: Record<string, string> = {
  validacion: "Algunos datos no son válidos o faltan campos obligatorios. Vuelve al formulario y revísalos.",
  no_configurado: "El envío por formulario todavía no está habilitado en este sitio, así que tus datos no se enviaron.",
  error_envio: "No pudimos confirmar el envío de tu solicitud.",
  limite: "Recibimos varias solicitudes desde tu conexión en poco tiempo. Espera unos minutos antes de intentarlo de nuevo.",
  rechazado: "No pudimos procesar la solicitud.",
};

/** Resultado del formulario cuando el navegador no ejecuta JavaScript. */
export default async function SolicitudNoEnviada({ searchParams }: PageProps<"/solicitud/no-enviada">) {
  const { motivo } = await searchParams;
  const texto = typeof motivo === "string" && Object.hasOwn(MOTIVOS, motivo) ? MOTIVOS[motivo] : MOTIVOS.rechazado;

  return (
    <PaginaEstado etiqueta="Prediagnóstico" titulo="Tu solicitud no se envió.">
      <p>{texto} Puedes escribirnos directamente por WhatsApp.</p>
      <div>
        <a
          href={enlaceWhatsapp(mensajes.prediagnostico)}
          target="_blank"
          rel="noopener noreferrer"
          className={`${boton.boton} ${boton.primario}`}
        >
          <IconoWhatsapp />
          Habla con un consultor
          <span className="solo-lectores"> (abre WhatsApp)</span>
        </a>
        <Link href="/#contacto" className={`${boton.boton} ${boton.secundario}`}>
          Volver al formulario
        </Link>
      </div>
    </PaginaEstado>
  );
}
