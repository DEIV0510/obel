import type { CSSProperties } from "react";
import Image from "next/image";
import { equipo } from "@/content/equipo";
import { servicios } from "@/content/servicios";
import { enlaceWhatsapp, mensajes } from "@/lib/whatsapp";
import { IconoFlecha, IconoFlechaAbajo, IconoWhatsapp } from "@/components/ui/Iconos";
import boton from "@/components/ui/Boton.module.css";
import { DiagramaRuta } from "./DiagramaRuta";
import styles from "./Hero.module.css";

const lineas = ["De las ideas", "a los proyectos", "que generan"];

const orden = (i: number) => ({ "--i": i }) as CSSProperties;

export function Hero() {
  return (
    <section id="inicio" data-nav="inicio" className={styles.hero} aria-labelledby="hero-titulo">
      <div className={`contenedor ${styles.reticula}`}>
        <div className={styles.texto}>
          <p className={`antetitulo ${styles.antetitulo}`} data-entrada style={orden(0)}>
            Firma consultora · Santiago de Cali
          </p>

          <h1 id="hero-titulo" className={styles.titulo}>
            {lineas.map((linea, i) => (
              <span key={linea} className={styles.linea}>
                <span data-entrada style={orden(i + 1)}>
                  {linea}
                </span>{" "}
              </span>
            ))}
            <span className={styles.linea}>
              <span data-entrada style={orden(4)}>
                <span className={styles.resultados}>resultados</span>
              </span>
            </span>
          </h1>

          <p className={styles.bajada} data-entrada style={orden(5)}>
            Transformamos oportunidades en proyectos estructurados, estrategias viables y soluciones para el
            crecimiento de organizaciones y territorios.
          </p>

          <div className={styles.acciones} data-entrada style={orden(6)}>
            <a href="#contacto" className={`${boton.boton} ${boton.primario}`}>
              Agenda tu prediagnóstico
              <IconoFlecha className={boton.flecha} />
            </a>
            <a href="#servicios" className={`${boton.boton} ${boton.secundario}`}>
              Conoce nuestros servicios
              <IconoFlechaAbajo className={boton.flechaAbajo} />
            </a>
          </div>

          <div className={styles.directo} data-entrada style={orden(7)}>
            <ul role="list" className={styles.avatares} aria-label="Equipo de OBEL Colombia">
              {equipo.map((p) => (
                <li key={p.nombre}>
                  <Image
                    src={p.foto}
                    alt={p.nombre}
                    width={44}
                    height={44}
                    sizes="44px"
                    style={{ objectPosition: p.encuadre }}
                  />
                </li>
              ))}
            </ul>
            <p>
              <span className={styles.directoTexto}>Un equipo de {equipo.length} especialistas</span>
              <a href={enlaceWhatsapp(mensajes.general)} target="_blank" rel="noopener noreferrer" className={boton.enlace}>
                <IconoWhatsapp tamano={18} />
                Habla con un consultor
                <span className="solo-lectores"> (abre WhatsApp)</span>
              </a>
            </p>
          </div>
        </div>

        <div className={styles.figura}>
          <DiagramaRuta />
        </div>
      </div>

      <nav className={`contenedor ${styles.indice}`} aria-label="Líneas de servicio">
        <ul role="list">
          {servicios.map((s, i) => (
            <li key={s.id} data-entrada style={orden(8 + i)}>
              <a href={`#servicio-${s.id}`} className={styles[s.color]}>
                <span className={styles.indiceNumero}>{s.numero}</span>
                <span className={styles.indiceNombre}>{s.titulo}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
