import { preguntas } from "@/content/institucional";
import { enlaceWhatsapp, mensajes } from "@/lib/whatsapp";
import { IconoWhatsapp } from "@/components/ui/Iconos";
import boton from "@/components/ui/Boton.module.css";
import styles from "./Preguntas.module.css";

/** Acordeón nativo (<details>): accesible con teclado y funcional sin JavaScript. */
export function Preguntas() {
  return (
    <section
      id="preguntas"
      data-nav="contacto"
      data-tema="blanco"
      className={`seccion ${styles.preguntas}`}
      aria-labelledby="preguntas-titulo"
    >
      <div className={`contenedor ${styles.reticula}`}>
        <header className={styles.encabezado}>
          <p className="antetitulo">Preguntas frecuentes</p>
          <h2 id="preguntas-titulo" className="titulo-seccion">
            Antes de empezar.
          </h2>
          <p className={styles.ayuda}>¿Tienes otra pregunta? Escríbenos y la resolvemos contigo.</p>
          <a
            href={enlaceWhatsapp(mensajes.general)}
            target="_blank"
            rel="noopener noreferrer"
            className={`${boton.boton} ${boton.secundario}`}
          >
            <IconoWhatsapp />
            Escríbenos por WhatsApp
            <span className="solo-lectores"> (abre WhatsApp)</span>
          </a>
        </header>

        <div className={styles.lista}>
          {preguntas.map((p) => (
            <details key={p.pregunta} className={styles.item} name="preguntas-frecuentes">
              <summary className={styles.pregunta}>
                <span>{p.pregunta}</span>
                <span className={styles.signo} aria-hidden="true" />
              </summary>
              <div className={styles.respuesta}>
                <p>{p.respuesta}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
