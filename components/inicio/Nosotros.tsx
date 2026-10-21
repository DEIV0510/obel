import type { CSSProperties } from "react";
import { nosotros } from "@/content/institucional";
import { sitio } from "@/config/sitio";
import styles from "./Nosotros.module.css";

/**
 * Conexión entre estrategia, gestión e impacto: tres nodos unidos por una
 * misma línea que termina en la silueta de esquina recta de la marca.
 */
function Conexion() {
  return (
    <svg className={styles.conexion} viewBox="-60 0 680 220" aria-hidden="true" focusable="false">
      <path className={styles.hilo} d="M40 110 C 140 20, 200 20, 280 110 S 420 200, 500 110" pathLength={1} />
      <g className={styles.nodoA}>
        <circle cx="40" cy="110" r="10" />
        <text x="40" y="160" textAnchor="middle">Estrategia</text>
      </g>
      <g className={styles.nodoB}>
        <circle cx="280" cy="110" r="22" />
        <text x="280" y="62" textAnchor="middle">Gestión</text>
      </g>
      <g className={styles.nodoC}>
        <path d="M472 110a28 28 0 0 1 28-28h20a8 8 0 0 1 8 8v20a28 28 0 0 1-56 0Z" />
        <text x="500" y="172" textAnchor="middle">Impacto</text>
      </g>
    </svg>
  );
}

export function Nosotros() {
  const [primero, ...resto] = nosotros.parrafos;
  return (
    <section
      id="nosotros"
      data-nav="nosotros"
      data-tema="oscuro"
      className={`seccion ${styles.nosotros}`}
      aria-labelledby="nosotros-titulo"
    >
      <div className="contenedor">
        <div className={styles.intro}>
          <div>
            <p className="antetitulo">Nosotros · Desde {sitio.fundacion}</p>
            <h2 id="nosotros-titulo" className={`titulo-seccion ${styles.titulo}`}>
              Estrategia, innovación y gestión, conectadas.
            </h2>
          </div>
          <div className={styles.texto}>
            <p className={styles.destacado}>{primero}</p>
            {resto.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>

        <Conexion />

        <div className={styles.trayectoria}>
          <h3 className={styles.subtitulo}>Trayectoria</h3>
          <ol role="list" className={styles.hitos}>
            {nosotros.trayectoria.map((h, i) => (
              <li key={h.periodo} data-revelar style={{ "--retraso": i } as CSSProperties}>
                <p className={styles.periodo}>{h.periodo}</p>
                <p className={styles.hitoNombre}>{h.nombre}</p>
                <p className={styles.hitoTexto}>{h.texto}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.declaraciones}>
          <div data-revelar>
            <h3 className={styles.subtitulo}>Misión</h3>
            <p>{nosotros.mision}</p>
          </div>
          <div data-revelar style={{ "--retraso": 1 } as CSSProperties}>
            <h3 className={styles.subtitulo}>Visión</h3>
            <p>{nosotros.vision}</p>
          </div>
        </div>

        <div className={styles.valores}>
          <h3 className={styles.subtitulo}>Valores</h3>
          <ul role="list">
            {nosotros.valores.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
