import styles from "./DiagramaRuta.module.css";

/**
 * «La ruta O»: la silueta del símbolo de OBEL (un círculo que termina en
 * una esquina recta) trazada como recorrido de un proyecto. Cada tramo lleva
 * un color del marco de la portada del portafolio y una etapa de la ruta de
 * trabajo; la esquina —donde la idea se vuelve estructura— es el resultado.
 * Es una abstracción geométrica, no el logotipo.
 */
const R = 170;
const CX = 260;
const CY = 250;
const ESQUINA = 40;

const arriba = CY - R; // 80
const abajo = CY + R; // 420
const izquierda = CX - R; // 90
const derecha = CX + R; // 430

const tramos = [
  { d: `M${CX} ${arriba} A${R} ${R} 0 0 0 ${izquierda} ${CY}`, color: "azul" },
  { d: `M${izquierda} ${CY} A${R} ${R} 0 0 0 ${CX} ${abajo}`, color: "verde" },
  { d: `M${CX} ${abajo} A${R} ${R} 0 0 0 ${derecha} ${CY}`, color: "rojo" },
  {
    d: `M${derecha} ${CY} V${arriba + ESQUINA} A${ESQUINA} ${ESQUINA} 0 0 0 ${derecha - ESQUINA} ${arriba} H${CX}`,
    color: "amarillo",
  },
] as const;

const nodos = [
  { x: izquierda, y: CY, numero: "01", nombre: "Diagnóstico", tx: izquierda - 22, ty: CY + 6, ancla: "end" },
  { x: CX, y: abajo, numero: "02", nombre: "Estructuración", tx: CX, ty: abajo + 44, ancla: "middle" },
  { x: derecha, y: CY, numero: "03", nombre: "Desarrollo", tx: derecha + 22, ty: CY + 6, ancla: "start" },
  {
    x: derecha - ESQUINA + ESQUINA * Math.SQRT1_2,
    y: arriba + ESQUINA - ESQUINA * Math.SQRT1_2,
    numero: "04",
    nombre: "Seguimiento",
    tx: derecha + 14,
    ty: arriba + 2,
    ancla: "start",
  },
] as const;

export function DiagramaRuta({ className }: { className?: string }) {
  return (
    <svg
      className={[styles.diagrama, className].filter(Boolean).join(" ")}
      viewBox="-78 34 690 460"
      aria-hidden="true"
      focusable="false"
    >
      {/* Contraforma de la O */}
      <circle className={styles.contraforma} cx={CX} cy={CY} r={R * 0.6} pathLength={1} />

      {/* Punto de partida: la idea */}
      <g className={styles.inicio}>
        <circle cx={CX} cy={arriba} r={7} />
        <text x={CX - 16} y={arriba - 20} textAnchor="end" className={styles.etiquetaIdea}>
          Tu idea
        </text>
      </g>

      {tramos.map((t, i) => (
        <path
          key={t.color}
          d={t.d}
          pathLength={1}
          className={`${styles.tramo} ${styles[t.color]}`}
          style={{ "--i": i } as React.CSSProperties}
        />
      ))}

      {nodos.map((n, i) => (
        <g key={n.numero} className={styles.nodo} style={{ "--i": i } as React.CSSProperties}>
          <circle cx={n.x} cy={n.y} r={i === 3 ? 9 : 7} className={i === 3 ? styles.nodoFinal : undefined} />
          <text x={n.tx} y={n.ty} textAnchor={n.ancla} className={styles.etiqueta}>
            <tspan className={styles.numero}>{n.numero}</tspan>
            <tspan className={styles.nombre} dx={8}>
              {n.nombre}
            </tspan>
          </text>
        </g>
      ))}

      <text x={CX} y={CY + 9} textAnchor="middle" className={styles.resultado}>
        Resultados
      </text>
    </svg>
  );
}
