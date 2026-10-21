"use client";

import { useEffect, useState } from "react";
import styles from "./Servicios.module.css";

interface Item {
  id: string;
  numero: string;
  titulo: string;
  color: string;
}

/** Índice fijo (escritorio) que marca la línea de servicio que se está leyendo. */
export function IndiceServicios({ items }: { items: Item[] }) {
  const [activo, setActivo] = useState<string | undefined>(items[0]?.id);

  useEffect(() => {
    const bloques = document.querySelectorAll<HTMLElement>("[data-servicio-bloque]");
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) setActivo(e.target.getAttribute("data-servicio-bloque") ?? undefined);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    bloques.forEach((b) => observador.observe(b));
    return () => observador.disconnect();
  }, []);

  return (
    <nav className={styles.indice} aria-label="Líneas de servicio">
      <ol role="list">
        {items.map((s) => (
          <li key={s.id} className={styles[s.color]}>
            <a href={`#servicio-${s.id}`} aria-current={activo === s.id ? "true" : undefined}>
              <span className={styles.indiceNumero}>{s.numero}</span>
              <span>{s.titulo}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
