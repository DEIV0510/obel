import type { CSSProperties } from "react";
import { servicios } from "@/content/servicios";
import { enlaceWhatsapp } from "@/lib/whatsapp";
import { IconoFlecha, IconoWhatsapp } from "@/components/ui/Iconos";
import boton from "@/components/ui/Boton.module.css";
import { GlifoServicio } from "./GlifoServicio";
import { IndiceServicios } from "./IndiceServicios";
import styles from "./Servicios.module.css";

export function Servicios() {
  return (
    <section id="servicios" data-nav="servicios" className={`seccion ${styles.servicios}`} aria-labelledby="servicios-titulo">
      <div className="contenedor">
        <header className={styles.encabezado}>
          <p className="antetitulo">Servicios</p>
          <h2 id="servicios-titulo" className="titulo-seccion">
            Cuatro líneas de trabajo para que tu proyecto avance.
          </h2>
          <p className={`lead ${styles.lead}`}>
            Consultoría empresarial integrada: formulamos, planeamos, posicionamos y comunicamos según lo que necesita cada
            organización.
          </p>
        </header>

        <div className={styles.cuerpo}>
          <IndiceServicios
            items={servicios.map((s) => ({ id: s.id, numero: s.numero, titulo: s.titulo, color: s.color }))}
          />

          <div className={styles.lista}>
            {servicios.map((s) => (
              <article
                key={s.id}
                id={`servicio-${s.id}`}
                className={`${styles.servicio} ${styles[s.color]}`}
                aria-labelledby={`servicio-${s.id}-titulo`}
                data-servicio-bloque={s.id}
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

                <ul className={styles.capacidades} role="list" aria-label={`Capacidades de ${s.titulo.toLowerCase()}`}>
                  {s.capacidades.map((c, i) => (
                    <li key={c} data-revelar style={{ "--retraso": i } as CSSProperties}>
                      {c}
                    </li>
                  ))}
                </ul>

                <div className={styles.acciones}>
                  <a
                    href={enlaceWhatsapp(s.mensaje)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${boton.boton} ${boton.primario}`}
                  >
                    <IconoWhatsapp />
                    {s.cta}
                    <span className="solo-lectores"> (abre WhatsApp)</span>
                  </a>
                  <a href="#contacto" className={boton.enlace} data-servicio={s.id}>
                    o solicita un prediagnóstico
                    <IconoFlecha className={boton.flecha} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
