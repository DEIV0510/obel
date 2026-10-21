import { enlaceWhatsapp, mensajes } from "@/lib/whatsapp";
import { IconoFlecha, IconoWhatsapp } from "@/components/ui/Iconos";
import boton from "@/components/ui/Boton.module.css";
import styles from "./Conversion.module.css";

/** Bloque comercial principal: un panel oscuro con la misma ruta O del inicio. */
export function Conversion() {
  return (
    <section id="empezar" className="seccion" aria-labelledby="conversion-titulo">
      <div className="contenedor">
        <div className={styles.panel} data-tema="oscuro">
          <svg className={styles.silueta} viewBox="0 0 400 400" aria-hidden="true" focusable="false">
            <path
              className={styles.contorno}
              d="M20 200A180 180 0 0 1 200 20h140a40 40 0 0 1 40 40v140A180 180 0 0 1 20 200Z"
              pathLength={1}
            />
            <path className={styles.esquina} d="M300 20h40a40 40 0 0 1 40 40v40" pathLength={1} />
          </svg>

          <div className={styles.texto}>
            <h2 id="conversion-titulo" className={styles.titulo}>
              Tu próximo proyecto puede comenzar aquí.
            </h2>
            <p>
              Cuéntanos qué quieres desarrollar y conversemos sobre las oportunidades para estructurarlo y llevarlo
              adelante.
            </p>
          </div>

          <div className={styles.acciones}>
            <a href="#contacto" className={`${boton.boton} ${boton.primario}`}>
              Agenda tu prediagnóstico
              <IconoFlecha className={boton.flecha} />
            </a>
            <a
              href={enlaceWhatsapp(mensajes.prediagnostico)}
              target="_blank"
              rel="noopener noreferrer"
              className={`${boton.boton} ${boton.secundario}`}
            >
              <IconoWhatsapp />
              Habla con un consultor
              <span className="solo-lectores"> (abre WhatsApp)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
