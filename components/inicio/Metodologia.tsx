import type { CSSProperties } from "react";
import { etapas } from "@/content/institucional";
import { IconoFlecha } from "@/components/ui/Iconos";
import boton from "@/components/ui/Boton.module.css";
import styles from "./Metodologia.module.css";

/**
 * Marcadores de etapa: la figura se completa a medida que avanza la ruta
 * (punto → círculo → círculo con esquina → silueta llena).
 */
function Marcador({ etapa }: { etapa: number }) {
  return (
    <svg className={styles.marcador} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      {etapa === 0 && <circle cx="20" cy="20" r="6" className={styles.lleno} />}
      {etapa === 1 && <circle cx="20" cy="20" r="13" className={styles.trazo} />}
      {etapa >= 2 && (
        <path
          d="M7 20A13 13 0 0 1 20 7h9a4 4 0 0 1 4 4v9A13 13 0 0 1 7 20Z"
          className={etapa === 3 ? styles.llenoAcento : styles.trazo}
        />
      )}
    </svg>
  );
}

export function Metodologia() {
  return (
    <section
      id="metodologia"
      data-nav="metodologia"
      data-tema="blanco"
      className={`seccion ${styles.metodologia}`}
      aria-labelledby="metodologia-titulo"
    >
      <div className="contenedor">
        <div className={styles.panel} data-tema="oscuro">
          <header className={styles.encabezado}>
            <p className="antetitulo">Metodología</p>
            <h2 id="metodologia-titulo" className="titulo-seccion">
              Cómo trabajamos contigo.
            </h2>
          </header>

          <div className={styles.recorrido}>
            <span className={styles.via} aria-hidden="true">
              <span className={styles.avance} />
            </span>
            <ol className={styles.etapas} role="list">
              {etapas.map((e, i) => (
                <li key={e.numero} className={styles.etapa} data-revelar style={{ "--retraso": i } as CSSProperties}>
                  <Marcador etapa={i} />
                  <span className={styles.numero}>{e.numero}</span>
                  <h3 className={styles.nombre}>{e.nombre}</h3>
                  <p className={styles.texto}>{e.texto}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className={styles.cierre}>
            <p>El primer paso es un prediagnóstico.</p>
            <a href="#contacto" className={`${boton.boton} ${boton.primario}`}>
              Agenda tu prediagnóstico
              <IconoFlecha className={boton.flecha} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
