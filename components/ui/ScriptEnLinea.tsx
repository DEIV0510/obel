"use client";

/**
 * Script en línea que se ejecuta durante el análisis del HTML (antes de la
 * primera pintura). En el cliente se marca como text/plain para que React no
 * advierta sobre <script> renderizados (patrón de la guía de Next.js 16).
 */
export function ScriptEnLinea({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
