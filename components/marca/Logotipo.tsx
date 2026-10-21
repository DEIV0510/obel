import styles from "./Logotipo.module.css";

interface Props {
  /** Nombre accesible. Sin etiqueta, el logotipo se trata como decorativo. */
  etiqueta?: string;
  className?: string;
  variante?: "logotipo" | "simbolo";
}

/**
 * Logotipo oficial de OBEL. Usa el archivo original (convertido a
 * transparencia) como máscara, de modo que toma el color del texto: negro
 * sobre fondos claros y blanco sobre fondos oscuros, sin redibujarlo.
 */
export function Logotipo({ etiqueta, className, variante = "logotipo" }: Props) {
  const clases = [styles.marca, styles[variante], className].filter(Boolean).join(" ");
  return etiqueta ? (
    <span className={clases} role="img" aria-label={etiqueta} />
  ) : (
    <span className={clases} aria-hidden="true" />
  );
}
