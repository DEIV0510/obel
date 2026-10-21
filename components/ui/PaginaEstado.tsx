import type { ReactNode } from "react";
import styles from "./PaginaEstado.module.css";

/** Página breve de estado (404, error, resultado del formulario sin JavaScript). */
export function PaginaEstado({
  etiqueta,
  titulo,
  children,
}: {
  etiqueta: string;
  titulo: string;
  children: ReactNode;
}) {
  return (
    <main id="contenido" tabIndex={-1} className={styles.pagina}>
      <div className={`contenedor ${styles.contenido}`}>
        <p className="antetitulo">{etiqueta}</p>
        <h1 className={styles.titulo}>{titulo}</h1>
        <div className={styles.cuerpo}>{children}</div>
      </div>
    </main>
  );
}
