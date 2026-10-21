import type { CSSProperties } from "react";
import { diferenciales } from "@/content/institucional";
import { IconoFlechaAbajo } from "@/components/ui/Iconos";
import boton from "@/components/ui/Boton.module.css";
import styles from "./Propuesta.module.css";

/** Mensaje central de la marca; cada palabra se ilumina al leerla. */
const FRASE = "Convirtamos tus ideas y oportunidades en proyectos con resultados.";

export function Propuesta() {
  const palabras = FRASE.split(" ");
  return (
    <section
      id="propuesta"
      data-nav="inicio"
      data-tema="oscuro"
      className={`seccion ${styles.propuesta}`}
      aria-labelledby="propuesta-titulo"
    >
      <div className="contenedor">
        <p className="antetitulo">Nuestra propuesta</p>
        <h2 id="propuesta-titulo" className={styles.frase}>
          {palabras.map((p, k) => (
            <span key={k} style={{ "--k": k } as CSSProperties}>
              {p}
              {k < palabras.length - 1 ? " " : ""}
            </span>
          ))}
        </h2>

        <div className={styles.cuerpo}>
          <p className={styles.sintesis} data-revelar>
            Integramos <strong>estrategia, técnica y mercado</strong> en un solo proceso para que cada idea se convierta
            en un proyecto estructurado, financiable y comercialmente viable.
          </p>

          <ol className={styles.diferenciales} role="list">
            {diferenciales.map((d, i) => (
              <li key={d.titulo} data-revelar style={{ "--retraso": i } as CSSProperties}>
                <span className={styles.numero}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={styles.titulo}>{d.titulo}</h3>
                <p>{d.texto}</p>
              </li>
            ))}
          </ol>

          <a href="#servicios" className={boton.enlace}>
            Ver las cuatro líneas de servicio
            <IconoFlechaAbajo className={boton.flechaAbajo} />
          </a>
        </div>
      </div>
    </section>
  );
}
