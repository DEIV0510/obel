import type { IdServicio } from "@/content/servicios";

/**
 * Glifos propios de cada línea de servicio, dibujados con la misma lógica
 * geométrica de la marca (círculos y la esquina recta de la O).
 */
const trazos: Record<IdServicio, React.ReactNode> = {
  // De la idea (punto) a la estructura (silueta de esquina recta)
  formulacion: (
    <>
      <circle cx="14" cy="32" r="5" />
      <path d="M19 32h12" />
      <path d="M35 32a12 12 0 0 1 12-12h8a4 4 0 0 1 4 4v8a12 12 0 0 1-24 0Z" />
    </>
  ),
  // Tres niveles de planeación: estratégica, táctica y operativa
  planeacion: (
    <>
      <circle cx="10" cy="17" r="3.5" />
      <circle cx="21" cy="32" r="3.5" />
      <circle cx="32" cy="47" r="3.5" />
      <path d="M17 17h39M28 32h28M39 47h17" />
      <path d="M12.5 20.5 18.5 28.5M23.5 35.5 29.5 43.5" />
    </>
  ),
  // Crecimiento: recorrido ascendente
  marketing: (
    <>
      <path d="M8 50 22 37l10 7 22-24" />
      <path d="M43 19h12v12" />
      <path d="M8 56h48" />
    </>
  ),
  // Conversación: un emisor y sus públicos
  comunicacion: (
    <>
      <circle cx="14" cy="32" r="5.5" />
      <path d="M26 22a14 14 0 0 1 0 20" />
      <path d="M35 14a25 25 0 0 1 0 36" />
      <path d="M44 7a35 35 0 0 1 0 50" />
    </>
  ),
};

export function GlifoServicio({ id, className }: { id: IdServicio; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {trazos[id]}
    </svg>
  );
}
