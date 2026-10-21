import type { CSSProperties } from "react";
import Image from "next/image";
import { equipo } from "@/content/equipo";
import styles from "./Equipo.module.css";

export function Equipo() {
  return (
    <section id="equipo" data-nav="nosotros" className={`seccion ${styles.equipo}`} aria-labelledby="equipo-titulo">
      <div className="contenedor">
        <header className={styles.encabezado}>
          <div>
            <p className="antetitulo">Equipo</p>
            <h2 id="equipo-titulo" className="titulo-seccion">
              Un equipo orientado a convertir las ideas en resultados.
            </h2>
          </div>
          <p className="lead">
            Mercadeo, comunicación, administración y derecho: perfiles complementarios que acompañan cada proyecto desde la
            estrategia hasta la gestión.
          </p>
        </header>

        <ul role="list" className={styles.lista}>
          {equipo.map((p, i) => (
            <li key={p.nombre} className={styles.persona} data-revelar style={{ "--retraso": i } as CSSProperties}>
              <div className={styles.foto}>
                <Image
                  src={p.foto}
                  alt={p.alt}
                  fill
                  sizes="(min-width: 64rem) 22vw, (min-width: 40rem) 40vw, 5.5rem"
                  placeholder="blur"
                  style={{ objectPosition: p.encuadre }}
                />
              </div>
              <div className={styles.datos}>
                <h3 className={styles.nombre}>{p.nombre}</h3>
                <p className={styles.cargo}>{p.cargo}</p>
                <p className={styles.perfil}>{p.perfil}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
