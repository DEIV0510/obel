import type { CSSProperties } from "react";
import Image from "next/image";
import { nosotros } from "@/content/institucional";
import { equipo } from "@/content/equipo";
import { sitio } from "@/config/sitio";
import styles from "./Nosotros.module.css";

/** Quiénes somos y equipo en una sola sección: texto breve y las personas. */
export function Nosotros() {
  return (
    <section id="nosotros" data-nav="nosotros" data-tema="blanco" className="seccion" aria-labelledby="nosotros-titulo">
      <div className={`contenedor ${styles.reticula}`}>
        <div className={styles.texto}>
          <p className="antetitulo">Nosotros · Desde {sitio.fundacion}</p>
          <h2 id="nosotros-titulo" className="titulo-seccion">
            Estrategia, innovación y gestión, conectadas.
          </h2>
          <p className={styles.destacado}>{nosotros.parrafos[0]}</p>

          <ol role="list" className={styles.hitos} aria-label="Trayectoria">
            {nosotros.trayectoria.map((h) => (
              <li key={h.periodo}>
                <span className={styles.periodo}>{h.periodo}</span>
                <span>
                  <strong>{h.nombre}.</strong> {h.texto}
                </span>
              </li>
            ))}
          </ol>

          <ul role="list" className={styles.valores} aria-label="Valores">
            {nosotros.valores.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>

          <details className={styles.declaraciones}>
            <summary>Misión y visión</summary>
            <dl>
              <dt>Misión</dt>
              <dd>{nosotros.mision}</dd>
              <dt>Visión</dt>
              <dd>{nosotros.vision}</dd>
            </dl>
          </details>
        </div>

        <div className={styles.equipo}>
          <h3 className={styles.equipoTitulo}>Nuestro equipo</h3>
          <ul role="list" className={styles.personas}>
            {equipo.map((p, i) => (
              <li key={p.nombre} className={styles.persona} data-revelar style={{ "--retraso": i } as CSSProperties}>
                <div className={styles.foto}>
                  <Image
                    src={p.foto}
                    alt={p.alt}
                    fill
                    sizes="(min-width: 64rem) 15rem, (min-width: 40rem) 30vw, 45vw"
                    placeholder="blur"
                    style={{ objectPosition: p.encuadre }}
                  />
                </div>
                <p className={styles.nombre}>{p.nombre}</p>
                <p className={styles.cargo}>{p.cargo}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
