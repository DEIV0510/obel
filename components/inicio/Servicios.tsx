import type { CSSProperties } from "react";
import { servicios } from "@/content/servicios";
import { enlaceWhatsapp } from "@/lib/whatsapp";
import { IconoFlecha, IconoWhatsapp } from "@/components/ui/Iconos";
import boton from "@/components/ui/Boton.module.css";
import { GlifoServicio } from "./GlifoServicio";
import styles from "./Servicios.module.css";

export function Servicios() {
  return (
    <section id="servicios" data-nav="servicios" className={`seccion ${styles.servicios}`} aria-labelledby="servicios-titulo">
      <div className="contenedor">
        <header className={styles.encabezado}>
          <div>
            <p className="antetitulo">Servicios</p>
            <h2 id="servicios-titulo" className="titulo-seccion">
              Cuatro líneas para que tu proyecto avance.
            </h2>
          </div>
          <p className={styles.lead}>Formulamos, planeamos, posicionamos y comunicamos según lo que necesita cada organización.</p>
        </header>

        <div className={styles.lista}>
          {servicios.map((s, i) => (
            <article
              key={s.id}
              id={`servicio-${s.id}`}
              className={`${styles.tarjeta} ${styles[s.color]}`}
              aria-labelledby={`servicio-${s.id}-titulo`}
              data-revelar
              style={{ "--retraso": i % 2 } as CSSProperties}
            >
              <div className={styles.cabeza}>
                <span className={styles.numero} aria-hidden="true">
                  {s.numero}
                </span>
                <GlifoServicio id={s.id} className={styles.glifo} />
              </div>

              <h3 id={`servicio-${s.id}-titulo`} className={styles.titulo}>
                {s.titulo}
              </h3>
              <p className={styles.descripcion}>{s.descripcion}</p>

              <ul className={styles.capacidades} role="list" aria-label="Incluye">
                {s.capacidades.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>

              <div className={styles.acciones}>
                <a
                  href={enlaceWhatsapp(s.mensaje)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${boton.boton} ${boton.primario} ${boton.compacto}`}
                >
                  <IconoWhatsapp tamano={18} />
                  {s.cta}
                  <span className="solo-lectores"> (abre WhatsApp)</span>
                </a>
                <a href="#contacto" className={boton.enlace} data-servicio={s.id}>
                  Prediagnóstico
                  <span className="solo-lectores"> de {s.titulo.toLowerCase()}</span>
                  <IconoFlecha className={boton.flecha} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
