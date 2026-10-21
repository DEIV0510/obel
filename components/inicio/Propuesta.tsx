import type { CSSProperties } from "react";
import { diferenciales } from "@/content/institucional";
import styles from "./Propuesta.module.css";

/** Mensaje central de la marca; cada palabra se ilumina al leerla. */
const FRASE = "Convirtamos tus ideas y oportunidades en proyectos con resultados.";

export function Propuesta() {
  const palabras = FRASE.split(" ");
  return (
    <section
      id="propuesta"
      data-nav="inicio"
      data-tema="blanco"
      className={`seccion ${styles.propuesta}`}
      aria-labelledby="propuesta-titulo"
    >
      <div className={`contenedor ${styles.reticula}`}>
        <div>
          <p className="antetitulo">Nuestra propuesta</p>
          <h2 id="propuesta-titulo" className={styles.frase}>
            {palabras.map((p, k) => (
              <span key={k} style={{ "--k": k } as CSSProperties}>
                {p}
                {k < palabras.length - 1 ? " " : ""}
              </span>
            ))}
          </h2>
        </div>

        <ol className={styles.diferenciales} role="list">
          {diferenciales.map((d, i) => (
            <li key={d.titulo} data-revelar style={{ "--retraso": i } as CSSProperties}>
              <span className={styles.numero}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={styles.titulo}>{d.titulo}</h3>
              <p>{d.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
