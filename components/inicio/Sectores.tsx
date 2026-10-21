"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { sectores } from "@/content/sectores";
import { servicios } from "@/content/servicios";
import { enlaceWhatsapp } from "@/lib/whatsapp";
import { IconoFlecha, IconoWhatsapp } from "@/components/ui/Iconos";
import boton from "@/components/ui/Boton.module.css";
import styles from "./Sectores.module.css";

/**
 * Selector de perfiles (pestañas ARIA verticales). Sin JavaScript, todos los
 * paneles quedan visibles (ver CSS).
 */
export function Sectores() {
  const [activo, setActivo] = useState(0);
  const pestanas = useRef<(HTMLButtonElement | null)[]>([]);

  const mover = (indice: number) => {
    const n = (indice + sectores.length) % sectores.length;
    setActivo(n);
    pestanas.current[n]?.focus();
  };

  const alTeclear = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const teclas: Record<string, () => void> = {
      ArrowDown: () => mover(i + 1),
      ArrowRight: () => mover(i + 1),
      ArrowUp: () => mover(i - 1),
      ArrowLeft: () => mover(i - 1),
      Home: () => mover(0),
      End: () => mover(sectores.length - 1),
    };
    const accion = teclas[e.key];
    if (accion) {
      e.preventDefault();
      accion();
    }
  };

  return (
    <section
      id="sectores"
      data-nav="servicios"
      className={`seccion ${styles.sectores}`}
      aria-labelledby="sectores-titulo"
    >
      <div className="contenedor">
        <header className={styles.encabezado}>
          <p className="antetitulo">Con quién trabajamos</p>
          <h2 id="sectores-titulo" className="titulo-seccion">
            ¿Qué tipo de organización eres?
          </h2>
          <p className={styles.ayuda} id="sectores-ayuda">
            Elige una opción y te mostramos por dónde empezar.
          </p>
        </header>

        <div className={styles.selector}>
          <div
            role="tablist"
            aria-orientation="vertical"
            aria-labelledby="sectores-ayuda"
            className={styles.pestanas}
          >
            {sectores.map((s, i) => (
              <button
                key={s.id}
                ref={(el) => {
                  pestanas.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`sector-${s.id}`}
                aria-selected={activo === i}
                aria-controls={`panel-${s.id}`}
                tabIndex={activo === i ? 0 : -1}
                onClick={() => setActivo(i)}
                onKeyDown={(e) => alTeclear(e, i)}
                className={styles.pestana}
              >
                <span className={styles.pestanaNumero}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.pestanaNombre}>{s.nombre}</span>
              </button>
            ))}
          </div>

          <div className={styles.paneles}>
            {sectores.map((s, i) => (
              <div
                key={s.id}
                role="tabpanel"
                id={`panel-${s.id}`}
                aria-labelledby={`sector-${s.id}`}
                hidden={activo !== i}
                tabIndex={0}
                className={styles.panel}
              >
                <p className={styles.panelEtiqueta}>{s.nombre}</p>
                <p className={styles.enfoque}>{s.enfoque}</p>

                <p className={styles.recomendadas}>Líneas recomendadas</p>
                <ul role="list" className={styles.lineas}>
                  {s.servicios.map((id) => {
                    const servicio = servicios.find((x) => x.id === id);
                    if (!servicio) return null;
                    return (
                      <li key={id}>
                        <a href={`#servicio-${id}`} className={styles[servicio.color]}>
                          <span className={styles.punto} aria-hidden="true" />
                          {servicio.titulo}
                        </a>
                      </li>
                    );
                  })}
                </ul>

                <div className={styles.acciones}>
                  <a
                    href={enlaceWhatsapp(s.mensaje)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${boton.boton} ${boton.primario}`}
                  >
                    <IconoWhatsapp />
                    Habla con un consultor
                    <span className="solo-lectores"> (abre WhatsApp)</span>
                  </a>
                  <a href="#contacto" className={boton.enlace} data-tipo={s.tipoFormulario}>
                    Solicitar prediagnóstico
                    <IconoFlecha className={boton.flecha} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
